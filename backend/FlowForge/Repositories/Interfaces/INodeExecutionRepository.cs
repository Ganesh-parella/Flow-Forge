using FlowForge.Models;

namespace FlowForge.Repositories.Interfaces
{
    public interface INodeExecutionRepository
    {

        Task CreateNodeExecutionsAsync(Guid flowInstanceId, List<string> nodeIds);

        Task<NodeExecution?> GetNextReadyNodeAsync(Guid flowInstanceId);

        Task MarkRunningAsync(Guid nodeExecutionId);

        Task MarkCompletedAsync(Guid nodeExecutionId);

        Task MarkFailedAsync(Guid nodeExecutionId, string errorMessage);

        Task<bool> AreAllParentsCompletedAsync(
            Guid flowInstanceId,
            List<string> parentNodeIds);

        Task MarkReadyAsync(Guid flowInstanceId, string nodeId);

        Task<bool> AnyFailedAsync(Guid flowInstanceId);

        Task<bool> AllCompletedAsync(Guid flowInstanceId);
    }
}
