namespace FlowForge.Core.FlowParser.Models
{
    internal class ReactFlowDefinition
    {
        public List<ReactFlowNode> Nodes { get; set; } = new();
        public List<ReactFlowEdge> Edges { get; set; } = new();
    }

}
