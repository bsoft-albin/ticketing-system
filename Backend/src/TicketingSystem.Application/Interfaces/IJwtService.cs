using System.Security.Claims;
using TicketingSystem.Domain.Entities;

namespace TicketingSystem.Application.Interfaces;

public interface IJwtService
{
    string GenerateAccessToken(User user, IEnumerable<string> roles);
    string GenerateRefreshToken();
    ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
}
