using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketingSystem.Application.DTOs;
using TicketingSystem.Application.Interfaces;

namespace TicketingSystem.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class UsersController(IUserService userService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<UserDto>>>> GetUsers()
    {
        ApiResponse<IEnumerable<UserDto>> result = await userService.GetAllUsersAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<UserDto>>> GetUser(Guid id)
    {
        ApiResponse<UserDto> result = await userService.GetUserByIdAsync(id);
        if (!result.Success)
        {
            return NotFound(result);
        }

        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> UpdateUser(Guid id, UpdateUserDto updateDto)
    {
        ApiResponse<bool> result = await userService.UpdateUserAsync(id, updateDto);
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPatch("{id}/status")]
    public async Task<ActionResult<ApiResponse<bool>>> UpdateStatus(Guid id, [FromBody] bool status)
    {
        ApiResponse<bool> result = await userService.UpdateUserStatusAsync(id, status);
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}/role")]
    public async Task<ActionResult<ApiResponse<bool>>> UpdateRole(Guid id, [FromBody] string roleName)
    {
        ApiResponse<bool> result = await userService.UpdateUserRoleAsync(id, roleName);
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }
}
