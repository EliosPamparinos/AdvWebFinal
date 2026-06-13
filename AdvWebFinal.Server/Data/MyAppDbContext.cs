using Microsoft.EntityFrameworkCore;
using AdvWebFinal.Server.Models;

namespace AdvWebFinal.Server.Data
{
    public class MyAppDbContext : DbContext
    {
        public MyAppDbContext(DbContextOptions<MyAppDbContext> options) : base(options) { }

        public DbSet<Users> Users { get; set; }
        public DbSet<Projects> Projects { get; set; }
        public DbSet<Tasks> Tasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Projects>()
                .HasOne(p => p.User)
                .WithMany()
                .HasForeignKey(p => p.UserId)
                .HasPrincipalKey(u => u.UserID);

            modelBuilder.Entity<Tasks>()
                .HasOne(t => t.User)
                .WithMany()
                .HasForeignKey(t => t.UserId)
                .HasPrincipalKey(u => u.UserID);
        }
    }
}
