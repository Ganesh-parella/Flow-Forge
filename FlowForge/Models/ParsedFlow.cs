namespace FlowForge.Models
{
    public class ParsedFlow
    {
        public List<ParsedNode> Nodes { get; set; } = new();
        public List<ParsedEdge> Edges { get; set; } = new();

        public string FlowName { get; set; } = string.Empty;
    }

}
