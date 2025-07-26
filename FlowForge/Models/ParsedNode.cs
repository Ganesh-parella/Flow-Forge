namespace FlowForge.Models
{
    public class ParsedNode
    {
        public string Id { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public Dictionary<string, object> Data { get; set; } = new();
        public bool IsTrigger { get; set; }
    }

}
