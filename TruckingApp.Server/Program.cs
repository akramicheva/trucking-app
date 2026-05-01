using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using TruckingApp.Server.Data;
using TruckingApp.Server.Logging;
using Serilog;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console() 
    .WriteTo.File("Logs/log-.txt", rollingInterval: RollingInterval.Day) 
    .MinimumLevel.Information()
    .CreateLogger();

builder.Host.UseSerilog();

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

builder.Services.AddOpenApi(); 

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
    
builder.Services.AddEndpointsApiExplorer();


builder.Services.AddAuthentication(IdentityConstants.BearerScheme)
                .AddBearerToken(IdentityConstants.BearerScheme);

builder.Services.AddAuthorization();

//Bind Identity with the database
builder.Services.AddIdentityCore<ApplicationUser>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders()
                .AddApiEndpoints(); // creates endpoints register, login


builder.Services.AddControllers();


try
{
    var app = builder.Build();
    app.UseSerilogRequestLogging(); 
    app.UseExceptionHandler();


    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
        //Microsoft.AspNetCore.OpenApi is substitution for Swagger (Swashbuckle).
        app.MapOpenApi();
    }

    app.UseDefaultFiles();

    app.UseHttpsRedirection();
    app.UseAuthentication();
    app.UseAuthorization();

    
    /*
        POST /register
        POST /login
        POST /refresh
        GET /manage/info (и другие)
        Use group "api" to avoid proxy conflicts with GET "register" method that should be rendered by React client
   */
    app.MapGroup("/api").MapIdentityApi<ApplicationUser>(); 
    app.MapControllers();

    // Allows to read files from wwwroot folder
    app.UseStaticFiles(); 
    app.MapStaticAssets(); 

    app.MapFallbackToFile("/index.html");

    app.Run();
}
catch (Exception ex)
{
   Log.Fatal(ex, "Сервер неожиданно завершил работу");
}
finally
{
    Log.CloseAndFlush();
}
