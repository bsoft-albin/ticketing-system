using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using TicketingSystem.Application.DTOs;
using TicketingSystem.Application.Interfaces;
using TicketingSystem.Application.Interfaces.Repositories;
using TicketingSystem.Domain.Entities;
using TicketingSystem.Domain.Enums;

namespace TicketingSystem.Application.Services;

public class AuthService(UserManager<User> userManager, IJwtService jwtService, IUnitOfWork unitOfWork, IConfiguration configuration) : IAuthService
{
    private readonly UserManager<User> _userManager = userManager;
    private readonly IJwtService _jwtService = jwtService;
    private readonly IUnitOfWork _unitOfWork = unitOfWork;
    private readonly IConfiguration _configuration = configuration;

    public async Task<ApiResponse<AuthResponseDto>> RegisterAsync(RegisterDto registerDto)
    {
        User? existingUser = await _userManager.FindByEmailAsync(registerDto.Email);
        if (existingUser != null)
        {
            return ApiResponse<AuthResponseDto>.FailureResult("User already exists");
        }

        User user = new()
        {
            UserName = registerDto.Email,
            Email = registerDto.Email,
            FullName = registerDto.FullName,
            AuthProvider = AuthProvider.LOCAL,
            Status = true
        };

        IdentityResult result = await _userManager.CreateAsync(user, registerDto.Password);
        if (!result.Succeeded)
        {
            return ApiResponse<AuthResponseDto>.FailureResult("Registration failed", result.Errors.Select(e => e.Description).ToList());
        }

        await _userManager.AddToRoleAsync(user, "EndUser");

        return await GenerateAuthResponse(user);
    }

    public async Task<ApiResponse<AuthResponseDto>> LoginAsync(LoginDto loginDto)
    {
        User? user = await _userManager.FindByEmailAsync(loginDto.Email);
        if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
        {
            return ApiResponse<AuthResponseDto>.FailureResult("Invalid email or password");
        }

        return !user.Status ? ApiResponse<AuthResponseDto>.FailureResult("User account is disabled") : await GenerateAuthResponse(user);
    }

    public async Task<ApiResponse<AuthResponseDto>> RefreshTokenAsync(string refreshToken)
    {
        RefreshToken? rt = await _unitOfWork.RefreshTokens.GetQueryable()
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.Token == refreshToken);

        if (rt == null || !rt.IsActive)
        {
            return ApiResponse<AuthResponseDto>.FailureResult("Invalid or expired refresh token");
        }

        // Revoke current token
        rt.IsRevoked = true;
        rt.UpdatedAt = DateTime.UtcNow;
        _unitOfWork.RefreshTokens.Update(rt);

        return await GenerateAuthResponse(rt.User);
    }

    public async Task<ApiResponse<bool>> RevokeTokenAsync(string refreshToken)
    {
        RefreshToken? rt = await _unitOfWork.RefreshTokens.GetQueryable()
            .FirstOrDefaultAsync(x => x.Token == refreshToken);

        if (rt == null)
        {
            return ApiResponse<bool>.FailureResult("Token not found");
        }

        rt.IsRevoked = true;
        rt.UpdatedAt = DateTime.UtcNow;
        _unitOfWork.RefreshTokens.Update(rt);
        await _unitOfWork.CompleteAsync();

        return ApiResponse<bool>.SuccessResult(true);
    }

    public async Task<ApiResponse<bool>> ForgotPasswordAsync(string email)
    {
        User? user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            return ApiResponse<bool>.SuccessResult(true); // Don't reveal if user exists
        }

        _ = await _userManager.GeneratePasswordResetTokenAsync(user);

        // TODO: Send email with token
        // _emailService.SendPasswordResetEmail(email, token);

        return ApiResponse<bool>.SuccessResult(true);
    }

    public async Task<ApiResponse<bool>> ResetPasswordAsync(ResetPasswordDto resetPasswordDto)
    {
        User? user = await _userManager.FindByEmailAsync(resetPasswordDto.Email);
        if (user == null)
        {
            return ApiResponse<bool>.FailureResult("Invalid request");
        }

        IdentityResult result = await _userManager.ResetPasswordAsync(user, resetPasswordDto.Token, resetPasswordDto.NewPassword);
        if (!result.Succeeded)
        {
            return ApiResponse<bool>.FailureResult("Password reset failed", result.Errors.Select(e => e.Description).ToList());
        }

        return ApiResponse<bool>.SuccessResult(true);
    }

    private async Task<ApiResponse<AuthResponseDto>> GenerateAuthResponse(User user)
    {
        IList<string> roles = await _userManager.GetRolesAsync(user);
        string accessToken = _jwtService.GenerateAccessToken(user, roles);
        string refreshToken = _jwtService.GenerateRefreshToken();

        RefreshToken rt = new()
        {
            Token = refreshToken,
            UserId = user.Id,
            ExpiresAt = DateTime.UtcNow.AddDays(double.Parse(_configuration["Jwt:RefreshTokenExpiryInDays"]!))
        };

        await _unitOfWork.RefreshTokens.AddAsync(rt);
        await _unitOfWork.CompleteAsync();

        return ApiResponse<AuthResponseDto>.SuccessResult(new AuthResponseDto
        {
            Token = accessToken,
            RefreshToken = refreshToken,
            User = new UserDto
            {
                Id = user.Id,
                UserName = user.UserName!,
                Email = user.Email!,
                FullName = user.FullName,
                Role = roles.FirstOrDefault() ?? "EndUser"
            }
        });

    }
}
