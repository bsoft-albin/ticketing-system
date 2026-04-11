using TicketingSystem.Domain.Common;

namespace TicketingSystem.Domain.Entities;

public class Attachment : BaseEntity
{
    public Guid TicketId { get; set; }
    public string FileUrl { get; set; } = string.Empty;
    public Guid UploadedBy { get; set; }

    // Navigation properties
    public virtual Ticket Ticket { get; set; } = null!;
    public virtual User Uploader { get; set; } = null!;
}
