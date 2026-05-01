using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace TruckingApp.Server.Logging
{
    public class GlobalExceptionHandler : IExceptionHandler
    {
        private readonly ILogger<GlobalExceptionHandler> _logger;

        public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
        {
            _logger = logger;
        }

        public async ValueTask<bool> TryHandleAsync(
            HttpContext httpContext, 
            Exception exception, 
            CancellationToken cancellationToken)
        {
            // 1. Логируем ошибку с деталями запроса
            _logger.LogError(exception, "Произошла необработанная ошибка: {Message}", exception.Message);

            // 2. Подготавливаем ответ для фронтенда (React)
            var problemDetails = new ProblemDetails
            {
                Status = StatusCodes.Status500InternalServerError,
                Title = "Server Error",
                Detail = exception.Message // В продакшене лучше скрывать детали
            };

            httpContext.Response.StatusCode = problemDetails.Status.Value;

            // 3. Отправляем JSON
            await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

            return true; // Ошибка обработана
        }
    }
}
