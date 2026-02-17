using FlowForge.Models;

namespace FlowForge.Repositories.Interfaces
{
    public interface IFlowInstanceRepository
    {
        Task<FlowInstance> CreateFlowInstanceAsync(int flowId, string clerkUserId);
        Task<FlowInstance?> GetFlowInstanceByIdAsync(Guid id);
        Task<IEnumerable<FlowInstance>> GetRunningInstancesAsync();
        Task MarkCompletedAsync(Guid id);
        Task MarkFailedAsync(Guid id);


    }
}
