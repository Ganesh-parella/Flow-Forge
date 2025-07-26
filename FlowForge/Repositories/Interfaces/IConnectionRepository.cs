using FlowForge.Models;

namespace FlowForge.Repositories.Interfaces
{
    public interface IConnectionRepository
    {


        Task<UserConnection> GetConnectionByServiceAsync(string clerkUserId, string serviceName);
        Task<UserConnection> AddOrUpdateConnectionAsync(string clerkUserId, string serviceName, string encryptedToken);
        Task<bool> DeleteConnectionAsync(string clerkUserId, string serviceName);
    }
}
