using System.Text.Json;

using FlowForge.Core.FlowParser;
using FlowForge.Core.FlowParser.Models;
using FlowForge.Dtos;
using FlowForge.Repositories.Interfaces;
using FlowForge.Services.Interfaces;
using FlowForge.Core;

namespace FlowForge.Services
{
    public class FlowService:IFlowService
    {
        private readonly IFlowRepository _flowRepository;
        private readonly FlowParser _flowParser;
        private readonly ILogger<FlowService> _logger;
        private readonly FlowEngine _flowEngine;
        public FlowService(IFlowRepository flowRepository,FlowParser flowParser,ILogger<FlowService> logger,FlowEngine flowEngine)
        {
            _flowRepository = flowRepository;
            _flowParser = flowParser;
            _logger = logger;
            _flowEngine = flowEngine;
        }
        public async Task RunFlowAsync(int flowId, string clerkUserId)
        {
            await RunFlowInternal(flowId, clerkUserId, new Dictionary<string, object>());
        }
        private async Task RunFlowInternal(int flowId, string clerkUserId, Dictionary<string, object> initialPayload)
        {
            if (string.IsNullOrEmpty(clerkUserId))
                throw new ArgumentNullException(nameof(clerkUserId));
            var flow = await _flowRepository.GetByIdAsync(clerkUserId, flowId);
            if (flow == null)
            {
                _logger.LogError("Flow with ID {FlowId} not found for execution.", flowId);
                throw new System.Exception($"Flow with ID {flowId} not found.");
            }
            var parsedFlow = _flowParser.Parse(flow.Name, flow.DefinitionJson);
            if (parsedFlow == null)
                throw new InvalidOperationException("ParsedFlow deserialized to null.");
            try
                {

                    // UPDATED: This now calls the corrected FlowEngine method with all three arguments.
                    await _flowEngine.RunFlowAsync(parsedFlow, clerkUserId, initialPayload);
                }
                catch (System.Exception ex)
                {
                    _logger.LogError(ex, "An error occurred while running flow {FlowId}", flowId);
                    throw;
                }
            
        }
        public async Task<IEnumerable<FlowResponseDto>> GetFlowsByUserAsync(string clerkUserId) => await _flowRepository.GetAllByUserAsync(clerkUserId);
        public async  Task<FlowResponseDto?> GetFlowByIdAsync(string clerkUserName,int id)
        {
            return await  _flowRepository.GetByIdAsync(clerkUserName, id);
        }
        public async Task<FlowResponseDto> CreateFlowAsync(CreateFlowDto flowDto, string clerkUserId)
        {
    
            return await _flowRepository.CreateFlowAsync(clerkUserId, flowDto);
        }
        public async Task<FlowResponseDto?> UpdateFlowAsync(string clerkUserId,int id, CreateFlowDto flowDto)
        {
            return await _flowRepository.UpdateFlowAsync(clerkUserId,id, flowDto);
        }
        public async Task<bool> DeleteFlowAsync(string clerkUserId,int id)
        {
            return await _flowRepository.DeleteFlowAsync(clerkUserId,id);
        }
        public async Task RunFlowFromWebhookAsync( String ClerkUserId,
    int flowId,
    Dictionary<string, object> initialPayload)
        {
            // You decide how webhook maps to user
            // Example: flow has owner stored in DB
            var flow = await _flowRepository.GetByIdAsync(ClerkUserId,flowId);

            if (flow == null)
                throw new Exception($"Flow with webhook ID {flowId} not found.");

            var parsedFlow = _flowParser.Parse(flow.Name, flow.DefinitionJson);

            if (parsedFlow == null)
                throw new InvalidOperationException("ParsedFlow deserialized to null.");

            await _flowEngine.RunFlowAsync(
                parsedFlow,
                ClerkUserId,
                initialPayload
            );
        }

    }
}
