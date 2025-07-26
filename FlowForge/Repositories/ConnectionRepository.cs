using FlowForge.Models;
using FlowForge.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
namespace FlowForge.Repositories
{
    public class ConnectionRepository : IConnectionRepository
    {
        private readonly AppDbContext _context;

        public ConnectionRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<UserConnection> GetConnectionByServiceAsync(string clerkUserId, string serviceName)
        {
            return await _context.UserConnections
                .FirstOrDefaultAsync(c => c.ClerkUserId == clerkUserId && c.ServiceName == serviceName);
        }

        public async Task<UserConnection> AddOrUpdateConnectionAsync(string clerkUserId, string serviceName, string encryptedToken)
        {
            var existingConnection = await GetConnectionByServiceAsync(clerkUserId, serviceName);

            if (existingConnection != null)
            {
                existingConnection.EncryptedRefreshToken = encryptedToken;
            }
            else
            {
                existingConnection = new UserConnection
                {
                    ClerkUserId = clerkUserId,
                    ServiceName = serviceName,
                    EncryptedRefreshToken = encryptedToken,
                    CreatedAt = DateTime.UtcNow
                };
                _context.UserConnections.Add(existingConnection);
            }

            await _context.SaveChangesAsync();
            return existingConnection;
        }

        // --- NEW METHOD IMPLEMENTATION ---
        public async Task<bool> DeleteConnectionAsync(string clerkUserId, string serviceName)
        {
            var connection = await GetConnectionByServiceAsync(clerkUserId, serviceName);
            if (connection == null)
            {
                return false; // Nothing to delete
            }

            _context.UserConnections.Remove(connection);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}