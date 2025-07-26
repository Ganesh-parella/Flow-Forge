using FlowForge.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;

namespace FlowForge.Controllers
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

        /// <summary>
        /// This is the public endpoint that external services will call to trigger a flow.
        /// It is not authenticated with a JWT because the caller is an external service, not a user.
        /// Security can be handled via secret keys in the URL if needed.
        /// </summary>
        /// <param name="flowId">The ID of the flow to trigger.</param>
        /// <param name="payload">The JSON body sent by the external service.</param>
        [HttpPost("{flowId}")]
        [AllowAnonymous] // Allows external services to call this endpoint without a user token.
        public async Task<IActionResult> TriggerFlow(int flowId, [FromBody] JsonElement payload)
        {
            _logger.LogInformation("Webhook received for Flow ID: {FlowId}", flowId);

            try
            {
                // Convert the incoming JsonElement to a Dictionary that our FlowEngine can use.
                var initialPayload = JsonSerializer.Deserialize<Dictionary<string, object>>(payload.GetRawText());

                // Call the new service method that handles webhook-triggered runs.
                await _flowService.RunFlowFromWebhookAsync(flowId, initialPayload);

                // Immediately return a 200 OK to the calling service.
                // The actual flow will run in the background.
                return Ok(new { message = "Webhook received and flow execution queued." });
            }
            catch (JsonException jsonEx)
            {
                _logger.LogError(jsonEx, "Invalid JSON payload received for Flow ID: {FlowId}", flowId);
                return BadRequest(new { message = "Invalid JSON format." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred while processing webhook for Flow ID: {FlowId}", flowId);
                // Return a generic error to avoid leaking implementation details.
                return StatusCode(500, new { message = "An internal error occurred." });
            }
        }
    }
}
