using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketingSystem.Application.DTOs;
using TicketingSystem.Application.Interfaces;

namespace TicketingSystem.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Register(RegisterDto registerDto)
    {
        ApiResponse<AuthResponseDto> result = await authService.RegisterAsync(registerDto);
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Login(LoginDto loginDto)
    {
        ApiResponse<AuthResponseDto> result = await authService.LoginAsync(loginDto);
        if (!result.Success)
        {
            return Unauthorized(result);
        }

        return Ok(result);
    }

    [HttpPost("refresh-token")]
    public async Task<ActionResult<ApiResponse<AuthResponseDto>>> RefreshToken([FromBody] string refreshToken)
    {
        ApiResponse<AuthResponseDto> result = await authService.RefreshTokenAsync(refreshToken);
        if (!result.Success)
        {
            return Unauthorized(result);
        }

        return Ok(result);
    }

    [Authorize]
    [HttpPost("revoke-token")]
    public async Task<ActionResult<ApiResponse<bool>>> RevokeToken([FromBody] string refreshToken)
    {
        ApiResponse<bool> result = await authService.RevokeTokenAsync(refreshToken);
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPost("forgot-password")]
    public async Task<ActionResult<ApiResponse<bool>>> ForgotPassword([FromBody] string email)
    {
        ApiResponse<bool> result = await authService.ForgotPasswordAsync(email);
        return Ok(result);
    }

    [HttpPost("reset-password")]
    public async Task<ActionResult<ApiResponse<bool>>> ResetPassword(ResetPasswordDto resetPasswordDto)
    {
        ApiResponse<bool> result = await authService.ResetPasswordAsync(resetPasswordDto);
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }
}
