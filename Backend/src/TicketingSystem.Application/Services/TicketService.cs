using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TicketingSystem.Application.DTOs;
using TicketingSystem.Application.Interfaces;
using TicketingSystem.Application.Interfaces.Repositories;
using TicketingSystem.Domain.Entities;
using TicketingSystem.Domain.Enums;

namespace TicketingSystem.Application.Services;

public class TicketService(IUnitOfWork unitOfWork, IMapper mapper) : ITicketService
{
    public async Task<ApiResponse<TicketDto>> GetTicketByIdAsync(Guid id)
    {
        Ticket? ticket = await unitOfWork.Tickets.GetQueryable()
            .AsNoTracking()
            .Include(t => t.Application)
            .Include(t => t.Creator)
            .Include(t => t.Assignee)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (ticket == null)
        {
            return ApiResponse<TicketDto>.FailureResult("Ticket not found");
        }

        TicketDto dto = mapper.Map<TicketDto>(ticket);
        return ApiResponse<TicketDto>.SuccessResult(dto);
    }

    public async Task<ApiResponse<IEnumerable<TicketDto>>> GetTicketsAsync(int pageNumber, int pageSize)
    {
        List<Ticket> tickets = await unitOfWork.Tickets.GetQueryable()
            .AsNoTracking()
            .Include(t => t.Application)
            .Include(t => t.Creator)
            .Include(t => t.Assignee)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        IEnumerable<TicketDto> dtos = mapper.Map<IEnumerable<TicketDto>>(tickets);
        return ApiResponse<IEnumerable<TicketDto>>.SuccessResult(dtos);
    }

    public async Task<ApiResponse<TicketDto>> CreateTicketAsync(CreateTicketDto createTicketDto, Guid userId)
    {
        Ticket ticket = new()
        {
            Title = createTicketDto.Title,
            Description = createTicketDto.Description,
            AppId = createTicketDto.AppId,
            Priority = createTicketDto.Priority,
            Type = createTicketDto.Type,
            CreatedBy = userId,
            Status = TicketStatus.OPEN
        };

        await unitOfWork.Tickets.AddAsync(ticket);
        await unitOfWork.CompleteAsync();

        return await GetTicketByIdAsync(ticket.Id);
    }

    public async Task<ApiResponse<bool>> UpdateTicketAsync(Guid id, UpdateTicketDto updateDto)
    {
        Ticket? ticket = await unitOfWork.Tickets.GetByIdAsync(id);
        if (ticket == null)
        {
            return ApiResponse<bool>.FailureResult("Ticket not found");
        }

        ticket.Title = updateDto.Title;
        ticket.Description = updateDto.Description;
        ticket.Priority = updateDto.Priority;
        ticket.Type = updateDto.Type;
        ticket.UpdatedAt = DateTime.UtcNow;

        unitOfWork.Tickets.Update(ticket);
        await unitOfWork.CompleteAsync();

        return ApiResponse<bool>.SuccessResult(true);
    }

    public async Task<ApiResponse<bool>> DeleteTicketAsync(Guid id)
    {
        Ticket? ticket = await unitOfWork.Tickets.GetByIdAsync(id);
        if (ticket == null)
        {
            return ApiResponse<bool>.FailureResult("Ticket not found");
        }

        ticket.IsDeleted = true;
        ticket.UpdatedAt = DateTime.UtcNow;

        unitOfWork.Tickets.Update(ticket);
        await unitOfWork.CompleteAsync();

        return ApiResponse<bool>.SuccessResult(true);
    }

    public async Task<ApiResponse<bool>> UpdateTicketStatusAsync(Guid id, TicketStatus status)
    {
        Ticket? ticket = await unitOfWork.Tickets.GetByIdAsync(id);
        if (ticket == null)
        {
            return ApiResponse<bool>.FailureResult("Ticket not found");
        }

        ticket.Status = status;
        ticket.UpdatedAt = DateTime.UtcNow;

        unitOfWork.Tickets.Update(ticket);
        await unitOfWork.CompleteAsync();

        return ApiResponse<bool>.SuccessResult(true);
    }

    public async Task<ApiResponse<bool>> AssignTicketAsync(Guid id, Guid userId)
    {
        Ticket? ticket = await unitOfWork.Tickets.GetByIdAsync(id);
        if (ticket == null)
        {
            return ApiResponse<bool>.FailureResult("Ticket not found");
        }

        ticket.AssignedTo = userId;
        ticket.UpdatedAt = DateTime.UtcNow;

        unitOfWork.Tickets.Update(ticket);
        await unitOfWork.CompleteAsync();

        return ApiResponse<bool>.SuccessResult(true);
    }

    public async Task<ApiResponse<bool>> UpdateTicketPriorityAsync(Guid id, TicketPriority priority)
    {
        Ticket? ticket = await unitOfWork.Tickets.GetByIdAsync(id);
        if (ticket == null)
        {
            return ApiResponse<bool>.FailureResult("Ticket not found");
        }

        ticket.Priority = priority;
        ticket.UpdatedAt = DateTime.UtcNow;

        unitOfWork.Tickets.Update(ticket);
        await unitOfWork.CompleteAsync();

        return ApiResponse<bool>.SuccessResult(true);
    }

    public async Task<ApiResponse<TicketCommentDto>> AddCommentAsync(Guid ticketId, Guid userId, string comment)
    {
        TicketComment ticketComment = new()
        {
            TicketId = ticketId,
            UserId = userId,
            Comment = comment
        };

        await unitOfWork.TicketComments.AddAsync(ticketComment);
        await unitOfWork.CompleteAsync();

        TicketComment? result = await unitOfWork.TicketComments.GetQueryable()
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.Id == ticketComment.Id);

        return ApiResponse<TicketCommentDto>.SuccessResult(mapper.Map<TicketCommentDto>(result));
    }

    public async Task<ApiResponse<IEnumerable<TicketCommentDto>>> GetCommentsAsync(Guid ticketId)
    {
        List<TicketComment> comments = await unitOfWork.TicketComments.GetQueryable()
            .AsNoTracking()
            .Include(x => x.User)
            .Where(x => x.TicketId == ticketId)
            .ToListAsync();

        return ApiResponse<IEnumerable<TicketCommentDto>>.SuccessResult(mapper.Map<IEnumerable<TicketCommentDto>>(comments));
    }

    public async Task<ApiResponse<AttachmentDto>> AddAttachmentAsync(Guid ticketId, Guid userId, string fileUrl)
    {
        Attachment attachment = new()
        {
            TicketId = ticketId,
            UploadedBy = userId,
            FileUrl = fileUrl
        };

        await unitOfWork.Attachments.AddAsync(attachment);
        await unitOfWork.CompleteAsync();

        Attachment? result = await unitOfWork.Attachments.GetQueryable()
            .Include(x => x.Uploader)
            .FirstOrDefaultAsync(x => x.Id == attachment.Id);

        return ApiResponse<AttachmentDto>.SuccessResult(mapper.Map<AttachmentDto>(result));
    }

    public async Task<ApiResponse<IEnumerable<AttachmentDto>>> GetAttachmentsAsync(Guid ticketId)
    {
        List<Attachment> attachments = await unitOfWork.Attachments.GetQueryable()
            .AsNoTracking()
            .Include(x => x.Uploader)
            .Where(x => x.TicketId == ticketId)
            .ToListAsync();

        return ApiResponse<IEnumerable<AttachmentDto>>.SuccessResult(mapper.Map<IEnumerable<AttachmentDto>>(attachments));
    }
}
