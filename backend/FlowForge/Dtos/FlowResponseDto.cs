using System.Text.Json.Nodes;

namespace FlowForge.Dtos
{
    public class FlowResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string ClearkUerId { get; set; } = string.Empty;
        public string DefinitionJson { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

}
