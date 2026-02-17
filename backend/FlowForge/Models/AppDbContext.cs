using FlowForge.Models;
using Microsoft.EntityFrameworkCore;

namespace FlowForge.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<UserConnection> UserConnections { get; set; }
        public DbSet<Flow> Flows { get; set; }
        public DbSet<FlowInstance> FlowInstances { get; set; }
        public DbSet<NodeExecution> NodeExecutions { get; set; }

    }
}
