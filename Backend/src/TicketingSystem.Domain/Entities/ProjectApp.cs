using TicketingSystem.Domain.Common;
using TicketingSystem.Domain.Enums;

namespace TicketingSystem.Domain.Entities;

public class ProjectApp : BaseEntity
{
    public string AppName { get; set; } = string.Empty;
    public AppType AppType { get; set; }
    public Guid OwnerId { get; set; }
    public bool Status { get; set; } = true;

    // Navigation properties
    public virtual User Owner { get; set; } = null!;
    public virtual ICollection<ProjectAppMember> Members { get; set; } = [];
    public virtual ICollection<Ticket> Tickets { get; set; } = [];
}
