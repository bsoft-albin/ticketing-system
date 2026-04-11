using TicketingSystem.Application.DTOs;
using TicketingSystem.Domain.Enums;

namespace TicketingSystem.Application.Interfaces;

public interface ITicketService
{
    Task<ApiResponse<TicketDto>> GetTicketByIdAsync(Guid id);
    Task<ApiResponse<IEnumerable<TicketDto>>> GetTicketsAsync(int pageNumber, int pageSize);
    Task<ApiResponse<TicketDto>> CreateTicketAsync(CreateTicketDto createTicketDto, Guid userId);
    Task<ApiResponse<bool>> UpdateTicketAsync(Guid id, UpdateTicketDto updateDto);
    Task<ApiResponse<bool>> DeleteTicketAsync(Guid id);
    Task<ApiResponse<bool>> UpdateTicketStatusAsync(Guid id, TicketStatus status);
    Task<ApiResponse<bool>> AssignTicketAsync(Guid id, Guid userId);
    Task<ApiResponse<bool>> UpdateTicketPriorityAsync(Guid id, TicketPriority priority);
    
    // Comments
    Task<ApiResponse<TicketCommentDto>> AddCommentAsync(Guid ticketId, Guid userId, string comment);
    Task<ApiResponse<IEnumerable<TicketCommentDto>>> GetCommentsAsync(Guid ticketId);
    
    // Attachments
    Task<ApiResponse<AttachmentDto>> AddAttachmentAsync(Guid ticketId, Guid userId, string fileUrl);
    Task<ApiResponse<IEnumerable<AttachmentDto>>> GetAttachmentsAsync(Guid ticketId);
}

public class UpdateTicketDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public TicketPriority Priority { get; set; }
    public TicketType Type { get; set; }
}

public class TicketCommentDto
{
    public Guid Id { get; set; }
    public Guid TicketId { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class AttachmentDto
{
    public Guid Id { get; set; }
    public Guid TicketId { get; set; }
    public string FileUrl { get; set; } = string.Empty;
    public Guid UploadedBy { get; set; }
    public string UploaderName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class CreateTicketDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid AppId { get; set; }
    public TicketPriority Priority { get; set; }
    public TicketType Type { get; set; }
}
