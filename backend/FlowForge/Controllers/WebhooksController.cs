using FlowForge.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace FlowForge.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WebhooksController : ControllerBase
    {
        private readonly IFlowRunService _flowRunService;
        private readonly ILogger<WebhooksController> _logger;

        public WebhooksController(
            IFlowRunService flowRunService,
            ILogger<WebhooksController> logger)
        {
            _flowRunService = flowRunService;
            _logger = logger;
        }

        [HttpPost("{flowId}")]
        public async Task<IActionResult> TriggerFlow(
            int flowId,
            [FromBody] JsonElement payload)
        {
            _logger.LogInformation("Webhook received for Flow ID: {FlowId}", flowId);

            try
            {
                var initialPayload =
                    JsonSerializer.Deserialize<Dictionary<string, object>>(
                        payload.GetRawText())
                    ?? new Dictionary<string, object>();

                // In production:
                // You must fetch Flow owner from DB
                // Not rely on token.

                string clerkUserId = "SYSTEM_WEBHOOK"; // Placeholder

                await _flowRunService
                    .RunFlowFromWebhookAsync(
                        clerkUserId,
                        flowId,
                        initialPayload);

                return Accepted(new
                {
                    message = "Webhook received. Flow execution started.",
                    flowId
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,
                    "Error processing webhook for Flow ID {FlowId}",
                    flowId);

                return StatusCode(500,
                    new { message = "Internal Server Error" });
            }
        }
    }
}
