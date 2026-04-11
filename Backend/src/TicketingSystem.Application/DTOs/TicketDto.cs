using TicketingSystem.Domain.Enums;

namespace TicketingSystem.Application.DTOs;

public class TicketDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid AppId { get; set; }
    public string AppName { get; set; } = string.Empty;
    public Guid CreatedBy { get; set; }
    public string CreatorName { get; set; } = string.Empty;
    public Guid? AssignedTo { get; set; }
    public string? AssigneeName { get; set; }
    public TicketStatus Status { get; set; }
    public TicketPriority Priority { get; set; }
    public TicketType Type { get; set; }
    public DateTime CreatedAt { get; set; }
}
