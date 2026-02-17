using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using FlowForge.Core.FlowParser;
using FlowForge.Core;
using FlowForge.Core.Excetentions;
using FlowForge.Repositories.Interfaces;
using FlowForge.Repositories;
using FlowForge.Services.Interfaces;
using FlowForge.Services;
using FlowForge.Models;
using System.Text.Json;
using System.Text.Json.Serialization;
// using FlowForge.Core.Extensions; // Corrected typo from Excetentions to Extensions if renamed, otherwise keep original

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddDataProtection();

// Swagger Configuration
builder.Services.AddSwaggerGen(options =>
{
    // 1. Define the security scheme
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\""
    });

    // 2. Make Swagger use the Bearer token
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
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
            new string[] {}
        }
    });
});
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.ListenAnyIP(
        int.Parse(Environment.GetEnvironmentVariable("PORT") ?? "8080"));
});


// Database configuration
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrEmpty(connectionString))
{
    // Fallback or throw based on your preference. Throwing ensures you don't run with a bad config.
    throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
    connectionString,
    new MySqlServerVersion(new Version(8, 0, 36))
)
    .EnableSensitiveDataLogging() // Helpful for debugging startup errors
    .EnableDetailedErrors()
);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
            .WithOrigins("http://localhost:5173", "https://your-frontend-domain.com") // Add your frontend URLs here
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

// Add JWT Authentication
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;

        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.Never;// do not ignore any fields
        

    });


builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.Authority = builder.Configuration["Jwt:Authority"];
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true
    };
});

// App-specific services
// Ensure all these implementations exist and implement the interface correctly
builder.Services.AddScoped<IFlowService, FlowService>();
builder.Services.AddScoped<IFlowRunService, FlowRunService>();
builder.Services.AddScoped<IFlowRepository, FlowRepository>();
builder.Services.AddScoped<NodeExecutionRepository>();
builder.Services.AddScoped<IFlowInstanceRepository, FlowInstanceRepository>();
builder.Services.AddScoped<IConnectionRepository, ConnectionRepository>();
builder.Services.AddScoped<IConnectionService, ConnectionService>();
builder.Services.AddScoped<FlowParser>();
builder.Services.AddScoped<DagConvertor>(); // Verify if this class exists in your new project structure
builder.Services.AddScoped<TopoSortGenerator>(); // Verify if this class exists
builder.Services.AddScoped<FlowEngine>();
builder.Services.AddNodeServices();

// If you have a custom extension method for Node services, ensure the namespace is correct
// builder.Services.AddNodeServices(); 

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

using(var scope=app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}
app.Run();