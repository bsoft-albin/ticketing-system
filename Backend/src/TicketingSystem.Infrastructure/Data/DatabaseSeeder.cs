using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using TicketingSystem.Domain.Entities;

namespace TicketingSystem.Infrastructure.Data;

public static class DatabaseSeeder
{
    public static async Task SeedRolesAsync(IServiceProvider serviceProvider)
    {
        var roleManager = serviceProvider.GetRequiredService<RoleManager<Role>>();

        string[] roles = { "Admin", "Developer", "Support", "EndUser" };

        foreach (var roleName in roles)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                await roleManager.CreateAsync(new Role { Name = roleName });
            }
        }
    }
}
