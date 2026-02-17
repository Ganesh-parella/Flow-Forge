using FlowForge.Models;
using FlowForge.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FlowForge.Repositories
{
    public class NodeExecutionRepository: INodeExecutionRepository

    {
        private readonly AppDbContext _context;
        public NodeExecutionRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task CreateNodeExecutionsAsync(Guid flowInstanceId, List<string> nodeIds)
        {
            var nodeExecutions = nodeIds.Select(nodeId => new NodeExecution
            {
                Id = Guid.NewGuid(),
                FlowInstanceId = flowInstanceId,
                NodeId = nodeId,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            }).ToList();
            await _context.NodeExecutions.AddRangeAsync(nodeExecutions);
            await _context.SaveChangesAsync();
        }

        public async Task<NodeExecution?> GetNextReadyNodeAsync(Guid flowInstanceId)
        {
            return await _context.NodeExecutions.Where(ne => ne.FlowInstanceId == flowInstanceId && ne.Status == "Ready")
                .OrderBy(ne => ne.CreatedAt)
                .FirstOrDefaultAsync();
        }

        public async Task MarkRunningAsync(Guid nodeExecutionId)
        {
            var node = await _context.NodeExecutions.FindAsync(nodeExecutionId);
            if (node == null) return;

            node.Status = "Running";
            node.StartedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }

         public async Task MarkCompletedAsync(Guid nodeExecutionId)
        {
            var node = await _context.NodeExecutions.FindAsync(nodeExecutionId);
            if (node==null)
            {
                return;
            }
            node.Status = "Completed";
            node.CompletedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }

        public async Task MarkFailedAsync(Guid nodeExecutionId, string errorMessage)
        {
            var node = await _context.NodeExecutions.FindAsync(nodeExecutionId);
            if (node == null) { return; }
            node.Status = "Failed";
            node.ErrorMessage = errorMessage;
            node.CompletedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
        public async Task<bool> AreAllParentsCompletedAsync(Guid flowInstanceId,List<string> parentNodeIds)
        {
            return !await _context.NodeExecutions
     .AnyAsync(n =>
         n.FlowInstanceId == flowInstanceId &&
         parentNodeIds.Contains(n.NodeId) &&
         n.Status != "Completed");

        }

        public async Task MarkReadyAsync(Guid flowInstanceId, string nodeId)
        {
            var node = await _context.NodeExecutions.FirstOrDefaultAsync(n => n.FlowInstanceId == flowInstanceId && n.NodeId == nodeId);
            if (node == null) { return; }
            if (node.Status == "Pending")
            {
                node.Status = "Ready";
                await _context.SaveChangesAsync();
            }

        }

        public async Task<bool> AnyFailedAsync(Guid flowInstanceId)
        {
            return await _context.NodeExecutions.AnyAsync(n => n.FlowInstanceId == flowInstanceId && n.Status == "Failed");
        }

        public async Task<bool> AllCompletedAsync(Guid flowInstanceId)
        {
            return !await _context.NodeExecutions
    .AnyAsync(n =>
        n.FlowInstanceId == flowInstanceId &&
        n.Status != "Completed");

        }
    }
}
