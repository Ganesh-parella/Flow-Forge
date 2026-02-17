using System.Text.Json;
using FlowForge.Core.FlowParser.Models;
using FlowForge.Core.FlowParser;
using FlowForge.Core.Interfaces;
using FlowForge.Repositories;
using FlowForge.Repositories.Interfaces;

namespace FlowForge.Core
{
    public class FlowEngine
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<FlowEngine> _logger;
        private readonly IEnumerable<INode> _availableNodes;
        private readonly DagConvertor _dagConvertor;
        private readonly NodeExecutionRepository _nodeExecutionRepository;
        private readonly IFlowInstanceRepository _flowInstanceRepository;

        public FlowEngine(
            IServiceProvider serviceProvider,
            ILogger<FlowEngine> logger,
            IEnumerable<INode> availableNodes,
            DagConvertor dagConvertor,
            NodeExecutionRepository nodeExecutionRepository,
            IFlowInstanceRepository flowInstanceRepository)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
            _availableNodes = availableNodes;
            _dagConvertor = dagConvertor;
            _nodeExecutionRepository = nodeExecutionRepository;
            _flowInstanceRepository = flowInstanceRepository;
        }

        // Allows service to reuse DAG building logic
        public Dag BuildDag(ParsedFlow parsedFlow)
        {
            return _dagConvertor.ParsedFlowToDag(parsedFlow);
        }

        // ============================================================
        // 🚀 Persistent DAG Scheduler
        // ============================================================

        public async Task RunPersistentAsync(
            Guid flowInstanceId,
            ParsedFlow parsedFlow,
            string clerkUserId,
            Dictionary<string, object>? initialPayload = null)
        {
            var payload = initialPayload ?? new Dictionary<string, object>();
            var dag = _dagConvertor.ParsedFlowToDag(parsedFlow);

            while (true)
            {
                // Fail fast
                if (await _nodeExecutionRepository.AnyFailedAsync(flowInstanceId))
                {
                    await _flowInstanceRepository.MarkFailedAsync(flowInstanceId);
                    return;
                }

                // Complete if done
                if (await _nodeExecutionRepository.AllCompletedAsync(flowInstanceId))
                {
                    await _flowInstanceRepository.MarkCompletedAsync(flowInstanceId);
                    return;
                }

                var nodeExecution =
                    await _nodeExecutionRepository.GetNextReadyNodeAsync(flowInstanceId);

                if (nodeExecution == null)
                {
                    await Task.Delay(50);
                    continue;
                }

                await _nodeExecutionRepository.MarkRunningAsync(nodeExecution.Id);

                var parsedNode =
                    parsedFlow.Nodes.First(n => n.Id == nodeExecution.NodeId);

                try
                {
                    var output = await ExecuteNodeAsync(
                        parsedNode,
                        parsedFlow.Name,
                        clerkUserId,
                        payload);

                    await _nodeExecutionRepository
                        .MarkCompletedAsync(nodeExecution.Id);

                    if (output != null)
                    {
                        foreach (var kvp in output)
                            payload[kvp.Key] = kvp.Value;
                    }

                    await UnlockChildrenAsync(
                        flowInstanceId,
                        dag,
                        parsedNode.Id);
                }
                catch (Exception ex)
                {
                    await _nodeExecutionRepository
                        .MarkFailedAsync(nodeExecution.Id, ex.Message);
                }
            }
        }

        private async Task<Dictionary<string, object>?> ExecuteNodeAsync(
            ParsedNode node,
            string flowName,
            string clerkUserId,
            Dictionary<string, object> payload)
        {
            var executor =
                _availableNodes.FirstOrDefault(n => n.Type == node.Type);

            if (executor == null)
                throw new InvalidOperationException(
                    $"Executor for node type '{node.Type}' not found.");

            var context = new FlowExecutionContext(
                clerkUserId,
                payload,
                ConvertToJsonElement(node.Data));

            return await executor.ExecuteAsync(context, _serviceProvider);
        }

        private async Task UnlockChildrenAsync(
            Guid flowInstanceId,
            Dag dag,
            string completedNodeId)
        {
            if (!dag.AdjList.TryGetValue(completedNodeId, out var children))
                return;

            foreach (var child in children)
            {
                if (!dag.ReverseAdjList.TryGetValue(child.Id, out var parents))
                    continue;

                var allParentsCompleted =
                    await _nodeExecutionRepository
                        .AreAllParentsCompletedAsync(flowInstanceId, parents);

                if (allParentsCompleted)
                {
                    await _nodeExecutionRepository
                        .MarkReadyAsync(flowInstanceId, child.Id);
                }
            }
        }

        private JsonElement ConvertToJsonElement(object? obj)
        {
            if (obj == null) return default;
            var json = JsonSerializer.Serialize(obj);
            return JsonSerializer.Deserialize<JsonElement>(json);
        }
    }
}
