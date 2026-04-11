using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TicketingSystem.Application.DTOs;
using TicketingSystem.Application.Interfaces;
using TicketingSystem.Domain.Enums;

namespace TicketingSystem.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class TicketsController(ITicketService ticketService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<TicketDto>>>> GetTickets([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        ApiResponse<IEnumerable<TicketDto>> result = await ticketService.GetTicketsAsync(pageNumber, pageSize);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<TicketDto>>> GetTicket(Guid id)
    {
        ApiResponse<TicketDto> result = await ticketService.GetTicketByIdAsync(id);
        if (!result.Success)
        {
            return NotFound(result);
        }

        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<TicketDto>>> CreateTicket(CreateTicketDto createTicketDto)
    {
        Guid userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        ApiResponse<TicketDto> result = await ticketService.CreateTicketAsync(createTicketDto, userId);
        return CreatedAtAction(nameof(GetTicket), new { id = result.Data?.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> UpdateTicket(Guid id, UpdateTicketDto updateDto)
    {
        ApiResponse<bool> result = await ticketService.UpdateTicketAsync(id, updateDto);
        if (!result.Success)
        {
            return NotFound(result);
        }

        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteTicket(Guid id)
    {
        ApiResponse<bool> result = await ticketService.DeleteTicketAsync(id);
        if (!result.Success)
        {
            return NotFound(result);
        }

        return Ok(result);
    }

    [HttpPatch("{id}/status")]
    public async Task<ActionResult<ApiResponse<bool>>> UpdateStatus(Guid id, [FromBody] TicketStatus status)
    {
        ApiResponse<bool> result = await ticketService.UpdateTicketStatusAsync(id, status);
        if (!result.Success)
        {
            return NotFound(result);
        }

        return Ok(result);
    }

    [HttpPatch("{id}/assign")]
    public async Task<ActionResult<ApiResponse<bool>>> AssignTicket(Guid id, [FromBody] Guid userId)
    {
        ApiResponse<bool> result = await ticketService.AssignTicketAsync(id, userId);
        if (!result.Success)
        {
            return NotFound(result);
        }

        return Ok(result);
    }

    [HttpPatch("{id}/priority")]
    public async Task<ActionResult<ApiResponse<bool>>> UpdatePriority(Guid id, [FromBody] TicketPriority priority)
    {
        ApiResponse<bool> result = await ticketService.UpdateTicketPriorityAsync(id, priority);
        if (!result.Success)
        {
            return NotFound(result);
        }

        return Ok(result);
    }

    [HttpPost("{id}/comments")]
    public async Task<ActionResult<ApiResponse<TicketCommentDto>>> AddComment(Guid id, [FromBody] string comment)
    {
        Guid userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        ApiResponse<TicketCommentDto> result = await ticketService.AddCommentAsync(id, userId, comment);
        return Ok(result);
    }

    [HttpGet("{id}/comments")]
    public async Task<ActionResult<ApiResponse<IEnumerable<TicketCommentDto>>>> GetComments(Guid id)
    {
        ApiResponse<IEnumerable<TicketCommentDto>> result = await ticketService.GetCommentsAsync(id);
        return Ok(result);
    }

    [HttpPost("{id}/attachments")]
    public async Task<ActionResult<ApiResponse<AttachmentDto>>> AddAttachment(Guid id, [FromBody] string fileUrl)
    {
        Guid userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        ApiResponse<AttachmentDto> result = await ticketService.AddAttachmentAsync(id, userId, fileUrl);
        return Ok(result);
    }

    [HttpGet("{id}/attachments")]
    public async Task<ActionResult<ApiResponse<IEnumerable<AttachmentDto>>>> GetAttachments(Guid id)
    {
        ApiResponse<IEnumerable<AttachmentDto>> result = await ticketService.GetAttachmentsAsync(id);
        return Ok(result);
    }
}
