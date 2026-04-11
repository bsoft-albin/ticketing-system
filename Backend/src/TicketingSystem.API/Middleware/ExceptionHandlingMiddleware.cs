using System.Net;
using System.Text.Json;
using TicketingSystem.Application.DTOs;

namespace TicketingSystem.API.Middleware;

public class ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
{
    private static readonly JsonSerializerOptions options = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An unhandled exception occurred.");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

        ApiResponse<object> response = ApiResponse<object>.FailureResult(
            "An internal server error occurred.",
            [exception.Message]
        );
        
        string result = JsonSerializer.Serialize(response, options);

        return context.Response.WriteAsync(result);
    }
}
