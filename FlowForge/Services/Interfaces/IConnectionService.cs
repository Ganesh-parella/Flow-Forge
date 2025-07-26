namespace FlowForge.Services.Interfaces
{
    public interface IConnectionService
    {
        Task CreateConnectionAsync(string clerkUserId, string serviceName, string refreshToken);
        Task<string> GetRefreshTokenAsync(string clerkUserId, string serviceName);
        Task<bool> DeleteConnectionAsync(string clerkUserId, string serviceName); // New method
    }
}
