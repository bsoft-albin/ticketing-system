using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TicketingSystem.Application.DTOs;
using TicketingSystem.Application.Interfaces;
using TicketingSystem.Application.Interfaces.Repositories;
using TicketingSystem.Domain.Entities;

namespace TicketingSystem.Application.Services;

public class NotificationService(IUnitOfWork unitOfWork, IMapper mapper) : INotificationService
{
    public async Task<ApiResponse<IEnumerable<NotificationDto>>> GetUserNotificationsAsync(Guid userId)
    {
        List<Notification> notifications = await unitOfWork.Notifications.GetQueryable()
            .AsNoTracking()
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();

        return ApiResponse<IEnumerable<NotificationDto>>.SuccessResult(mapper.Map<IEnumerable<NotificationDto>>(notifications));
    }

    public async Task<ApiResponse<bool>> MarkAsReadAsync(Guid notificationId)
    {
        Notification? notification = await unitOfWork.Notifications.GetByIdAsync(notificationId);
        if (notification == null)
        {
            return ApiResponse<bool>.FailureResult("Notification not found");
        }

        notification.IsRead = true;
        notification.UpdatedAt = DateTime.UtcNow;

        unitOfWork.Notifications.Update(notification);
        await unitOfWork.CompleteAsync();

        return ApiResponse<bool>.SuccessResult(true);
    }

    public async Task<ApiResponse<bool>> MarkAllAsReadAsync(Guid userId)
    {
        List<Notification> notifications = await unitOfWork.Notifications.GetQueryable()
            .Where(x => x.UserId == userId && !x.IsRead)
            .ToListAsync();

        foreach (var notification in notifications)
        {
            notification.IsRead = true;
            notification.UpdatedAt = DateTime.UtcNow;
            unitOfWork.Notifications.Update(notification);
        }

        await unitOfWork.CompleteAsync();

        return ApiResponse<bool>.SuccessResult(true);
    }
}
