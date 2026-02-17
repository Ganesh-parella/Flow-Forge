using FlowForge.Dtos;
using FlowForge.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FlowForge.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FlowsController : ControllerBase
    {
        private readonly IFlowService _flowService;
        private readonly IFlowRunService _flowRunService;
        private readonly ILogger<FlowsController> _logger;

        public FlowsController(
            IFlowService flowService,
            IFlowRunService flowRunService,
            ILogger<FlowsController> logger)
        {
            _flowService = flowService;
            _flowRunService = flowRunService;
            _logger = logger;
        }

        // =============================
        // CRUD
        // =============================

        [HttpPost]
        public async Task<IActionResult> CreateFlow([FromBody] CreateFlowDto flowDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var clerkUserId = GetUserId();
            if (clerkUserId == null)
                return Unauthorized();

            try
            {
                var created = await _flowService.CreateFlowAsync(flowDto, clerkUserId);
                return CreatedAtAction(nameof(GetFlowById), new { id = created.Id }, created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating flow");
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetFlowById(int id)
        {
            var clerkUserId = GetUserId();
            if (clerkUserId == null) return Unauthorized();

            var flow = await _flowService.GetFlowByIdAsync(clerkUserId, id);
            if (flow == null) return NotFound();

            return Ok(flow);
        }

        [HttpGet("user/me")]
        public async Task<IActionResult> GetMyFlows()
        {
            var clerkUserId = GetUserId();
            if (clerkUserId == null) return Unauthorized();

            var flows = await _flowService.GetFlowsByUserAsync(clerkUserId);
            return Ok(flows);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFlow(int id, [FromBody] CreateFlowDto flowDto)
        {
            var clerkUserId = GetUserId();
            if (clerkUserId == null) return Unauthorized();

            var updated = await _flowService.UpdateFlowAsync(clerkUserId, id, flowDto);
            if (updated == null) return NotFound();

            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFlow(int id)
        {
            var clerkUserId = GetUserId();
            if (clerkUserId == null) return Unauthorized();

            var deleted = await _flowService.DeleteFlowAsync(clerkUserId, id);
            if (!deleted) return NotFound();

            return NoContent();
        }

        // =============================
        // RUN FLOW (Execution Layer)
        // =============================

        [HttpPost("{id}/run")]
        public async Task<IActionResult> RunFlow(int id)
        {
            var clerkUserId = GetUserId();
            if (clerkUserId == null) return Unauthorized();

            try
            {
                await _flowRunService.RunFlowAsync(id, clerkUserId);
                return Accepted(new { message = "Flow execution started." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error running flow {FlowId}", id);
                return StatusCode(500, new { message = ex.Message });
            }
        }

        private string? GetUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? User.FindFirstValue("sub");
        }
    }
}
