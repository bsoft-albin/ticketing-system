using TicketingSystem.Domain.Common;

namespace TicketingSystem.Domain.Entities;

public class TicketComment : BaseEntity
{
    public Guid TicketId { get; set; }
    public Guid UserId { get; set; }
    public string Comment { get; set; } = string.Empty;

    // Navigation properties
    public virtual Ticket Ticket { get; set; } = null!;
    public virtual User User { get; set; } = null!;
}
