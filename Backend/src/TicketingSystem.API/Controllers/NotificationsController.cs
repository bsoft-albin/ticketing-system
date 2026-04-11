using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TicketingSystem.Application.DTOs;
using TicketingSystem.Application.Interfaces;

namespace TicketingSystem.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class NotificationsController(INotificationService notificationService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<NotificationDto>>>> GetNotifications()
    {
        Guid userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        ApiResponse<IEnumerable<NotificationDto>> result = await notificationService.GetUserNotificationsAsync(userId);
        return Ok(result);
    }

    [HttpPatch("{id}/read")]
    public async Task<ActionResult<ApiResponse<bool>>> MarkAsRead(Guid id)
    {
        ApiResponse<bool> result = await notificationService.MarkAsReadAsync(id);
        if (!result.Success)
        {
            return NotFound(result);
        }

        return Ok(result);
    }

    [HttpPatch("read-all")]
    public async Task<ActionResult<ApiResponse<bool>>> MarkAllAsRead()
    {
        Guid userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        ApiResponse<bool> result = await notificationService.MarkAllAsReadAsync(userId);
        return Ok(result);
    }
}
