using FlowForge.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text.Json;

namespace FlowForge.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WebhooksController : ControllerBase
    {
        private readonly IFlowService _flowService;
        private readonly ILogger<WebhooksController> _logger;

        public WebhooksController(IFlowService flowService, ILogger<WebhooksController> logger)
        {
            _flowService = flowService;
            _logger = logger;
        }

        [HttpPost("{flowId}")]
        [AllowAnonymous]
        public async Task<IActionResult> TriggerFlow(int flowId, [FromBody] JsonElement payload)
        {
            string clerkUserid = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (clerkUserid == null)
            {
                return Unauthorized("User ID not found in token.");
            }
            _logger.LogInformation("Webhook received for Flow ID: {FlowId}", flowId);

            try
            {
                // Convert JSON Element to Dictionary
                var initialPayload = JsonSerializer.Deserialize<Dictionary<string, object>>(payload.GetRawText());

                // Trigger the Async Process (Fire and Forget)
                await _flowService.RunFlowFromWebhookAsync(clerkUserid,flowId, initialPayload ?? new Dictionary<string, object>());

                return Accepted(new { message = "Webhook received and flow execution queued.", flowId });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing webhook for Flow ID: {FlowId}", flowId);
                return StatusCode(500, new { message = "Internal Server Error" });
            }
        }
    }
}