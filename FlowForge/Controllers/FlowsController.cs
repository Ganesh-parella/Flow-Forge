using FlowForge.DTOs;
using FlowForge.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System;
using System.Threading.Tasks;

namespace FlowForge.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Secures all endpoints in this controller
    public class FlowsController : ControllerBase
    {
        private readonly IFlowService _flowService;

        public FlowsController(IFlowService flowService)
        {
            _flowService = flowService;
        }

        // GET: api/flows/user/me
        [HttpGet("user/me")]
        public async Task<IActionResult> GetFlowsForCurrentUser()
        {
            var clerkUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(clerkUserId))
            {
                return Unauthorized("User ID not found in token.");
            }

            var flows = await _flowService.GetFlowsByUserAsync(clerkUserId);
            return Ok(flows);
        }

        // GET: api/flows/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetFlow(int id)
        {
            var clerkUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(clerkUserId)) return Unauthorized("User ID not found in token.");

            var flow = await _flowService.GetFlowByIdAsync(id);
            if (flow == null)
                return NotFound();

            // AUTHORIZATION CHECK:
            if (flow.ClerkUserId != clerkUserId)
            {
                return Forbid(); // User is authenticated, but not authorized for this resource.
            }

            return Ok(flow);
        }

        // POST: api/flows
        [HttpPost]
        public async Task<IActionResult> CreateFlow([FromBody] FlowCreateDto flowDto)
        {
            var clerkUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(clerkUserId))
            {
                return Unauthorized("User ID not found in token.");
            }

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var created = await _flowService.CreateFlowAsync(flowDto, clerkUserId);
            return CreatedAtAction(nameof(GetFlow), new { id = created.Id }, created);
        }

        // PUT: api/flows/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFlow(int id, [FromBody] FlowCreateDto flowDto)
        {
            var clerkUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(clerkUserId)) return Unauthorized("User ID not found in token.");

            var existingFlow = await _flowService.GetFlowByIdAsync(id);
            if (existingFlow == null) return NotFound();

            // AUTHORIZATION CHECK:
            if (existingFlow.ClerkUserId != clerkUserId) return Forbid();

            var updated = await _flowService.UpdateFlowAsync(id, flowDto);
            return Ok(updated);
        }

        // DELETE: api/flows/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFlow(int id)
        {
            var clerkUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(clerkUserId)) return Unauthorized("User ID not found in token.");

            var existingFlow = await _flowService.GetFlowByIdAsync(id);
            if (existingFlow == null) return NotFound();

            // AUTHORIZATION CHECK:
            if (existingFlow.ClerkUserId != clerkUserId) return Forbid();

            var deleted = await _flowService.DeleteFlowAsync(id);
            if (!deleted) return NotFound();

            return NoContent();
        }

        // POST: api/flows/{id}/run
        [HttpPost("{id}/run")]
        public async Task<IActionResult> RunFlow(int id)
        {
            var clerkUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(clerkUserId))
            {
                return Unauthorized("User ID not found in token.");
            }

            var existingFlow = await _flowService.GetFlowByIdAsync(id);
            if (existingFlow == null) return NotFound();

            // AUTHORIZATION CHECK:
            if (existingFlow.ClerkUserId != clerkUserId) return Forbid();

            try
            {
                await _flowService.RunFlowAsync(id, clerkUserId);
                return Ok(new { message = $"Flow {id} execution initiated successfully." });
            }
            catch (Exception ex)
            {
                // The service layer should log the exception details.
                return StatusCode(500, new { message = "An error occurred during flow execution." });
            }
        }
    }
}
