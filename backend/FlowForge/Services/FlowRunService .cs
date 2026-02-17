using FlowForge.Core;
using FlowForge.Core.FlowParser;
using FlowForge.Repositories;
using FlowForge.Repositories.Interfaces;
using FlowForge.Services.Interfaces;

namespace FlowForge.Services
{
    public class FlowRunService : IFlowRunService
    {
        private readonly IFlowRepository _flowRepository;
        private readonly IFlowInstanceRepository _flowInstanceRepository;
        private readonly NodeExecutionRepository _nodeExecutionRepository;
        private readonly FlowParser _flowParser;
        private readonly FlowEngine _flowEngine;
        private readonly ILogger<FlowRunService> _logger;

        public FlowRunService(
            IFlowRepository flowRepository,
            IFlowInstanceRepository flowInstanceRepository,
            NodeExecutionRepository nodeExecutionRepository,
            FlowParser flowParser,
            FlowEngine flowEngine,
            ILogger<FlowRunService> logger)
        {
            _flowRepository = flowRepository;
            _flowInstanceRepository = flowInstanceRepository;
            _nodeExecutionRepository = nodeExecutionRepository;
            _flowParser = flowParser;
            _flowEngine = flowEngine;
            _logger = logger;
        }

        public async Task RunFlowAsync(int flowId, string clerkUserId)
        {
            await RunInternalAsync(flowId, clerkUserId, new Dictionary<string, object>());
        }

        public async Task RunFlowFromWebhookAsync(
            string clerkUserId,
            int flowId,
            Dictionary<string, object> initialPayload)
        {
            await RunInternalAsync(flowId, clerkUserId, initialPayload);
        }

        private async Task RunInternalAsync(
            int flowId,
            string clerkUserId,
            Dictionary<string, object> initialPayload)
        {
            var flow = await _flowRepository.GetByIdAsync(clerkUserId, flowId);

            if (flow == null)
            {
                _logger.LogError("Flow {FlowId} not found for user {UserId}", flowId, clerkUserId);
                return;
            }

            var parsedFlow = _flowParser.Parse(flow.Name, flow.DefinitionJson);

            if (parsedFlow == null)
            {
                _logger.LogError("Failed to parse flow {FlowId}", flowId);
                return;
            }

            // 1️⃣ Create FlowInstance
            var flowInstance =
                await _flowInstanceRepository
                    .CreateFlowInstanceAsync(flowId, clerkUserId);

            // 2️⃣ Create NodeExecutions
            var nodeIds = parsedFlow.Nodes
                .Select(n => n.Id)
                .ToList();

            await _nodeExecutionRepository
                .CreateNodeExecutionsAsync(flowInstance.Id, nodeIds);

            // 3️⃣ Mark zero-dependency nodes as Ready
            var dag = _flowEngine.BuildDag(parsedFlow);

            foreach (var node in parsedFlow.Nodes)
            {
                if (!dag.ReverseAdjList.ContainsKey(node.Id) ||
                    dag.ReverseAdjList[node.Id].Count == 0)
                {
                    await _nodeExecutionRepository
                        .MarkReadyAsync(flowInstance.Id, node.Id);
                }
            }

            // 4️⃣ Start persistent scheduler
            await _flowEngine.RunPersistentAsync(
                flowInstance.Id,
                parsedFlow,
                clerkUserId,
                initialPayload
            );
        }
    }
}
