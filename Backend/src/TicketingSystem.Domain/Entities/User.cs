using Microsoft.AspNetCore.Identity;
using TicketingSystem.Domain.Enums;

namespace TicketingSystem.Domain.Entities;

public class User : IdentityUser<Guid>
{
    public string FullName { get; set; } = string.Empty;
    public AuthProvider AuthProvider { get; set; } = AuthProvider.LOCAL;
    public bool Status { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public bool IsDeleted { get; set; } = false;

    // Navigation properties
    public virtual ICollection<ProjectAppMember> ApplicationMembers { get; set; } = [];
    public virtual ICollection<Ticket> CreatedTickets { get; set; } = [];
    public virtual ICollection<Ticket> AssignedTickets { get; set; } = [];
}
