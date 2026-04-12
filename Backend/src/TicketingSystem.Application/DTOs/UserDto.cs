namespace TicketingSystem.Application.DTOs;

public class UserDto
{
    public Guid Id { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string AuthProvider { get; set; } = string.Empty;
    public bool Status { get; set; }
    public string? AvatarUrl { get; set; }
}
