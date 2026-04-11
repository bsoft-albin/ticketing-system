using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Collections.Concurrent;
using TicketingSystem.Application.Interfaces.Repositories;
using TicketingSystem.Domain.Entities;

namespace TicketingSystem.Infrastructure.BackgroundServices;

public class AuditLogBackgroundService(IServiceProvider serviceProvider) : BackgroundService
{
    private readonly ConcurrentQueue<AuditLog> _queue = new();

    public void QueueAuditLog(AuditLog log)
    {
        _queue.Enqueue(log);
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            if (_queue.TryDequeue(out var log))
            {
                using IServiceScope scope = serviceProvider.CreateScope();
                IUnitOfWork unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
                await unitOfWork.AuditLogs.AddAsync(log);
                await unitOfWork.CompleteAsync();
            }
            else
            {
                await Task.Delay(1000, stoppingToken);
            }
        }
    }
}
