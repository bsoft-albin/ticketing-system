using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TicketingSystem.Application.DTOs;
using TicketingSystem.Application.Interfaces;

namespace TicketingSystem.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class ApplicationsController(IProjectAppService projectAppService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<ProjectAppDto>>>> GetApplications()
    {
        ApiResponse<IEnumerable<ProjectAppDto>> result = await projectAppService.GetAllProjectAppsAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<ProjectAppDto>>> GetApplication(Guid id)
    {
        ApiResponse<ProjectAppDto> result = await projectAppService.GetProjectAppByIdAsync(id);
        if (!result.Success)
        {
            return (ActionResult<ApiResponse<ProjectAppDto>>)NotFound(result);
        }
        else
        {
            return (ActionResult<ApiResponse<ProjectAppDto>>)Ok(result);
        }
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<ProjectAppDto>>> CreateApplication(CreateProjectAppDto createDto)
    {
        Guid userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        ApiResponse<ProjectAppDto> result = await projectAppService.CreateProjectAppAsync(createDto, userId);
        return CreatedAtAction(nameof(GetApplication), new { id = result.Data?.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> UpdateApplication(Guid id, UpdateProjectAppDto updateDto)
    {
        ApiResponse<bool> result = await projectAppService.UpdateProjectAppAsync(id, updateDto);
        if (!result.Success)
        {
            return (ActionResult<ApiResponse<bool>>)NotFound(result);
        }
        else
        {
            return (ActionResult<ApiResponse<bool>>)Ok(result);
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteApplication(Guid id)
    {
        ApiResponse<bool> result = await projectAppService.DeleteProjectAppAsync(id);
        if (!result.Success)
        {
            return (ActionResult<ApiResponse<bool>>)NotFound(result);
        }
        else
        {
            return (ActionResult<ApiResponse<bool>>)Ok(result);
        }
    }

    [HttpPost("{id}/members")]
    public async Task<ActionResult<ApiResponse<bool>>> AddMember(Guid id, [FromBody] Guid userId)
    {
        ApiResponse<bool> result = await projectAppService.AddMemberAsync(id, userId);
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpDelete("{id}/members/{userId}")]
    public async Task<ActionResult<ApiResponse<bool>>> RemoveMember(Guid id, Guid userId)
    {
        ApiResponse<bool> result = await projectAppService.RemoveMemberAsync(id, userId);
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }
}
