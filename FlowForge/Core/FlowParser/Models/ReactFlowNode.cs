using System.Text.Json;

namespace FlowForge.Core.FlowParser.Models
{
    internal class ReactFlowNode
    {
        public string Id { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public JsonElement Data { get; set; }  // flexible structure per node type
    }
}
