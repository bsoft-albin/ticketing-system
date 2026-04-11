using Microsoft.EntityFrameworkCore;
using TicketingSystem.Application.DTOs;
using TicketingSystem.Application.Interfaces;
using TicketingSystem.Application.Interfaces.Repositories;
using TicketingSystem.Domain.Entities;
using TicketingSystem.Domain.Enums;

namespace TicketingSystem.Application.Services;

public class DashboardService(IUnitOfWork unitOfWork) : IDashboardService
{
    public async Task<ApiResponse<DashboardSummaryDto>> GetSummaryAsync()
    {
        IQueryable<Ticket> tickets = unitOfWork.Tickets.GetQueryable();
        IQueryable<ProjectApp> apps = unitOfWork.Applications.GetQueryable();

        DashboardSummaryDto summary = new()
        {
            TotalTickets = await tickets.CountAsync(),
            OpenTickets = await tickets.CountAsync(x => x.Status == TicketStatus.OPEN),
            ResolvedTickets = await tickets.CountAsync(x => x.Status == TicketStatus.RESOLVED),
            TotalApps = await apps.CountAsync()
        };

        return ApiResponse<DashboardSummaryDto>.SuccessResult(summary);
    }

    public async Task<ApiResponse<IEnumerable<StatusStatDto>>> GetTicketsByStatusAsync()
    {
        List<StatusStatDto> stats = await unitOfWork.Tickets.GetQueryable()
            .GroupBy(x => x.Status)
            .Select(g => new StatusStatDto
            {
                Status = g.Key.ToString(),
                Count = g.Count()
            })
            .ToListAsync();

        return ApiResponse<IEnumerable<StatusStatDto>>.SuccessResult(stats);
    }

    public async Task<ApiResponse<IEnumerable<PriorityStatDto>>> GetTicketsByPriorityAsync()
    {
        List<PriorityStatDto> stats = await unitOfWork.Tickets.GetQueryable()
            .GroupBy(x => x.Priority)
            .Select(g => new PriorityStatDto
            {
                Priority = g.Key.ToString(),
                Count = g.Count()
            })
            .ToListAsync();

        return ApiResponse<IEnumerable<PriorityStatDto>>.SuccessResult(stats);
    }

    public async Task<ApiResponse<IEnumerable<AppStatDto>>> GetTicketsByAppAsync()
    {
        List<AppStatDto> stats = await unitOfWork.Tickets.GetQueryable()
            .Include(x => x.Application)
            .GroupBy(x => x.Application.AppName)
            .Select(g => new AppStatDto
            {
                AppName = g.Key,
                Count = g.Count()
            })
            .ToListAsync();

        return ApiResponse<IEnumerable<AppStatDto>>.SuccessResult(stats);
    }
}
