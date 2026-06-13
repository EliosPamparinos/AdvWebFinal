using Microsoft.EntityFrameworkCore;
using AdvWebFinal.Server.Models;

namespace AdvWebFinal.Server.Data
{
    public class MyAppDbContext : DbContext
    {
        public MyAppDbContext(DbContextOptions<MyAppDbContext> options) : base(options) { }

        public DbSet<USERS> Users { get; set; }
        public DbSet<PROJECTS> Projects { get; set; }
        public DbSet<TASKS> Tasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PROJECTS>()
                .HasOne(p => p.User)
                .WithMany()
                .HasForeignKey(p => p.UserId)
                .HasPrincipalKey(u => u.UserID);

            modelBuilder.Entity<TASKS>()
                .HasOne(t => t.User)
                .WithMany()
                .HasForeignKey(t => t.UserId)
                .HasPrincipalKey(u => u.UserID);
        }
    }
}