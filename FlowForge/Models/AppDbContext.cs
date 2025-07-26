using Microsoft.EntityFrameworkCore;

namespace FlowForge.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

    
        public DbSet<Flow> Flows { get; set; }
        public DbSet<UserConnection> UserConnections { get; set; }
    }
}
