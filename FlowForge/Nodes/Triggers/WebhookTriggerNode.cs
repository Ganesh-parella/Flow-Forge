using FlowForge.Core; // Where FlowExecutionContext is
using FlowForge.Core.Interfaces; // Where INode is
using FlowForge.Services.Interfaces; // Where IConnectionService is
using Google.Apis.Auth.OAuth2;
using Google.Apis.Gmail.v1;
using Google.Apis.Services;
using Microsoft.Extensions.Configuration; // To get ClientId/Secret
using Microsoft.Extensions.Logging;
using MimeKit; // NuGet package: MimeKit
using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;

// Recommended folder structure: /Nodes/{Service}/...Node.cs

namespace FlowForge.Nodes.Triggers
{
    /// <summary>
    /// Corresponds to the 'trigger' type from the frontend. In a real application,
    /// the data for this trigger is passed into the FlowEngine by a controller that
    /// receives an external webhook request.
    /// </summary>
    namespace FlowForge.Nodes.Triggers
    {
        /// <summary>
        /// Corresponds to the 'trigger' type from the frontend. In a real application,
        /// the data for this trigger is passed into the FlowEngine by a controller that
        /// receives an external webhook request.
        /// </summary>
        public class WebhookTriggerNode : ITrigger
        {
            public string Type => "trigger";

            public Task<Dictionary<string, object>> ExecuteAsync(FlowExecutionContext context, IServiceProvider services)
            {
                var logger = services.GetRequiredService<ILogger<WebhookTriggerNode>>();
                logger.LogInformation("Flow started by Webhook trigger for user {ClerkUserId}", context.ClerkUserId);
                logger.LogDebug("Initial payload received: {@Payload}", context.Payload);

                // In a real application, the initial payload is passed into the FlowEngine
                // by the controller that receives the webhook. This node's job is simply
                // to process and pass that data along as its output.
                var output = context.Payload;

                return Task.FromResult(output);
            }
        }
    }
}
