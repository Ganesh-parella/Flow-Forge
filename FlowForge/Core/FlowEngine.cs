using FlowForge.Core;
using FlowForge.Core.Interfaces;
using FlowForge.Models;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace FlowForge.Engine
{
    public class FlowEngine
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<FlowEngine> _logger;
        private readonly IEnumerable<INode> _availableNodes;

        public FlowEngine(IServiceProvider serviceProvider, ILogger<FlowEngine> logger, IEnumerable<INode> availableNodes)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
            _availableNodes = availableNodes;
        }

        // UPDATED: The RunAsync method now accepts an optional initialPayload dictionary.
        public async Task RunAsync(ParsedFlow flow, string clerkUserId, Dictionary<string, object> initialPayload = null)
        {
            // For a manual run, the payload starts empty. For a webhook, it starts with the webhook's data.
            var payload = initialPayload ?? new Dictionary<string, object>();

            var currentNode = flow.Nodes.FirstOrDefault(n => n.IsTrigger);

            if (currentNode == null)
            {
                _logger.LogWarning("Flow '{FlowName}' has no trigger node and cannot be run.", flow.FlowName);
                return;
            }

            while (currentNode != null)
            {
                var executor = _availableNodes.FirstOrDefault(n => n.Type == currentNode.Type);

                if (executor == null)
                {
                    throw new InvalidOperationException($"Node executor for type '{currentNode.Type}' not found.");
                }

                // The context now correctly includes the payload from the previous step (or the initial webhook data).
                var context = new FlowExecutionContext(clerkUserId, payload, ConvertToJsonElement(currentNode.Data));

                var output = await executor.ExecuteAsync(context, _serviceProvider);

                if (output != null)
                {
                    foreach (var kvp in output)
                    {
                        payload[kvp.Key] = kvp.Value;
                    }
                }

                var nextEdge = flow.Edges.FirstOrDefault(e => e.SourceNodeId == currentNode.Id);
                currentNode = nextEdge != null ? flow.Nodes.FirstOrDefault(n => n.Id == nextEdge.TargetNodeId) : null;
            }

            _logger.LogInformation("Flow '{FlowName}' complete. Final payload: {@Payload}", flow.FlowName, payload);
        }

        private static JsonElement ConvertToJsonElement(Dictionary<string, object> dict)
        {
            if (dict == null) return default;
            var json = JsonSerializer.Serialize(dict);
            return JsonSerializer.Deserialize<JsonElement>(json);
        }
    }
}
