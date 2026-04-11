using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketingSystem.Domain.Entities;

namespace TicketingSystem.Infrastructure.Data.Configurations;

public class TicketConfiguration : IEntityTypeConfiguration<Ticket>
{
    public void Configure(EntityTypeBuilder<Ticket> builder)
    {
        builder.ToTable("tickets");

        builder.HasKey(t => t.Id);
        builder.Property(t => t.Title).IsRequired().HasMaxLength(200);
        builder.Property(t => t.Description).IsRequired();
        builder.Property(t => t.Status).IsRequired();
        builder.Property(t => t.Priority).IsRequired();
        builder.Property(t => t.Type).IsRequired();
        builder.Property(t => t.CreatedAt).IsRequired();
        builder.Property(t => t.IsDeleted).IsRequired().HasDefaultValue(false);

        builder.HasQueryFilter(t => !t.IsDeleted);

        builder.HasOne(t => t.Application)
            .WithMany(a => a.Tickets)
            .HasForeignKey(t => t.AppId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(t => t.AppId);
        builder.HasIndex(t => t.Status);
        builder.HasIndex(t => t.AssignedTo);
        builder.HasIndex(t => t.CreatedBy);
        builder.HasIndex(t => t.Priority);
    }
}
