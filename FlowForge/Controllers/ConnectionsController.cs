using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Gmail.v1;
using Google.Apis.Sheets.v4;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using FlowForge.Services.Interfaces;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;
using Google.Apis.Auth.OAuth2.Requests;

namespace FlowForge.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ConnectionsController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IConnectionService _connectionService;
        private readonly ILogger<ConnectionsController> _logger;

        public ConnectionsController(IConfiguration configuration, IConnectionService connectionService, ILogger<ConnectionsController> logger)
        {
            _configuration = configuration;
            _connectionService = connectionService;
            _logger = logger;
        }

        [HttpGet("google/connect-url")]
        public IActionResult GetGoogleConnectUrl()
        {
            var clerkUserId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            if (string.IsNullOrEmpty(clerkUserId))
            {
                return Unauthorized("User not authenticated.");
            }

            var redirectUrl = Url.Action(nameof(GoogleCallback), "Connections", null, Request.Scheme);
            var scopes = new List<string>
            {
                GmailService.Scope.GmailSend,
                SheetsService.Scope.Spreadsheets
            };

            var request = new GoogleAuthorizationCodeRequestUrl(new Uri("https://accounts.google.com/o/oauth2/auth"))
            {
                ClientId = _configuration["Google:ClientId"],
                RedirectUri = redirectUrl,
                Scope = string.Join(" ", scopes),
                AccessType = "offline",
                Prompt = "consent",  // ensures a refresh token
                State = clerkUserId,
            };

            return Ok(new { url = request.Build().ToString() });
        }

        [HttpGet("google/callback")]
        [AllowAnonymous]
        public async Task<IActionResult> GoogleCallback([FromQuery] string code, [FromQuery] string state)
        {
            var clerkUserId = state;
            if (string.IsNullOrEmpty(clerkUserId))
            {
                _logger.LogError("State (user identifier) missing from Google OAuth callback.");
                return BadRequest("State missing.");
            }

            var redirectUrl = Url.Action(nameof(GoogleCallback), "Connections", null, Request.Scheme);
            var scopes = new List<string>
            {
                GmailService.Scope.GmailSend,
                SheetsService.Scope.Spreadsheets
            };

            var flow = new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
            {
                ClientSecrets = new ClientSecrets
                {
                    ClientId = _configuration["Google:ClientId"],
                    ClientSecret = _configuration["Google:ClientSecret"]
                },
                Scopes = scopes
            });

            var token = await flow.ExchangeCodeForTokenAsync(clerkUserId, code, redirectUrl, CancellationToken.None);

            if (string.IsNullOrEmpty(token.RefreshToken))
            {
                _logger.LogError("No refresh token received from Google for user {ClerkUserId}.", clerkUserId);
                return BadRequest("Refresh token not received from Google.");
            }

            await _connectionService.CreateConnectionAsync(clerkUserId, "Google", token.RefreshToken);

            // Redirect user to frontend connections page
            return Redirect("http://localhost:5173/connections?status=success");
        }

        [HttpDelete("google/disconnect")]
        public async Task<IActionResult> DisconnectGoogle()
        {
            var clerkUserId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            if (string.IsNullOrEmpty(clerkUserId))
            {
                return Unauthorized("User not authenticated.");
            }

            var deleted = await _connectionService.DeleteConnectionAsync(clerkUserId, "Google");
            if (!deleted)
            {
                _logger.LogWarning("Attempted to delete non-existent Google connection for user {ClerkUserId}.", clerkUserId);
            }

            return Ok(new { message = "Google connection removed successfully." });
        }

        [HttpGet]
        public async Task<IActionResult> GetConnections()
        {
            var clerkUserId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            if (string.IsNullOrEmpty(clerkUserId))
            {
                return Unauthorized("User not authenticated.");
            }

            var hasGoogleConnection = await _connectionService.GetRefreshTokenAsync(clerkUserId, "Google") != null;

            return Ok(new { google = hasGoogleConnection });
        }
    }
}
