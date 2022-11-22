using Microsoft.AspNetCore.Identity;
using ProfileManagement.Data;
using ProfileManagement.Models;
using ProfileManagement.Configs.RoleConfigs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace ProfileManagement.Extensions
{
    public static class ServiceExtension
    {
        public static void ConfigureIdentity(this IServiceCollection services)
        {
            var builder = services.AddIdentityCore<User>(s => s.User.RequireUniqueEmail = true);

            builder = new IdentityBuilder(builder.UserType, typeof(IdentityRole), services);
            builder.AddEntityFrameworkStores<ProfileManagementContext>().AddDefaultTokenProviders();
        }

        public static void ConfigureJWT(this IServiceCollection services, WebApplicationBuilder config)
        {
            var jwtSettings = config.Configuration.GetSection("JwtOptions");
            var key = jwtSettings.GetSection("Key").Value; //config.Configuration["JwtOptions:Key"]; // If key was set as the environment variable: Environment.GetEnvironmentVariable("KEY");

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(opt =>
            {
                opt.TokenValidationParameters = new TokenValidationParameters
                {
                    //Token is going to be valid if:
                    ValidateIssuer = true, // - the Issuer is the actual server, that created the token.
                    ValidateAudience = true, // - the receiver of the token is the valid recipient.
                    ValidateLifetime = true, // - if the token has not expired.
                    ValidateIssuerSigningKey = true, // the signing key is valid and is trusted by the server.

                    ValidIssuer = jwtSettings.GetSection("Issuer").Value, // config.Configuration["JwtOptions:Issuer"],
                    ValidAudience = jwtSettings.GetSection("Audiance").Value, // config.Configuration["JwtOptions:Audiance"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)) //config.Configuration["JwtOptions:key"] For testing I will have the key in the configurations, but ideally it has to be stored in the environment variables
                };
            });
        }
    }

}
