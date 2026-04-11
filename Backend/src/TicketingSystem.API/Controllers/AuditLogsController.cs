using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketingSystem.Application.DTOs;
using TicketingSystem.Application.Interfaces;

namespace TicketingSystem.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize(Roles = "Admin")]
public class AuditLogsController(IAuditLogService auditLogService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<AuditLogDto>>>> GetAuditLogs([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        ApiResponse<IEnumerable<AuditLogDto>> result = await auditLogService.GetAuditLogsAsync(pageNumber, pageSize);
        return Ok(result);
    }
}
