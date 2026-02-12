using System.ComponentModel.DataAnnotations;

namespace FlowForge.Models
{
    public class UserConnection
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string ClerkUserId { get; set; }=String.Empty;
        [Required]
        public string ServiceName { get; set; } = string.Empty;
        [Required]
        public string EncryptedRefreshToken { get; set; }= String.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
