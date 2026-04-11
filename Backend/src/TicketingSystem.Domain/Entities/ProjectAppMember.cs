namespace TicketingSystem.Domain.Entities;

public class ProjectAppMember
{
    public Guid AppId { get; set; }
    public Guid UserId { get; set; }
    public bool IsDeleted { get; set; } = false;

    // Navigation properties
    public virtual ProjectApp Application { get; set; } = null!;
    public virtual User User { get; set; } = null!;
}
