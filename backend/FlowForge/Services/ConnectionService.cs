using FlowForge.Models;
using FlowForge.Repositories.Interfaces;
using FlowForge.Services.Interfaces;
using Microsoft.AspNetCore.DataProtection;

namespace FlowForge.Services
{
    public class ConnectionService : IConnectionService
    {
        private readonly IConnectionRepository _connectionRepository;
        private readonly ILogger<ConnectionService> _logger;
        private readonly IDataProtector _dataProtector;

        public ConnectionService(
            IConnectionRepository connectionRepository,
            ILogger<ConnectionService> logger,
            IDataProtectionProvider dataProtectionProvider)
        {
            _connectionRepository = connectionRepository;
            _logger = logger;
            _dataProtector = dataProtectionProvider.CreateProtector("UserConnectionProtector");
        }

        public async Task AddOrUpdateConnectionAsync(
            string clerkUserId,
            string serviceName,
            string refreshToken)
        {
            var encryptedToken = _dataProtector.Protect(refreshToken);

            await _connectionRepository.AddOrUpdateConnectionAsync(
                clerkUserId,
                serviceName,
                encryptedToken
            );
        }

        public async Task<IEnumerable<UserConnection>> GetAllByUserAsync(
            string clerkUserId)
        {
            return await _connectionRepository.GetConnectionsByClerkIdAsync(
                clerkUserId
            );
        }

        public async Task<string?> GetRefreshTokenAsync(
            string clerkUserId,
            string serviceName)
        {
            var connection =
                await _connectionRepository.GetConnectionByServiceAsync(
                    clerkUserId,
                    serviceName
                );

            if (connection == null)
            {
                _logger.LogWarning(
                    "No connection found for user {ClerkUserId} and service {ServiceName}",
                    clerkUserId,
                    serviceName
                );
                return null;
            }

            return _dataProtector.Unprotect(connection.EncryptedRefreshToken);
        }

        public async Task<bool> DeleteConnectionAsync(
            string clerkUserId,
            string serviceName)
        {
            return await _connectionRepository.DeleteConnectionAsync(
                clerkUserId,
                serviceName
            );
        }
    }
}
