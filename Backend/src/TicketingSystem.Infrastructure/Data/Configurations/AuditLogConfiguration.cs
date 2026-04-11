using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketingSystem.Domain.Entities;

namespace TicketingSystem.Infrastructure.Data.Configurations;

public class AuditLogConfiguration : IEntityTypeConfiguration<AuditLog>
{
    public void Configure(EntityTypeBuilder<AuditLog> builder)
    {
        builder.ToTable("audit_logs");

        builder.HasKey(al => al.Id);
        builder.Property(al => al.EntityType).IsRequired().HasMaxLength(100);
        builder.Property(al => al.Action).IsRequired().HasMaxLength(50);
        builder.Property(al => al.Metadata).HasColumnType("jsonb").IsRequired();
        builder.Property(al => al.PerformedAt).IsRequired();

        builder.HasIndex(al => al.PerformedBy);
        builder.HasIndex(al => al.PerformedAt);
        builder.HasIndex(al => al.EntityType);
    }
}
