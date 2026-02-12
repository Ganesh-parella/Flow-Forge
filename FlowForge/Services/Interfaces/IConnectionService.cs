using FlowForge.Models;

namespace FlowForge.Services.Interfaces
{
    public interface IConnectionService
    {
        Task AddOrUpdateConnectionAsync(
            string clerkUserId,
            string serviceName,
            string refreshToken
        );

        Task<IEnumerable<UserConnection>> GetAllByUserAsync(
            string clerkUserId
        );

        // ✅ Nullable because connection may not exist
        Task<string?> GetRefreshTokenAsync(
            string clerkUserId,
            string serviceName
        );

        Task<bool> DeleteConnectionAsync(
            string clerkUserId,
            string serviceName
        );
    }
}
