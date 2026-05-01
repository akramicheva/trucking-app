using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using TruckingApp.Server.Data;
using TruckingApp.Server.Data.Entities;
using System.Security.Claims;

namespace TruckingApp.Server.Controllers;

[ApiController]
[Route("api/orders")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly ApplicationDbContext context;
    private readonly ILogger<OrdersController> logger;

    public OrdersController(ApplicationDbContext dbContext, ILogger<OrdersController> logger)
    {
        context = dbContext;
        this.logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
    {

        return await context.Orders
                            .AsNoTracking()
                            .OrderByDescending(s => s.CreatedAt)
                            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Order>> GetById(int id)
    {
        var order = await context.Orders.FindAsync(id);
        return order == null ? NotFound() : order;
    }

    [HttpPost("create-order")]
    public async Task<ActionResult<Order>> CreateOrder(Order order)
    {

        order.CreatedBy = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        context.Orders.Add(order);
        await context.SaveChangesAsync();
        logger.LogInformation("Заказ {orderNumber} был создан пользователем {userId}", order.OrderNumber, order.CreatedBy);
        return CreatedAtAction(nameof(CreateOrder), new { id = order.ID }, order);
    }
}