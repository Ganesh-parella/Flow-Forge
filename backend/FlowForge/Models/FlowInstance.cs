namespace FlowForge.Models
{
    public class FlowInstance
    {
        public Guid Id { get; set; }
        public int FlowId { get; set; }
        public string ClerkUserId { get; set; } = string.Empty;
        public string Status { get; set; } = "running";
        public DateTime StartedAt { get; set; }= DateTime.UtcNow;
        public DateTime? CompletedAt { get; set; }

        public Flow Flow { get; set; }= null!;
        public ICollection<NodeExecution> NodeExecutions { get; set; } = new List<NodeExecution>();
    }
}
