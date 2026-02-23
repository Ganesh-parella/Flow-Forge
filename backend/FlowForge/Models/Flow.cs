using System.Text.Json.Nodes;

namespace FlowForge.Models
{
    public class Flow
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ClearkUId { get; set; }
        public string DefinitionJson { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

    }
}
