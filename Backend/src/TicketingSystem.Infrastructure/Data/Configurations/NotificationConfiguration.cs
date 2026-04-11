using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketingSystem.Domain.Entities;

namespace TicketingSystem.Infrastructure.Data.Configurations;

public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> builder)
    {
        builder.ToTable("notifications");

        builder.HasKey(n => n.Id);
        builder.Property(n => n.Message).IsRequired().HasMaxLength(500);
        builder.Property(n => n.Type).IsRequired().HasMaxLength(50);
        builder.Property(n => n.IsRead).IsRequired().HasDefaultValue(false);
        builder.Property(n => n.CreatedAt).IsRequired();
        builder.Property(n => n.IsDeleted).IsRequired().HasDefaultValue(false);

        builder.HasQueryFilter(n => !n.IsDeleted);

        builder.HasOne(n => n.User)
            .WithMany()
            .HasForeignKey(n => n.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(n => n.UserId);
        builder.HasIndex(n => n.IsRead);
    }
}
