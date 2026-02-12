using FlowForge.Dtos;
using FlowForge.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text.Json;

namespace FlowForge.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FlowsController : ControllerBase
    {
        private readonly IFlowService _flowService;
        private readonly ILogger<FlowsController> _logger;

        public FlowsController(IFlowService flowService, ILogger<FlowsController> logger)
        {
            _flowService = flowService;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> CreateFlow()
        {
            CreateFlowDto? flowDto = null;
            try
            {
                using var reader = new StreamReader(Request.Body);
                var body = await reader.ReadToEndAsync();

                if (string.IsNullOrWhiteSpace(body))
                {
                    _logger.LogWarning("CreateFlow called with empty body.");
                    return BadRequest(new { message = "Request body is empty." });
                }

                flowDto = JsonSerializer.Deserialize<CreateFlowDto>(
                    body,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                );
            }
            catch (JsonException ex)
            {
                _logger.LogWarning(ex, "CreateFlow called with invalid JSON.");
                return BadRequest(new { message = "Invalid JSON format." });
            }

            if (flowDto == null)
                return BadRequest(new { message = "Flow data is required." });

            // Ensure DefinitionJson is always valid
            if (string.IsNullOrWhiteSpace(flowDto.DefinitionJson))
                flowDto.DefinitionJson = "{\"nodes\":[],\"edges\":[]}";

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var clerkUserId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            if (string.IsNullOrEmpty(clerkUserId))
                return Unauthorized("User ID not found in token.");

            try
            {
                var createdFlow = await _flowService.CreateFlowAsync(flowDto, clerkUserId);
                return CreatedAtAction(nameof(GetFlowById), new { id = createdFlow.Id }, createdFlow);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating flow for user {UserId}", clerkUserId);
                return StatusCode(500, new { message = ex.Message });
            }
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetFlowById(int id)
        {
            var clerkUserId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            if (string.IsNullOrEmpty(clerkUserId)) return Unauthorized();

            var flow = await _flowService.GetFlowByIdAsync(clerkUserId, id);
            if (flow == null) return NotFound();
            return Ok(flow);
        }

        [HttpGet("user/me")]
        public async Task<IActionResult> GetMyFlows()
        {
            var clerkUserId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            if (string.IsNullOrEmpty(clerkUserId)) return Unauthorized();

            var flows = await _flowService.GetFlowsByUserAsync(clerkUserId);
            return Ok(flows);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFlow(int id, [FromBody] CreateFlowDto flowDto)
        {
            if (flowDto == null) return BadRequest("Flow data is required.");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var clerkUserId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            if (string.IsNullOrEmpty(clerkUserId)) return Unauthorized();

            var updatedFlow = await _flowService.UpdateFlowAsync(clerkUserId, id, flowDto);
            if (updatedFlow == null) return NotFound();
            return Ok(updatedFlow);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFlow(int id)
        {
            var clerkUserId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            if (string.IsNullOrEmpty(clerkUserId)) return Unauthorized();

            var result = await _flowService.DeleteFlowAsync(clerkUserId, id);
            if (!result) return NotFound();
            return NoContent();
        }

        [HttpPost("{id}/run")]
        public async Task<IActionResult> RunFlow(int id)
        {
            var clerkUserId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            if (string.IsNullOrEmpty(clerkUserId)) return Unauthorized();

            try
            {
                await _flowService.RunFlowAsync(id, clerkUserId);
                return Ok(new { message = "Flow executed successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error running flow {FlowId}", id);
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}