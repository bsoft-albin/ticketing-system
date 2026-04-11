using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketingSystem.Domain.Entities;

namespace TicketingSystem.Infrastructure.Data.Configurations;

public class TicketCommentConfiguration : IEntityTypeConfiguration<TicketComment>
{
    public void Configure(EntityTypeBuilder<TicketComment> builder)
    {
        builder.ToTable("ticket_comments");

        builder.HasKey(tc => tc.Id);
        builder.Property(tc => tc.Comment).IsRequired();
        builder.Property(tc => tc.CreatedAt).IsRequired();
        builder.Property(tc => tc.IsDeleted).IsRequired().HasDefaultValue(false);

        builder.HasQueryFilter(tc => !tc.IsDeleted);

        builder.HasOne(tc => tc.Ticket)
            .WithMany(t => t.Comments)
            .HasForeignKey(tc => tc.TicketId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(tc => tc.User)
            .WithMany()
            .HasForeignKey(tc => tc.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
