using TicketingSystem.Application.DTOs;

namespace TicketingSystem.Application.Interfaces;

public interface INotificationService
{
    Task<ApiResponse<IEnumerable<NotificationDto>>> GetUserNotificationsAsync(Guid userId);
    Task<ApiResponse<bool>> MarkAsReadAsync(Guid notificationId);
    Task<ApiResponse<bool>> MarkAllAsReadAsync(Guid userId);
}

public class NotificationDto
{
    public Guid Id { get; set; }
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
}
