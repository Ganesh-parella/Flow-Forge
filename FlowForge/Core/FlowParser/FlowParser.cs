using System.Text.Json;
using FlowForge.Core.FlowParser.Models;
using FlowForge.Core.Interfaces;

namespace FlowForge.Core.FlowParser
{
    


    public class FlowParser
    {
        private readonly IEnumerable<INode> _registeredNodes;
        public FlowParser(IEnumerable<INode> registeredNodes)
        {   
            _registeredNodes=registeredNodes;
        }
        public ParsedFlow Parse(string flowName, string definitionJson)
        {
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var reactFlowDefinition=JsonSerializer.Deserialize<ReactFlowDefinition>(definitionJson, options);
            if(reactFlowDefinition== null)
            {
                throw new System.InvalidOperationException("Failed to deserialize flow definition JSON.");
            }
            ParsedFlow flow=new ParsedFlow() { Name=flowName };
           HashSet<string> triggers=_registeredNodes.OfType<ITrigger>().Select(t=>t.Type).ToHashSet();
            foreach(var node in reactFlowDefinition.Nodes)
            {
                var nodeData=JsonSerializer.Deserialize<Dictionary<string,object>>(node.Data.GetRawText(),options)
                    ?? new Dictionary<string, object>();
                flow.Nodes.Add(new ParsedNode
                {
                    Id = node.Id,
                    Type = node.Type,
                    Data = nodeData,
                    Istrigger = triggers.Contains(node.Type)
                });

            }
            foreach (var edge in reactFlowDefinition.Edges)
            {
                flow.Edges.Add(new ParsedEdge
                {
                    SourceNodeId = edge.Source,
                    TargetNodeId = edge.Target
                });
            }
            return flow;
        }

    }
}
