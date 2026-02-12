using FlowForge.Core.Interfaces;
using FlowForge.Core;
using FlowForge.Services.Interfaces;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Gmail.v1;
using Google.Apis.Services;
using MimeKit;
using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;

namespace FlowForge.Nodes.Actions
{
    /// <summary>
    /// Corresponds to the 'gmail-send-action' type.
    /// This is the final, functional implementation.
    /// </summary>
    public class GmailSendActionNode : IAction
    {
        public string Type => "gmail-send-action";

        // Fix: Made properties nullable to prevent "Non-nullable property must contain a non-null value" warnings
        private class NodeData
        {
            public string? To { get; set; }
            public string? Subject { get; set; }
            public string? Body { get; set; }
        }

        public async Task<Dictionary<string, object>> ExecuteAsync(FlowExecutionContext context, IServiceProvider services)
        {
            var logger = services.GetRequiredService<ILogger<GmailSendActionNode>>();
            var connectionService = services.GetRequiredService<IConnectionService>();
            var configuration = services.GetRequiredService<IConfiguration>();

            var config = context.NodeConfiguration.Deserialize<NodeData>(new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            // Fix: Add explicit validation since properties are now nullable
            if (config == null || string.IsNullOrWhiteSpace(config.To))
            {
                throw new InvalidOperationException("Gmail action configuration is invalid: 'To' address is required.");
            }

            var refreshToken = await connectionService.GetRefreshTokenAsync(context.ClerkUserId, "Google");
            if (string.IsNullOrEmpty(refreshToken))
            {
                throw new InvalidOperationException($"User {context.ClerkUserId} has not connected their Google account.");
            }

            // 1. Apply the templating logic to the subject and body.
            // Fix: Handle nulls safely using ?? string.Empty
            string finalSubject = ReplacePlaceholders(config.Subject ?? string.Empty, context.Payload);
            string finalBody = ReplacePlaceholders(config.Body ?? string.Empty, context.Payload);

            logger.LogInformation("Attempting to send email for user {ClerkUserId} to {Recipient}", context.ClerkUserId, config.To);

            var credential = new UserCredential(new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
            {
                ClientSecrets = new ClientSecrets
                {
                    ClientId = configuration["Google:ClientId"],
                    ClientSecret = configuration["Google:ClientSecret"]
                }
            }), context.ClerkUserId, new Google.Apis.Auth.OAuth2.Responses.TokenResponse { RefreshToken = refreshToken });

            var gmailService = new GmailService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = "FlowForge"
            });

            var message = new MimeMessage();
            message.To.Add(MailboxAddress.Parse(config.To));
            message.Subject = finalSubject;
            message.Body = new TextPart("plain") { Text = finalBody };

            var rawMessage = Base64UrlEncode(message.ToString());
            var result = await gmailService.Users.Messages.Send(new Google.Apis.Gmail.v1.Data.Message { Raw = rawMessage }, "me").ExecuteAsync();

            logger.LogInformation("Email sent successfully. Message ID: {MessageId}", result.Id);

            return new Dictionary<string, object>
            {
                { "gmailMessageId", result.Id }
            };
        }

        /// <summary>
        /// A simple templating function that replaces placeholders like {{payload.key}}
        /// with values from the provided payload dictionary.
        /// </summary>
        private string ReplacePlaceholders(string template, IReadOnlyDictionary<string, object> payload)
        {
            if (string.IsNullOrEmpty(template))
            {
                return string.Empty;
            }

            // Use a regular expression to find all occurrences of {{payload.someKey}}
            return Regex.Replace(template, @"\{\{payload\.(\w+)\}\}", match =>
            {
                string key = match.Groups[1].Value;

                if (payload.TryGetValue(key, out object? value))
                {
                    return value?.ToString() ?? string.Empty;
                }
                return string.Empty;
            });
        }

        private string Base64UrlEncode(string input)
        {
            var inputBytes = System.Text.Encoding.UTF8.GetBytes(input);
            return Convert.ToBase64String(inputBytes).TrimEnd('=').Replace('+', '-').Replace('/', '_');
        }
    }
}