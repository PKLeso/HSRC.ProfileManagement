using Microsoft.EntityFrameworkCore;
using ProfileManagement.Configs.RoleConfigs;
using ProfileManagement.Data;
using ProfileManagement.Extensions;
using ProfileManagement.Services;
using Microsoft.OpenApi.Models;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.FileProviders;
using OfficeOpenXml;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Web;

var builder = WebApplication.CreateBuilder(args);

// Add Authentication
builder.Services.ConfigureJWT(builder);

builder.Services.Configure<FormOptions>(m =>
{
    m.ValueLengthLimit = int.MaxValue;
    m.MultipartBodyLengthLimit= int.MaxValue;
    m.MemoryBufferThreshold= int.MaxValue;
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"))
        .EnableTokenAcquisitionToCallDownstreamApi()
            .AddMicrosoftGraph(builder.Configuration.GetSection("MicrosoftGraph"))
            .AddInMemoryTokenCaches()
            .AddDownstreamWebApi("DownstreamApi", builder.Configuration.GetSection("DownstreamApi"))
            .AddInMemoryTokenCaches();

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

ConfigurationManager configuration = builder.Configuration;
ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

builder.Services.AddDbContext<ProfileManagementContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("AzureDbConnectionString"));
});

builder.Services.AddAuthentication();
builder.Services.ConfigureIdentity();

builder.Services.AddAutoMapper(typeof(Program));

builder.Services.AddScoped<IAuthManager, AuthManager>();

builder.Services.ConfigureSwaggerDoc();
//AddSwaggerDoc(builder.Services);

// Enable CORS
builder.Services.AddCorsPolicy();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("�nableCorsForAngularApp");

app.UseStaticFiles();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"Resources")),
    RequestPath = new PathString("/Resources")
});


app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();

app.Run();

