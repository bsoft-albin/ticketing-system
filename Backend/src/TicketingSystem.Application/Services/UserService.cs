using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TicketingSystem.Application.DTOs;
using TicketingSystem.Application.Interfaces;
using TicketingSystem.Domain.Entities;

namespace TicketingSystem.Application.Services;

public class UserService : IUserService
{
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<Role> _roleManager;
    private readonly IMapper _mapper;

    public UserService(UserManager<User> userManager, RoleManager<Role> roleManager, IMapper mapper)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _mapper = mapper;
    }

    public async Task<ApiResponse<UserDto>> GetUserByIdAsync(Guid id)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null)
            return ApiResponse<UserDto>.FailureResult("User not found");

        var dto = _mapper.Map<UserDto>(user);
        return ApiResponse<UserDto>.SuccessResult(dto);
    }

    public async Task<ApiResponse<IEnumerable<UserDto>>> GetAllUsersAsync()
    {
        var users = await _userManager.Users.AsNoTracking().ToListAsync();
        var dtos = _mapper.Map<IEnumerable<UserDto>>(users);
        return ApiResponse<IEnumerable<UserDto>>.SuccessResult(dtos);
    }

    public async Task<ApiResponse<bool>> UpdateUserAsync(Guid id, UpdateUserDto updateDto)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null)
            return ApiResponse<bool>.FailureResult("User not found");

        user.FullName = updateDto.FullName;
        user.UpdatedAt = DateTime.UtcNow;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
            return ApiResponse<bool>.FailureResult("Failed to update user", result.Errors.Select(e => e.Description).ToList());

        return ApiResponse<bool>.SuccessResult(true);
    }

    public async Task<ApiResponse<bool>> UpdateUserStatusAsync(Guid id, bool status)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null)
            return ApiResponse<bool>.FailureResult("User not found");

        user.Status = status;
        user.UpdatedAt = DateTime.UtcNow;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
            return ApiResponse<bool>.FailureResult("Failed to update user status", result.Errors.Select(e => e.Description).ToList());

        return ApiResponse<bool>.SuccessResult(true);
    }

    public async Task<ApiResponse<bool>> UpdateUserRoleAsync(Guid id, string roleName)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null)
            return ApiResponse<bool>.FailureResult("User not found");

        if (!await _roleManager.RoleExistsAsync(roleName))
            return ApiResponse<bool>.FailureResult($"Role '{roleName}' does not exist");

        var currentRoles = await _userManager.GetRolesAsync(user);
        await _userManager.RemoveFromRolesAsync(user, currentRoles);
        var result = await _userManager.AddToRoleAsync(user, roleName);

        if (!result.Succeeded)
            return ApiResponse<bool>.FailureResult("Failed to update user role", result.Errors.Select(e => e.Description).ToList());

        return ApiResponse<bool>.SuccessResult(true);
    }
}
