namespace FlowForge.Core.FlowParser.Models
{
    public class Dag
    {
        public string Name { get; set; }
        public Dictionary<string, List<ParsedNode>> AdjList { get; set; } = new();
        public List<ParsedNode> NodesList { get; set; }
        public List<ParsedNode> TriggerNodes { get; set; }

    }
}
