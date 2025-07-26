using FlowForge.Repositories;
using FlowForge.Repositories.Interfaces;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

using FlowForge.Repositories;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using FlowForge.Services.Interfaces;

namespace FlowForge.Services
{
    public class ConnectionService : IConnectionService
    {
        private readonly IConnectionRepository _connectionRepository;
        private readonly IDataProtectionProvider _protectionProvider;
        private readonly ILogger<ConnectionService> _logger;

        public ConnectionService(IConnectionRepository connectionRepository, IDataProtectionProvider protectionProvider, ILogger<ConnectionService> logger)
        {
            _connectionRepository = connectionRepository;
            _protectionProvider = protectionProvider;
            _logger = logger;
        }

        public async Task CreateConnectionAsync(string clerkUserId, string serviceName, string refreshToken)
        {
            var protector = _protectionProvider.CreateProtector($"Connection.RefreshToken.{serviceName}.v1");
            var encryptedToken = protector.Protect(refreshToken);

            await _connectionRepository.AddOrUpdateConnectionAsync(clerkUserId, serviceName, encryptedToken);
            _logger.LogInformation("Successfully saved {ServiceName} refresh token for user {ClerkUserId}", serviceName, clerkUserId);
        }

        public async Task<string> GetRefreshTokenAsync(string clerkUserId, string serviceName)
        {
            var connection = await _connectionRepository.GetConnectionByServiceAsync(clerkUserId, serviceName);
            if (connection == null)
            {
                _logger.LogWarning("No {ServiceName} connection found for user {ClerkUserId}", serviceName, clerkUserId);
                return null;
            }

            var protector = _protectionProvider.CreateProtector($"Connection.RefreshToken.{serviceName}.v1");
            return protector.Unprotect(connection.EncryptedRefreshToken);
        }

        // --- NEW METHOD IMPLEMENTATION ---
        public async Task<bool> DeleteConnectionAsync(string clerkUserId, string serviceName)
        {
            _logger.LogInformation("Attempting to delete {ServiceName} connection for user {ClerkUserId}", serviceName, clerkUserId);
            return await _connectionRepository.DeleteConnectionAsync(clerkUserId, serviceName);
        }
    }
}