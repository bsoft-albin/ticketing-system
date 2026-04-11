using TicketingSystem.Application.DTOs;

namespace TicketingSystem.Application.Interfaces;

public interface IUserService
{
    Task<ApiResponse<UserDto>> GetUserByIdAsync(Guid id);
    Task<ApiResponse<IEnumerable<UserDto>>> GetAllUsersAsync();
    Task<ApiResponse<bool>> UpdateUserAsync(Guid id, UpdateUserDto updateDto);
    Task<ApiResponse<bool>> UpdateUserStatusAsync(Guid id, bool status);
    Task<ApiResponse<bool>> UpdateUserRoleAsync(Guid id, string roleName);
}

public class UpdateUserDto
{
    public string FullName { get; set; } = string.Empty;
}
