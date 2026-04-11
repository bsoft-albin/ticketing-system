using TicketingSystem.Application.DTOs;

namespace TicketingSystem.Application.Interfaces;

public interface IDashboardService
{
    Task<ApiResponse<DashboardSummaryDto>> GetSummaryAsync();
    Task<ApiResponse<IEnumerable<StatusStatDto>>> GetTicketsByStatusAsync();
    Task<ApiResponse<IEnumerable<PriorityStatDto>>> GetTicketsByPriorityAsync();
    Task<ApiResponse<IEnumerable<AppStatDto>>> GetTicketsByAppAsync();
}

public class DashboardSummaryDto
{
    public int TotalTickets { get; set; }
    public int OpenTickets { get; set; }
    public int ResolvedTickets { get; set; }
    public int TotalUsers { get; set; }
    public int TotalApps { get; set; }
}

public class StatusStatDto
{
    public string Status { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class PriorityStatDto
{
    public string Priority { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class AppStatDto
{
    public string AppName { get; set; } = string.Empty;
    public int Count { get; set; }
}
