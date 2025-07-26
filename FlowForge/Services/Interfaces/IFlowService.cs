using FlowForge.DTOs;

namespace FlowForge.Services.Interfaces
{
    public interface IFlowService
    {
        Task<IEnumerable<FlowResponseDto>> GetFlowsByUserAsync(string clerkUserId);
        Task<FlowResponseDto?> GetFlowByIdAsync(int id);
        Task<FlowResponseDto> CreateFlowAsync(FlowCreateDto flowDto, string clerkUserId);
        Task<FlowResponseDto?> UpdateFlowAsync(int id, FlowCreateDto flowDto);
        Task<bool> DeleteFlowAsync(int id);
        Task RunFlowAsync(int flowId, string clerkUserId);
        Task RunFlowFromWebhookAsync(int flowId, Dictionary<string, object> initialPayload);
    }
}
