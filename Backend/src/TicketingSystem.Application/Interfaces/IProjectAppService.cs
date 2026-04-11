using TicketingSystem.Application.DTOs;
using TicketingSystem.Domain.Enums;

namespace TicketingSystem.Application.Interfaces;

public interface IProjectAppService
{
    Task<ApiResponse<ProjectAppDto>> GetProjectAppByIdAsync(Guid id);
    Task<ApiResponse<IEnumerable<ProjectAppDto>>> GetAllProjectAppsAsync();
    Task<ApiResponse<ProjectAppDto>> CreateProjectAppAsync(CreateProjectAppDto createDto, Guid ownerId);
    Task<ApiResponse<bool>> UpdateProjectAppAsync(Guid id, UpdateProjectAppDto updateDto);
    Task<ApiResponse<bool>> DeleteProjectAppAsync(Guid id);
    Task<ApiResponse<bool>> AddMemberAsync(Guid appId, Guid userId);
    Task<ApiResponse<bool>> RemoveMemberAsync(Guid appId, Guid userId);
}

public class ProjectAppDto
{
    public Guid Id { get; set; }
    public string AppName { get; set; } = string.Empty;
    public AppType AppType { get; set; }
    public Guid OwnerId { get; set; }
    public string OwnerName { get; set; } = string.Empty;
    public bool Status { get; set; }
}

public class CreateProjectAppDto
{
    public string AppName { get; set; } = string.Empty;
    public AppType AppType { get; set; }
}

public class UpdateProjectAppDto
{
    public string AppName { get; set; } = string.Empty;
    public AppType AppType { get; set; }
    public bool Status { get; set; }
}
