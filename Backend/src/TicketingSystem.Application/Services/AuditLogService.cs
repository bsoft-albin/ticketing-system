using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TicketingSystem.Application.DTOs;
using TicketingSystem.Application.Interfaces;
using TicketingSystem.Application.Interfaces.Repositories;
using TicketingSystem.Domain.Entities;

namespace TicketingSystem.Application.Services;

public class AuditLogService(IUnitOfWork unitOfWork, IMapper mapper) : IAuditLogService
{
    public async Task<ApiResponse<IEnumerable<AuditLogDto>>> GetAuditLogsAsync(int pageNumber, int pageSize)
    {
        List<AuditLog> logs = await unitOfWork.AuditLogs.GetQueryable()
            .AsNoTracking()
            .OrderByDescending(x => x.PerformedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        IEnumerable<AuditLogDto> dtos = mapper.Map<IEnumerable<AuditLogDto>>(logs);
        return ApiResponse<IEnumerable<AuditLogDto>>.SuccessResult(dtos);
    }
}
