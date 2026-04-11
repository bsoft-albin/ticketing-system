namespace TicketingSystem.Domain.Entities;

public class AuditLog
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string EntityType { get; set; } = string.Empty;
    public Guid EntityId { get; set; }
    public string Action { get; set; } = string.Empty;
    public Guid PerformedBy { get; set; }
    public string Metadata { get; set; } = "{}"; // JSONB
    public DateTime PerformedAt { get; set; } = DateTime.UtcNow;
}
