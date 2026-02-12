using FlowForge.Dtos;

namespace FlowForge.Services.Interfaces
{
    public interface IFlowService
    {
        Task<IEnumerable<FlowResponseDto>> GetFlowsByUserAsync(string clerkUserId);
        Task RunFlowAsync(int flowId, string clerkUserId);
        Task<FlowResponseDto?> GetFlowByIdAsync(string clerkUserName,int id);
        Task<FlowResponseDto> CreateFlowAsync(CreateFlowDto flowDto, string clerkUserId);
        Task<FlowResponseDto?> UpdateFlowAsync(string clerkUserId,int id, CreateFlowDto flowDto);
        Task<bool> DeleteFlowAsync(string clerkUserId,int id);
        Task RunFlowFromWebhookAsync(
        string clerkUserId,
        int flowId,
        Dictionary<string, object> initialPayload
    );
    }
}
