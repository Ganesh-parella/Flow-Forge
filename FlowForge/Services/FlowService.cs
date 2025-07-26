using FlowForge.DTOs;
using FlowForge.Engine;
using FlowForge.Models;
using FlowForge.Repositories.Interfaces;
using FlowForge.Services.Interfaces;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace FlowForge.Services
{

    public class FlowService : IFlowService
    {
        private readonly IFlowRepository _flowRepository;
        private readonly FlowEngine _flowEngine;
        private readonly FlowParser _flowParser;
        private readonly ILogger<FlowService> _logger;

        public FlowService(
            IFlowRepository flowRepository,
            FlowEngine flowEngine,
            FlowParser flowParser,
            ILogger<FlowService> logger)
        {
            _flowRepository = flowRepository;
            _flowEngine = flowEngine;
            _flowParser = flowParser;
            _logger = logger;
        }

        // Handles runs triggered from the UI (no initial data)
        public async Task RunFlowAsync(int flowId, string clerkUserId)
        {
            await RunFlowInternal(flowId, clerkUserId, new Dictionary<string, object>());
        }

        // Handles runs triggered by webhooks (with initial data)
        public async Task RunFlowFromWebhookAsync(int flowId, Dictionary<string, object> initialPayload)
        {
            var flow = await _flowRepository.GetByIdAsync(flowId);
            if (flow == null)
            {
                _logger.LogError("Webhook received for non-existent Flow ID {FlowId}.", flowId);
                throw new System.Exception($"Flow with ID {flowId} not found.");
            }

            var clerkUserId = flow.ClerkUserId;
            if (string.IsNullOrEmpty(clerkUserId))
            {
                _logger.LogError("Flow ID {FlowId} is not associated with a user.", flowId);
                throw new System.Exception($"Flow with ID {flowId} has no owner.");
            }

            await RunFlowInternal(flowId, clerkUserId, initialPayload);
        }

        private async Task RunFlowInternal(int flowId, string clerkUserId, Dictionary<string, object> initialPayload)
        {
            var flow = await _flowRepository.GetByIdAsync(flowId);
            if (flow == null)
            {
                _logger.LogError("Flow with ID {FlowId} not found for execution.", flowId);
                throw new System.Exception($"Flow with ID {flowId} not found.");
            }

            try
            {
                var parsedFlow = _flowParser.Parse(flow.Name, flow.DefinitionJson);

                // UPDATED: This now calls the corrected FlowEngine method with all three arguments.
                await _flowEngine.RunAsync(parsedFlow, clerkUserId, initialPayload);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "An error occurred while running flow {FlowId}", flowId);
                throw;
            }
        }

        // --- Standard CRUD methods ---
        public async Task<FlowResponseDto> CreateFlowAsync(FlowCreateDto flowDto, string clerkUserId) => await _flowRepository.AddAsync(flowDto, clerkUserId);
        public async Task<bool> DeleteFlowAsync(int id) => await _flowRepository.DeleteAsync(id);
        public async Task<FlowResponseDto?> GetFlowByIdAsync(int id) => await _flowRepository.GetByIdAsync(id);
        public async Task<IEnumerable<FlowResponseDto>> GetFlowsByUserAsync(string clerkUserId) => await _flowRepository.GetAllByUserAsync(clerkUserId);
        public async Task<FlowResponseDto?> UpdateFlowAsync(int id, FlowCreateDto flowDto) => await _flowRepository.UpdateAsync(id, flowDto);
    }
}


