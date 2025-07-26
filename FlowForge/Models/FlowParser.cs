using FlowForge.Core.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;

namespace FlowForge.Models
{
    // Helper classes to model the incoming React Flow JSON structure.
    // These are used internally by the parser.
    internal class ReactFlowDefinition
    {
        public List<ReactFlowNode> Nodes { get; set; } = new();
        public List<ReactFlowEdge> Edges { get; set; } = new();
    }

    internal class ReactFlowNode
    {
        public string Id { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public JsonElement Data { get; set; }
    }

    internal class ReactFlowEdge
    {
        public string Id { get; set; } = string.Empty;
        public string Source { get; set; } = string.Empty;
        public string Target { get; set; } = string.Empty;
    }

    /// <summary>
    /// Parses the raw React Flow JSON into an engine-ready ParsedFlow object.
    /// Its primary job is to correctly identify the trigger node.
    /// </summary>
    public class FlowParser
    {
        private readonly IEnumerable<INode> _registeredNodes;

        /// <summary>
        /// The parser needs to know about all available nodes to identify which ones are triggers.
        /// </summary>
        /// <param name="registeredNodes">A collection of all INode implementations from the DI container.</param>
        public FlowParser(IEnumerable<INode> registeredNodes)
        {
            _registeredNodes = registeredNodes;
        }

        public ParsedFlow Parse(string flowName, string jsonDefinition)
        {
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var reactFlowDefinition = JsonSerializer.Deserialize<ReactFlowDefinition>(jsonDefinition, options);

            if (reactFlowDefinition == null)
            {
                throw new System.InvalidOperationException("Failed to deserialize flow definition JSON.");
            }

            var parsedFlow = new ParsedFlow { FlowName = flowName };

            // Get a list of all registered trigger types (e.g., "trigger", "webhook-trigger")
            var triggerTypes = _registeredNodes.OfType<ITrigger>().Select(t => t.Type).ToHashSet();

            foreach (var node in reactFlowDefinition.Nodes)
            {
                // Convert the JsonElement 'Data' into the Dictionary<string, object> required by ParsedNode
                var dataDict = JsonSerializer.Deserialize<Dictionary<string, object>>(node.Data.GetRawText(), options)
                               ?? new Dictionary<string, object>();

                parsedFlow.Nodes.Add(new ParsedNode
                {
                    Id = node.Id,
                    Type = node.Type,
                    Data = dataDict,
                    // This is the crucial step: check if the node's type is in our list of triggers.
                    IsTrigger = triggerTypes.Contains(node.Type)
                });
            }

            foreach (var edge in reactFlowDefinition.Edges)
            {
                parsedFlow.Edges.Add(new ParsedEdge
                {
                    SourceNodeId = edge.Source,
                    TargetNodeId = edge.Target
                });
            }

            return parsedFlow;
        }
    }
}
