using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.ResponseCompression;

//using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using TicketingSystem.API.Hubs;
using TicketingSystem.API.Middleware;
using TicketingSystem.Application;
using TicketingSystem.Domain.Global;
using TicketingSystem.Infrastructure;
using TicketingSystem.Infrastructure.BackgroundServices;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Registers IOptions<MySettings> in DI
builder.Services.Configure<TicketingSystemAppSettings>(
    builder.Configuration.GetSection("TicketingSystemAppSettings"));

int appPort = builder.Configuration.GetValue<int>("TicketingSystemAppSettings:AppPort");

// Add Layers
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplication();
builder.Services.AddSingleton<AuditLogBackgroundService>();
builder.Services.AddHostedService(sp => sp.GetRequiredService<AuditLogBackgroundService>());

builder.Services.AddControllers();
builder.Services.AddSignalR();

builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<BrotliCompressionProvider>();
    options.Providers.Add<GzipCompressionProvider>();
});

// Application Server Configuration
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.AddServerHeader = false;
    // Set server limits
    serverOptions.Limits.MaxRequestBodySize = 52428800; // 50 MB
    serverOptions.Limits.MaxConcurrentConnections = 100;
    if (appPort > 0)
    {
        serverOptions.ListenAnyIP(appPort);
    }
});

// JWT Configuration
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
    };
});

// Swagger Configuration
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Ticketing System API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

WebApplication app = builder.Build();

// Middleware
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.Use(async (context, next) =>
{
    context.Response.Headers.Append("X-App-Name", "Ticketing System");
    context.Response.Headers.Append("X-App-Version", "1.0");
    context.Response.Headers.Append("X-Performance", "Optimized");

    await next(context);
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
        options.RoutePrefix = "swagger";
    });
}

app.UseHttpsRedirection();

app.UseResponseCompression();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<NotificationHub>("/hubs/notifications");

// Seed Roles
using (IServiceScope scope = app.Services.CreateScope())
{
    IServiceProvider services = scope.ServiceProvider;
    await TicketingSystem.Infrastructure.Data.DatabaseSeeder.SeedRolesAsync(services);
}

app.Run();
