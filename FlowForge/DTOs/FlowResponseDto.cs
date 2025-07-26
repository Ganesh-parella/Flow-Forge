namespace FlowForge.DTOs
{
    public class FlowResponseDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string DefinitionJson { get; set; } = string.Empty;

        public string ClerkUserId { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }
    }
}
