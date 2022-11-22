using Microsoft.OpenApi.Models;

namespace ProfileManagement.Extensions
{
    public static class AddSwaggerDocExtension
    {
        public static void ConfigureSwaggerDoc(this IServiceCollection services)
        {
            AddSwaggerDoc(services);
        }

        private static void AddSwaggerDoc(IServiceCollection services)
        {
            services.AddSwaggerGen(c =>
            {
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = @"JWT Authorization header using the Bearer scheme.
                            Enter 'Bearer' [space] an then your token in the text input below
                            Example: 'Bearer sfdf2545sdf'",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement() {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "OAuth2",
                  Name = "Bearer",
                  In = ParameterLocation.Header
            },
            new List<string>()
        }});

                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Profile Management", Version = "v1" });
            });
        }
    }
}
