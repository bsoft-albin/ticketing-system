using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using TicketingSystem.Application.Interfaces;
using TicketingSystem.Application.Services;

namespace TicketingSystem.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddAutoMapper(cfg => cfg.AddMaps(Assembly.GetExecutingAssembly()));
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        services.AddScoped<ITicketService, TicketService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IProjectAppService, ProjectAppService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<INotificationService, NotificationService>();
        services.AddScoped<IDashboardService, DashboardService>();
        services.AddScoped<IAuditLogService, AuditLogService>();

        return services;
    }
}
