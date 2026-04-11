using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketingSystem.Domain.Entities;

namespace TicketingSystem.Infrastructure.Data.Configurations;

public class ApplicationMemberConfiguration : IEntityTypeConfiguration<ProjectAppMember>
{
    public void Configure(EntityTypeBuilder<ProjectAppMember> builder)
    {
        builder.ToTable("app_members");

        builder.HasKey(am => new { am.AppId, am.UserId });
        builder.Property(am => am.IsDeleted).IsRequired().HasDefaultValue(false);

        builder.HasQueryFilter(am => !am.IsDeleted);

        builder.HasOne(am => am.Application)
            .WithMany(a => a.Members)
            .HasForeignKey(am => am.AppId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(am => am.User)
            .WithMany(u => u.ApplicationMembers)
            .HasForeignKey(am => am.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
