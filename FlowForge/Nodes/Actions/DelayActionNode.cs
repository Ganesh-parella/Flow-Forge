using FlowForge.Core;
using FlowForge.Core.Interfaces;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;

namespace FlowForge.Nodes.Actions
{
    /// <summary>
    /// An action node that pauses the workflow execution for a specified duration.
    /// </summary>
    public class DelayActionNode : IAction
    {
        public string Type => "delay-action"; // This must match the type from the React frontend

        // Helper class to strongly-type the configuration from the React Flow node's 'data' object.
        private class NodeData
        {
            public int DurationMs { get; set; } = 1000; // Default to 1 second
        }

        public async Task<Dictionary<string, object>> ExecuteAsync(FlowExecutionContext context, IServiceProvider services)
        {
            var logger = services.GetRequiredService<ILogger<DelayActionNode>>();

            // 1. Deserialize the node's configuration from the JSON settings panel.
            var config = context.NodeConfiguration.Deserialize<NodeData>(new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            if (config == null)
            {
                logger.LogWarning("Delay action configuration is missing. Using default of 1000ms.");
                config = new NodeData();
            }

            // Ensure the delay is not negative or excessively long to prevent issues.
            if (config.DurationMs < 0)
            {
                logger.LogWarning("Delay duration cannot be negative. Skipping delay.");
                return null;
            }
            // You might want to cap the maximum delay in a real application.
            // const int maxDelay = 300000; // 5 minutes
            // if (config.DurationMs > maxDelay) config.DurationMs = maxDelay;


            logger.LogInformation("Starting delay of {Duration}ms for user {ClerkUserId}", config.DurationMs, context.ClerkUserId);

            // 2. Perform the actual delay.
            await Task.Delay(config.DurationMs);

            logger.LogInformation("Delay finished.");

            // 3. This node does not produce any output for subsequent nodes, so we return null.
            return null;
        }
    }
}
