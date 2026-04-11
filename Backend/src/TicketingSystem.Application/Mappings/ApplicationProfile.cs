using AutoMapper;
using TicketingSystem.Application.DTOs;
using TicketingSystem.Application.Interfaces;
using TicketingSystem.Domain.Entities;

namespace TicketingSystem.Application.Mappings;

public class ApplicationProfile : Profile
{
    public ApplicationProfile()
    {
        CreateMap<User, UserDto>();
        CreateMap<Ticket, TicketDto>()
            .ForMember(dest => dest.AppName, opt => opt.MapFrom(src => src.Application.AppName))
            .ForMember(dest => dest.CreatorName, opt => opt.MapFrom(src => src.Creator.FullName))
            .ForMember(dest => dest.AssigneeName, opt => opt.MapFrom(src => src.Assignee != null ? src.Assignee.FullName : null));

        CreateMap<ProjectApp, ProjectAppDto>()
            .ForMember(dest => dest.OwnerName, opt => opt.MapFrom(src => src.Owner.FullName));

        CreateMap<TicketComment, TicketCommentDto>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.FullName));

        CreateMap<Attachment, AttachmentDto>()
            .ForMember(dest => dest.UploaderName, opt => opt.MapFrom(src => src.Uploader.FullName));

        CreateMap<Notification, NotificationDto>();

        CreateMap<AuditLog, AuditLogDto>();
    }
}
