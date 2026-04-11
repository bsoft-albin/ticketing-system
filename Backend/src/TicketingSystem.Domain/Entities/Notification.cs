using TicketingSystem.Domain.Common;

namespace TicketingSystem.Domain.Entities;

public class Notification : BaseEntity
{
    public Guid UserId { get; set; }
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public bool IsRead { get; set; } = false;

    // Navigation properties
    public virtual User User { get; set; } = null!;
}
