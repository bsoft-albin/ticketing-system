using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketingSystem.Domain.Entities;

namespace TicketingSystem.Infrastructure.Data.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users");

        builder.Property(u => u.FullName).IsRequired().HasMaxLength(100);
        builder.Property(u => u.AuthProvider).IsRequired();
        builder.Property(u => u.Status).IsRequired();
        builder.Property(u => u.CreatedAt).IsRequired();
        builder.Property(u => u.IsDeleted).IsRequired().HasDefaultValue(false);

        builder.HasQueryFilter(u => !u.IsDeleted);

        builder.HasMany(u => u.CreatedTickets)
            .WithOne(t => t.Creator)
            .HasForeignKey(t => t.CreatedBy)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(u => u.AssignedTickets)
            .WithOne(t => t.Assignee)
            .HasForeignKey(t => t.AssignedTo)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
