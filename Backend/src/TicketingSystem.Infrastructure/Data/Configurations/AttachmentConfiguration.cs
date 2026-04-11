using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TicketingSystem.Domain.Entities;

namespace TicketingSystem.Infrastructure.Data.Configurations;

public class AttachmentConfiguration : IEntityTypeConfiguration<Attachment>
{
    public void Configure(EntityTypeBuilder<Attachment> builder)
    {
        builder.ToTable("attachments");

        builder.HasKey(a => a.Id);
        builder.Property(a => a.FileUrl).IsRequired();
        builder.Property(a => a.CreatedAt).IsRequired();
        builder.Property(a => a.IsDeleted).IsRequired().HasDefaultValue(false);

        builder.HasQueryFilter(a => !a.IsDeleted);

        builder.HasOne(a => a.Ticket)
            .WithMany(t => t.Attachments)
            .HasForeignKey(a => a.TicketId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(a => a.Uploader)
            .WithMany()
            .HasForeignKey(a => a.UploadedBy)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
