using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketingSystem.Domain.Entities;

namespace TicketingSystem.Infrastructure.Data.Configurations;

public class ApplicationConfiguration : IEntityTypeConfiguration<ProjectApp>
{
    public void Configure(EntityTypeBuilder<ProjectApp> builder)
    {
        builder.ToTable("applications");

        builder.HasKey(a => a.Id);
        builder.Property(a => a.AppName).IsRequired().HasMaxLength(100);
        builder.Property(a => a.AppType).IsRequired();
        builder.Property(a => a.Status).IsRequired().HasDefaultValue(true);
        builder.Property(a => a.CreatedAt).IsRequired();
        builder.Property(a => a.IsDeleted).IsRequired().HasDefaultValue(false);

        builder.HasQueryFilter(a => !a.IsDeleted);

        builder.HasOne(a => a.Owner)
            .WithMany()
            .HasForeignKey(a => a.OwnerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(a => a.Status);
    }
}
