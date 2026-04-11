using TicketingSystem.Domain.Entities;

namespace TicketingSystem.Application.Interfaces.Repositories;

public interface IUnitOfWork : IDisposable
{
    IGenericRepository<ProjectApp> Applications { get; }
    IGenericRepository<Ticket> Tickets { get; }
    IGenericRepository<TicketComment> TicketComments { get; }
    IGenericRepository<Attachment> Attachments { get; }
    IGenericRepository<Notification> Notifications { get; }
    IGenericRepository<AuditLog> AuditLogs { get; }
    IGenericRepository<ProjectAppMember> ApplicationMembers { get; }
    IGenericRepository<RefreshToken> RefreshTokens { get; }
    Task<int> CompleteAsync();
}
