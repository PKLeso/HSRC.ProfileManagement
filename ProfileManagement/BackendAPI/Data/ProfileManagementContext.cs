using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ProfileManagement.Configs.RoleConfigs;
using ProfileManagement.Models;

namespace ProfileManagement.Data
{
    public class ProfileManagementContext: IdentityDbContext<User>
    {
        public ProfileManagementContext(DbContextOptions<ProfileManagementContext> options) : base(options){ }

        public DbSet<User> Users { get; set; }
        public DbSet<Image> Images { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.ApplyConfiguration(new RoleConfiguration());
        }
    }
}
