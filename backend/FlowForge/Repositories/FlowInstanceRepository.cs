using FlowForge.Models;
using FlowForge.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FlowForge.Repositories
{
    public class FlowInstanceRepository : IFlowInstanceRepository
    {
        private readonly AppDbContext _context;
        public FlowInstanceRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<FlowInstance> CreateFlowInstanceAsync(int flowId, string clerkUserId)
        {
            FlowInstance flowInstance = new FlowInstance
            {
                Id = Guid.NewGuid(),
                FlowId = flowId,
                ClerkUserId = clerkUserId,
                Status = "Running",
                StartedAt = DateTime.UtcNow
            };
            _context.FlowInstances.Add(flowInstance);
            await _context.SaveChangesAsync();
            return flowInstance;
        }
        public async Task<FlowInstance?> GetFlowInstanceByIdAsync(Guid id)
        {
            return await _context.FlowInstances
                .Include(f => f.NodeExecutions)
                .FirstOrDefaultAsync(f => f.Id == id);
        }
        public async Task<IEnumerable<FlowInstance>> GetRunningInstancesAsync()
        {
            return await _context.FlowInstances.Where(f => f.Status == "Running")
                .ToListAsync();
        }
        public async Task MarkCompletedAsync(Guid id)
        {
            FlowInstance? instance = await _context.FlowInstances.FindAsync(id);
            if (instance != null)
            {
                instance.Status = "Completed";
                instance.CompletedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
        }
        public async Task MarkFailedAsync(Guid id)
        {
            FlowInstance? instance = await _context.FlowInstances.FindAsync(id);
            if (instance != null)
            {
                instance.Status = "Failed";
                instance.CompletedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
        }
    }
}
