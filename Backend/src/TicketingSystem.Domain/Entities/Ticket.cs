using TicketingSystem.Domain.Common;
using TicketingSystem.Domain.Enums;

namespace TicketingSystem.Domain.Entities;

public class Ticket : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid AppId { get; set; }
    public Guid CreatedBy { get; set; }
    public Guid? AssignedTo { get; set; }
    public TicketStatus Status { get; set; } = TicketStatus.OPEN;
    public TicketPriority Priority { get; set; } = TicketPriority.MEDIUM;
    public TicketType Type { get; set; } = TicketType.BUG;

    // Navigation properties
    public virtual ProjectApp Application { get; set; } = null!;
    public virtual User Creator { get; set; } = null!;
    public virtual User? Assignee { get; set; }
    public virtual ICollection<TicketComment> Comments { get; set; } = [];
    public virtual ICollection<Attachment> Attachments { get; set; } = [];
}
