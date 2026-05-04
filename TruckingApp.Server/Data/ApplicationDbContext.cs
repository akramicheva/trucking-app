using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TruckingApp.Server.Data.Entities;

namespace TruckingApp.Server.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Order> Orders => Set<Order>();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Order>(entity =>
            {
                entity.HasIndex(order => order.OrderNumber)
                    .IsUnique();

                entity.Property(order => order.OrderNumber)
                    .HasMaxLength(20)
                    .IsRequired();

                entity.Property(order => order.SenderCity)
                    .HasMaxLength(100)
                    .IsRequired();

                entity.Property(order => order.SenderAddress)
                    .HasMaxLength(200)
                    .IsRequired();

                entity.Property(order => order.ReceiverCity)
                    .HasMaxLength(100)
                    .IsRequired();

                entity.Property(order => order.ReceiverAddress)
                    .HasMaxLength(200)
                    .IsRequired();

                entity.Property(order => order.CreatedBy)
                    .HasMaxLength(450)
                    .IsRequired();
            });
        }
    }
}
