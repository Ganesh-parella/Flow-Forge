namespace FlowForge.Core.FlowParser.Models
{
    public class ParsedNode
    {
        public string Id { get; set; }=string.Empty;
        public string Type { get; set; } = string.Empty;
        public Dictionary<String, Object> Data { get; set; } = new();
        public bool Istrigger { get; set; }
    }
}
