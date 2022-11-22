using Microsoft.EntityFrameworkCore;
using ProfileManagement.Configs.RoleConfigs;
using ProfileManagement.Data;
using ProfileManagement.Extensions;
using ProfileManagement.Services;
using Microsoft.OpenApi.Models;
using System.Collections.Generic;

var builder = WebApplication.CreateBuilder(args);

// Add Authentication
builder.Services.ConfigureJWT(builder);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

ConfigurationManager configuration = builder.Configuration;


builder.Services.AddDbContext<ProfileManagementContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DbConnectionString"));
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

app.UseCors("ËnableCorsForAngularApp");

app.UseStaticFiles();
app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();

app.Run();

