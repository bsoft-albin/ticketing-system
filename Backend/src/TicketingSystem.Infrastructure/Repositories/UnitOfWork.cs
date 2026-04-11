using TicketingSystem.Application.Interfaces.Repositories;
using TicketingSystem.Domain.Entities;
using TicketingSystem.Infrastructure.Data;

namespace TicketingSystem.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;
        Applications = new GenericRepository<ProjectApp>(_context);
        Tickets = new GenericRepository<Ticket>(_context);
        TicketComments = new GenericRepository<TicketComment>(_context);
        Attachments = new GenericRepository<Attachment>(_context);
        Notifications = new GenericRepository<Notification>(_context);
        AuditLogs = new GenericRepository<AuditLog>(_context);
        ApplicationMembers = new GenericRepository<ProjectAppMember>(_context);
        RefreshTokens = new GenericRepository<RefreshToken>(_context);
    }

    public IGenericRepository<ProjectApp> Applications { get; }
    public IGenericRepository<Ticket> Tickets { get; }
    public IGenericRepository<TicketComment> TicketComments { get; }
    public IGenericRepository<Attachment> Attachments { get; }
    public IGenericRepository<Notification> Notifications { get; }
    public IGenericRepository<AuditLog> AuditLogs { get; }
    public IGenericRepository<ProjectAppMember> ApplicationMembers { get; }
    public IGenericRepository<RefreshToken> RefreshTokens { get; }

    public async Task<int> CompleteAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
