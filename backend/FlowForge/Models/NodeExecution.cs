namespace FlowForge.Models
{
    public class NodeExecution
    {
        public Guid Id { get; set; }
        public Guid FlowInstanceId { get; set; }
        public string NodeId { get; set; } = string.Empty; 
        public string Status { get; set; } = "pending"; 
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime StartedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        
        public string? ErrorMessage { get; set; }
        public FlowInstance FlowInstance { get; set; } = null!;
    }
}
