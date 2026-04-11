using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketingSystem.Application.DTOs;
using TicketingSystem.Application.Interfaces;

namespace TicketingSystem.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class DashboardController(IDashboardService dashboardService) : ControllerBase
{
    [HttpGet("summary")]
    public async Task<ActionResult<ApiResponse<DashboardSummaryDto>>> GetSummary()
    {
        ApiResponse<DashboardSummaryDto> result = await dashboardService.GetSummaryAsync();
        return Ok(result);
    }

    [HttpGet("tickets-by-status")]
    public async Task<ActionResult<ApiResponse<IEnumerable<StatusStatDto>>>> GetTicketsByStatus()
    {
        ApiResponse<IEnumerable<StatusStatDto>> result = await dashboardService.GetTicketsByStatusAsync();
        return Ok(result);
    }

    [HttpGet("tickets-by-priority")]
    public async Task<ActionResult<ApiResponse<IEnumerable<PriorityStatDto>>>> GetTicketsByPriority()
    {
        ApiResponse<IEnumerable<PriorityStatDto>> result = await dashboardService.GetTicketsByPriorityAsync();
        return Ok(result);
    }

    [HttpGet("tickets-by-app")]
    public async Task<ActionResult<ApiResponse<IEnumerable<AppStatDto>>>> GetTicketsByApp()
    {
        ApiResponse<IEnumerable<AppStatDto>> result = await dashboardService.GetTicketsByAppAsync();
        return Ok(result);
    }
}
