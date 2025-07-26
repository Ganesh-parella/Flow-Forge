using System.ComponentModel.DataAnnotations;

namespace FlowForge.Models
{
    public class UserConnection
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string ClerkUserId { get; set; } = string.Empty; // FIX: Initialize to prevent CS8618 warning.
        [Required]
        public string ServiceName { get; set; } = string.Empty; // FIX: Initialize to prevent CS8618 warning.
        [Required]
        public string EncryptedRefreshToken { get; set; } = string.Empty; // FIX: Initialize to prevent CS8618 warning.
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
