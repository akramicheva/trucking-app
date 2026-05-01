using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.AspNetCore.Identity;
using TruckingApp.Server.Data.Entities;

namespace TruckingApp.Server.Data
{

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Order> Orders { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Order>()
                    .HasIndex(s => s.OrderNumber)
                    .IsUnique();
            
            builder.Entity<Order>()
                    .Property(s => s.OrderNumber)
                    .Metadata.SetAfterSaveBehavior(PropertySaveBehavior.Ignore); 
        }

        public override int SaveChanges()
        {
            GenerateOrderNumbers();
            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            GenerateOrderNumbers();
            return base.SaveChangesAsync(cancellationToken);
        }

        private void GenerateOrderNumbers()
        {
            var newOrders = ChangeTracker.Entries<Order>()
                .Where(e => e.State == EntityState.Added && string.IsNullOrEmpty(e.Entity.OrderNumber));

            foreach (var entry in newOrders)
            {
                string datePart = DateTime.UtcNow.ToString("yyyyMMdd");
                string randomPart = Guid.NewGuid().ToString("N").Substring(0, 5).ToUpper();
                entry.Entity.OrderNumber = $"ORD-{datePart}-{randomPart}";
            }
        }

    }
}