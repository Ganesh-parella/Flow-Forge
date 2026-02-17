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

        // HARDCODED REDIRECT URI for Production (Must match Google Cloud Console exactly)
        private const string GoogleRedirectUri = "https://flow-forge-2txl.onrender.com/api/Connections/google/callback";
        private const string FrontendSuccessUrl = "https://flow-forge-dusky.vercel.app/connections?status=success";

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
                return Unauthorized("User ID not found in token.");

            var scopes = new List<string>
            {
                GmailService.Scope.GmailSend,
                SheetsService.Scope.Spreadsheets
            };

            var request = new GoogleAuthorizationCodeRequestUrl(new Uri("https://accounts.google.com/o/oauth2/auth"))
            {
                ClientId = _configuration["Google:ClientId"],
                RedirectUri = GoogleRedirectUri, // Using hardcoded HTTPS URI
                Scope = string.Join(" ", scopes),
                AccessType = "offline",
                Prompt = "consent", // Ensures a refresh token is provided
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

            try
            {
                var token = await flow.ExchangeCodeForTokenAsync(clerkUserId, code, GoogleRedirectUri, CancellationToken.None);

                if (string.IsNullOrEmpty(token.RefreshToken))
                {
                    _logger.LogError("No refresh token received from Google for user {ClerkUserId}. User might need to revoke access and try again.", clerkUserId);
                    return BadRequest("Refresh token not received. Please remove 'FlowForge' from your Google Security settings and try again.");
                }

                await _connectionService.AddOrUpdateConnectionAsync(clerkUserId, "Google", token.RefreshToken);

                // Redirect user to live Vercel frontend connections page
                return Redirect(FrontendSuccessUrl);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error exchanging code for token for user {ClerkUserId}", clerkUserId);
                return StatusCode(500, "Internal server error during Google authentication.");
            }
        }

        [HttpDelete("google/disconnect")]
        public async Task<IActionResult> DisconnectGoogle()
        {
            var clerkUserId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            if (string.IsNullOrEmpty(clerkUserId)) return Unauthorized();

            var deleted = await _connectionService.DeleteConnectionAsync(clerkUserId, "Google");
            return Ok(new { message = "Google connection removed successfully." });
        }

        [HttpGet]
        public async Task<IActionResult> GetConnections()
        {
            var clerkUserId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            if (string.IsNullOrEmpty(clerkUserId)) return Unauthorized();

            var hasGoogleConnection = await _connectionService.GetRefreshTokenAsync(clerkUserId, "Google") != null;
            return Ok(new { google = hasGoogleConnection });
        }
    }
}