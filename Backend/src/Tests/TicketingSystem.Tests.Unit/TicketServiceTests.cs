using AutoMapper;
using Moq;
using TicketingSystem.Application.Interfaces.Repositories;
using TicketingSystem.Application.Services;
using TicketingSystem.Domain.Entities;
using TicketingSystem.Domain.Enums;

namespace TicketingSystem.Tests.Unit;

public class TicketServiceTests
{
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly TicketService _ticketService;

    public TicketServiceTests()
    {
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _mapperMock = new Mock<IMapper>();
        _ticketService = new TicketService(_unitOfWorkMock.Object, _mapperMock.Object);
    }

    [Fact]
    public async Task UpdateTicketStatusAsync_ShouldReturnSuccess_WhenTicketExists()
    {
        // Arrange
        var ticketId = Guid.NewGuid();
        var ticket = new Ticket { Id = ticketId, Status = TicketStatus.OPEN };
        _unitOfWorkMock.Setup(u => u.Tickets.GetByIdAsync(ticketId)).ReturnsAsync(ticket);
        _unitOfWorkMock.Setup(u => u.CompleteAsync()).ReturnsAsync(1);

        // Act
        var result = await _ticketService.UpdateTicketStatusAsync(ticketId, TicketStatus.IN_PROGRESS);

        // Assert
        Assert.True(result.Success);
        Assert.Equal(TicketStatus.IN_PROGRESS, ticket.Status);
        _unitOfWorkMock.Verify(u => u.Tickets.Update(ticket), Times.Once);
        _unitOfWorkMock.Verify(u => u.CompleteAsync(), Times.Once);
    }

    [Fact]
    public async Task UpdateTicketStatusAsync_ShouldReturnFailure_WhenTicketDoesNotExist()
    {
        // Arrange
        var ticketId = Guid.NewGuid();
        _unitOfWorkMock.Setup(u => u.Tickets.GetByIdAsync(ticketId)).ReturnsAsync((Ticket?)null);

        // Act
        var result = await _ticketService.UpdateTicketStatusAsync(ticketId, TicketStatus.IN_PROGRESS);

        // Assert
        Assert.False(result.Success);
        Assert.Equal("Ticket not found", result.Message);
    }
}
