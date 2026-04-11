using TicketingSystem.Application.DTOs;

namespace TicketingSystem.Application.Interfaces;

public interface IAuditLogService
{
    Task<ApiResponse<IEnumerable<AuditLogDto>>> GetAuditLogsAsync(int pageNumber, int pageSize);
}

public class AuditLogDto
{
    public Guid Id { get; set; }
    public string EntityType { get; set; } = string.Empty;
    public Guid EntityId { get; set; }
    public string Action { get; set; } = string.Empty;
    public Guid PerformedBy { get; set; }
    public string Metadata { get; set; } = string.Empty;
    public DateTime PerformedAt { get; set; }
}
