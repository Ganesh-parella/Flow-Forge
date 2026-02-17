using System.Text.Json.Nodes;

namespace FlowForge.Dtos
{
    public class CreateFlowDto
    {
        public string Name { get; set; } = string.Empty;
        public string DefinitionJson { get; set; } = string.Empty;
    }
}
