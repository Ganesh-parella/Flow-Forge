using System.Text.Json;
using FlowForge.Core.FlowParser.Models;
using FlowForge.Core.FlowParser;
using FlowForge.Core.Interfaces;
using FlowForge.Core;

namespace FlowForge.Core
{
    public class FlowEngine
    {
        private IServiceProvider _serviceProvider;
        private ILogger<FlowEngine> _logger;
        private IEnumerable<INode> _availableNodes;
        private DagConvertor _dagConvertor;
        private TopoSortGenerator _topoSortGenerator;

        public FlowEngine(IServiceProvider serviceProvider, ILogger<FlowEngine> logger, IEnumerable<INode> availableNodes, DagConvertor dagConvertor, TopoSortGenerator topoSortGenerator)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
            _availableNodes = availableNodes;
            _dagConvertor = dagConvertor;
            _topoSortGenerator = topoSortGenerator;
        }
        public async Task RunFlowAsync(ParsedFlow flow, string clerkUserId, Dictionary<string, object> intialPayLoad = null)
        {
            var PayLoad = intialPayLoad ?? new Dictionary<string, object>();
            Dag dag;
            try
            {
                dag = _dagConvertor.ParsedFlowToDag(flow);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error converting flow to DAG for user {ClerkUserId}", clerkUserId);
                throw;
            }
            await RunFlowAsync(dag, clerkUserId, PayLoad);

        }
        public async Task RunFlowAsync(Dag dag, string clerkUserId, Dictionary<string, object> intialPayLoad = null)
        {
            var PayLoad = intialPayLoad ?? new Dictionary<string, object>();
            List<ParsedNode> executionOrder;
            try
            {
                executionOrder = _topoSortGenerator.GetTopologicalOrder(dag);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating topological order for DAG for user {ClerkUserId}", clerkUserId);
                throw;
            }
            await RunFlowAsync(executionOrder, dag.Name, clerkUserId, PayLoad);
        }
        public async Task RunFlowAsync(List<ParsedNode> nodes, string flowName, string clerkUserId, Dictionary<string, object> intialPayLoad = null)
        {
            var payLoad = intialPayLoad ?? new Dictionary<string, object>();
            if (nodes == null || nodes.Count == 0)
            {
                _logger.LogWarning("No nodes to execute in flow {flowName}", flowName);
                return;
            }
            foreach (var node in nodes)
            {
                var executor = _availableNodes.FirstOrDefault(n => n.Type == node.Type);

                if (executor == null)
                {
                    throw new InvalidOperationException($"Node executor for type '{node.Type}' not found.");
                }
                FlowExecutionContext context = new FlowExecutionContext(clerkUserId, payLoad, ConvertToJsonElement(node.Data));

                Dictionary<string, object> output;
                try
                {
                    output = await executor.ExecuteAsync(context, _serviceProvider);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex,
                        "Error executing node {NodeId} (type {NodeType}) in flow {FlowName}",
                        node.Id, node.Type, flowName);

                    throw; // stop flow execution
                }
                // Merge output payload into current payload
                if (output != null)
                {
                    foreach (var kvp in output)
                    {
                        payLoad[kvp.Key] = kvp.Value;
                    }
                }
                else
                {

                    _logger.LogDebug("Node {NodeId} returned no payload or empty payload.", node.Id);
                }

            }
            _logger.LogInformation("Flow '{FlowName}' complete. Final payload: {@Payload}", flowName, payLoad);
            return;
        }
        private JsonElement ConvertToJsonElement(object? obj)
        {
            if (obj == null) return default;
            var json = System.Text.Json.JsonSerializer.Serialize(obj);
            return System.Text.Json.JsonSerializer.Deserialize<JsonElement>(json);
        }
    }
}
