namespace FlowForge.Core.FlowParser.Models
{
    public class ParsedFlow
    {
        public string Name { get; set; } = string.Empty;
        public List<ParsedNode> Nodes { get; set; } = new();
        public List<ParsedEdge> Edges { get; set; } = new();
    }
}
