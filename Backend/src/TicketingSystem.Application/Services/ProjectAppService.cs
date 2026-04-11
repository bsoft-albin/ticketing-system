using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TicketingSystem.Application.DTOs;
using TicketingSystem.Application.Interfaces;
using TicketingSystem.Application.Interfaces.Repositories;
using TicketingSystem.Domain.Entities;

namespace TicketingSystem.Application.Services;

public class ProjectAppService(IUnitOfWork unitOfWork, IMapper mapper) : IProjectAppService
{
    public async Task<ApiResponse<ProjectAppDto>> GetProjectAppByIdAsync(Guid id)
    {
        ProjectApp? app = await unitOfWork.Applications.GetQueryable()
            .AsNoTracking()
            .Include(x => x.Owner)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (app == null)
        {
            return ApiResponse<ProjectAppDto>.FailureResult("Application not found");
        }

        ProjectAppDto dto = mapper.Map<ProjectAppDto>(app);
        return ApiResponse<ProjectAppDto>.SuccessResult(dto);
    }

    public async Task<ApiResponse<IEnumerable<ProjectAppDto>>> GetAllProjectAppsAsync()
    {
        List<ProjectApp> apps = await unitOfWork.Applications.GetQueryable()
            .AsNoTracking()
            .Include(x => x.Owner)
            .ToListAsync();

        IEnumerable<ProjectAppDto> dtos = mapper.Map<IEnumerable<ProjectAppDto>>(apps);
        return ApiResponse<IEnumerable<ProjectAppDto>>.SuccessResult(dtos);
    }

    public async Task<ApiResponse<ProjectAppDto>> CreateProjectAppAsync(CreateProjectAppDto createDto, Guid ownerId)
    {
        ProjectApp app = new()
        {
            AppName = createDto.AppName,
            AppType = createDto.AppType,
            OwnerId = ownerId,
            Status = true
        };

        await unitOfWork.Applications.AddAsync(app);
        await unitOfWork.CompleteAsync();

        return await GetProjectAppByIdAsync(app.Id);
    }

    public async Task<ApiResponse<bool>> UpdateProjectAppAsync(Guid id, UpdateProjectAppDto updateDto)
    {
        ProjectApp? app = await unitOfWork.Applications.GetByIdAsync(id);
        if (app == null)
        {
            return ApiResponse<bool>.FailureResult("Application not found");
        }

        app.AppName = updateDto.AppName;
        app.AppType = updateDto.AppType;
        app.Status = updateDto.Status;
        app.UpdatedAt = DateTime.UtcNow;

        unitOfWork.Applications.Update(app);
        await unitOfWork.CompleteAsync();

        return ApiResponse<bool>.SuccessResult(true);
    }

    public async Task<ApiResponse<bool>> DeleteProjectAppAsync(Guid id)
    {
        ProjectApp? app = await unitOfWork.Applications.GetByIdAsync(id);
        if (app == null)
        {
            return ApiResponse<bool>.FailureResult("Application not found");
        }

        app.IsDeleted = true;
        app.UpdatedAt = DateTime.UtcNow;
        unitOfWork.Applications.Update(app);
        await unitOfWork.CompleteAsync();

        return ApiResponse<bool>.SuccessResult(true);
    }

    public async Task<ApiResponse<bool>> AddMemberAsync(Guid appId, Guid userId)
    {
        IEnumerable<ProjectAppMember> exists = await unitOfWork.ApplicationMembers.FindAsync(am => am.AppId == appId && am.UserId == userId);
        if (exists.Any())
        {
            return ApiResponse<bool>.FailureResult("User is already a member of this application");
        }

        ProjectAppMember member = new()
        {
            AppId = appId,
            UserId = userId
        };

        await unitOfWork.ApplicationMembers.AddAsync(member);
        await unitOfWork.CompleteAsync();

        return ApiResponse<bool>.SuccessResult(true);
    }

    public async Task<ApiResponse<bool>> RemoveMemberAsync(Guid appId, Guid userId)
    {
        ProjectAppMember? member = (await unitOfWork.ApplicationMembers.FindAsync(am => am.AppId == appId && am.UserId == userId)).FirstOrDefault();
        if (member == null)
        {
            return ApiResponse<bool>.FailureResult("Member not found");
        }

        unitOfWork.ApplicationMembers.Delete(member);
        await unitOfWork.CompleteAsync();

        return ApiResponse<bool>.SuccessResult(true);
    }
}
