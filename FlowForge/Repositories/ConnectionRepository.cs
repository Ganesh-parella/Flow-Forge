using FlowForge.Models;
using FlowForge.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FlowForge.Repositories
{
    public class ConnectionRepository:IConnectionRepository
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
        public async Task<IEnumerable<UserConnection>> GetConnectionsByClerkIdAsync(string clerkUserId)
        {
            return await _context.UserConnections
                .Where(c=>c.ClerkUserId == clerkUserId)
                .ToListAsync();
        }
        public async Task<UserConnection> AddOrUpdateConnectionAsync(string clerkUserId, string serviceName, string encryptedToken)
        {
            UserConnection existing = await _context.UserConnections.FirstOrDefaultAsync(c => c.ClerkUserId == clerkUserId && c.ServiceName == serviceName);
            if (existing != null)
            {
                existing.EncryptedRefreshToken = encryptedToken;
            }
            else
            {
                UserConnection newConnection = new UserConnection
                {
                    ClerkUserId = clerkUserId,
                    ServiceName = serviceName,
                    EncryptedRefreshToken = encryptedToken,
                    CreatedAt = DateTime.UtcNow
                };
                await _context.UserConnections.AddAsync(newConnection);
                existing = newConnection;
            }
            await _context.SaveChangesAsync();
            return existing;
        }
        public async Task<bool> DeleteConnectionAsync(string clerkUserId, string serviceName)
        {
            UserConnection connection = await _context.UserConnections
                .FirstOrDefaultAsync(c => c.ClerkUserId == clerkUserId && c.ServiceName == serviceName);
            if (connection==null)
            {
                return false;
            }
            else
            {
                _context.UserConnections.Remove(connection);
                await _context.SaveChangesAsync();
                return true;
            }
        }
    }
}
