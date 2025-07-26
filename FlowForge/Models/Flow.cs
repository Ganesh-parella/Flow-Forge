namespace FlowForge.Models
{
    public class Flow
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

      
        public string DefinitionJson { get; set; } = string.Empty;

   
        public string ClerkUserId { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

}
