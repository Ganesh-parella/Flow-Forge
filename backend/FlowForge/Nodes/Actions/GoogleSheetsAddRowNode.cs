using FlowForge.Core;
using FlowForge.Core.Interfaces;
using FlowForge.Services.Interfaces;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Services;
using Google.Apis.Sheets.v4;
using Google.Apis.Sheets.v4.Data;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Text.RegularExpressions; // Required for templating
using System.Threading.Tasks;

namespace FlowForge.Nodes.Actions
{
    /// <summary>
    /// An action node that adds a new row to a specified Google Sheet.
    /// </summary>
    public class GoogleSheetsAddRowNode : IAction
    {
        public string Type => "google-sheets-add-row-action";

        private class NodeData
        {
            public string SpreadsheetId { get; set; }
            public string SheetName { get; set; }
            public string RowValues { get; set; } // e.g., "Value A,{{payload.key}},Value C"
        }

        public async Task<Dictionary<string, object>> ExecuteAsync(FlowExecutionContext context, IServiceProvider services)
        {
            var logger = services.GetRequiredService<ILogger<GoogleSheetsAddRowNode>>();
            var connectionService = services.GetRequiredService<IConnectionService>();
            var configuration = services.GetRequiredService<IConfiguration>();

            var config = context.NodeConfiguration.Deserialize<NodeData>(new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            if (config == null || string.IsNullOrWhiteSpace(config.SpreadsheetId) || string.IsNullOrWhiteSpace(config.SheetName))
            {
                throw new InvalidOperationException("Google Sheets configuration is invalid. Spreadsheet ID and Sheet Name are required.");
            }

            var refreshToken = await connectionService.GetRefreshTokenAsync(context.ClerkUserId, "Google");
            if (string.IsNullOrEmpty(refreshToken))
            {
                throw new InvalidOperationException($"User {context.ClerkUserId} has not connected their Google account.");
            }

            logger.LogInformation("Attempting to add row to spreadsheet '{SpreadsheetId}' for user {ClerkUserId}", config.SpreadsheetId, context.ClerkUserId);

            try
            {
                var credential = new UserCredential(new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
                {
                    ClientSecrets = new ClientSecrets
                    {
                        ClientId = configuration["Google:ClientId"],
                        ClientSecret = configuration["Google:ClientSecret"]
                    }
                }), context.ClerkUserId, new Google.Apis.Auth.OAuth2.Responses.TokenResponse { RefreshToken = refreshToken });

                var sheetsService = new SheetsService(new BaseClientService.Initializer()
                {
                    HttpClientInitializer = credential,
                    ApplicationName = "FlowForge"
                });

                // --- THIS IS THE FIX ---
                // 1. Apply the templating logic to the row values string.
                string finalRowValues = ReplacePlaceholders(config.RowValues, context.Payload);
                // --------------------

                // 2. Prepare the data for the new row using the final, processed string.
                var values = finalRowValues?.Split(',').Select(v => (object)v.Trim()).ToList() ?? new List<object>();
                var valueRange = new ValueRange { Values = new List<IList<object>> { values } };

                string range = config.SheetName;

                var appendRequest = sheetsService.Spreadsheets.Values.Append(valueRange, config.SpreadsheetId, range);
                appendRequest.ValueInputOption = SpreadsheetsResource.ValuesResource.AppendRequest.ValueInputOptionEnum.USERENTERED;
                var appendResponse = await appendRequest.ExecuteAsync();

                logger.LogInformation("Successfully added a new row to sheet. Updated range: {UpdatedRange}", appendResponse.Updates.UpdatedRange);

                return new Dictionary<string, object>
                {
                    { "updatedSheetRange", appendResponse.Updates.UpdatedRange }
                };
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred while adding a row to Google Sheets for user {ClerkUserId}", context.ClerkUserId);
                throw;
            }
        }

        /// <summary>
        /// A templating function that replaces placeholders like {{payload.key}}
        /// with values from the provided payload dictionary.
        /// </summary>
        private string ReplacePlaceholders(string template, IReadOnlyDictionary<string, object> payload)
        {
            if (string.IsNullOrEmpty(template))
            {
                return string.Empty;
            }

            return Regex.Replace(template, @"\{\{payload\.(\w+)\}\}", match =>
            {
                string key = match.Groups[1].Value;
                if (payload.TryGetValue(key, out object value))
                {
                    return value?.ToString() ?? string.Empty;
                }
                return string.Empty; // If key is not found, replace with empty string
            });
        }
    }
}