using Microsoft.AspNetCore.Identity;

namespace TicketingSystem.Domain.Entities;

public class Role : IdentityRole<Guid>
{
    // Permissions (JSONB)
    public string Permissions { get; set; } = "[]";
}
