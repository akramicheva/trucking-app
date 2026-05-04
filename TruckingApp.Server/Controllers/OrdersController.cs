using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TruckingApp.Server.Data;
using TruckingApp.Server.Data.Entities;
using TruckingApp.Server.Models.Orders;

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
    public async Task<ActionResult<IEnumerable<OrderResponse>>> GetOrders()
    {
        var userId = GetCurrentUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var orders = await context.Orders
                                  .AsNoTracking()
                                  .Where(order => order.CreatedBy == userId)
                                  .OrderByDescending(order => order.CreatedAt)
                                  .ToListAsync();

        return orders.Select(OrderResponse.FromOrder).ToList();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<OrderResponse>> GetById(int id)
    {
        var userId = GetCurrentUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var order = await context.Orders
                                 .AsNoTracking()
                                 .FirstOrDefaultAsync(order => order.ID == id && order.CreatedBy == userId);

        return order is null ? NotFound() : OrderResponse.FromOrder(order);
    }

    [HttpPost]
    public async Task<ActionResult<OrderResponse>> CreateOrder(OrderRequest dto)
    {
        var userId = GetCurrentUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var order = Order.Create(dto.SenderCity, dto.SenderAddress, dto.ReceiverCity, dto.ReceiverAddress, dto.Weight, dto.PickupDate, userId);
        context.Orders.Add(order);
        await context.SaveChangesAsync();

        logger.LogInformation("Заказ {orderNumber} был создан пользователем {userId}", order.OrderNumber, order.CreatedBy);

        var response = OrderResponse.FromOrder(order);
        return CreatedAtAction(nameof(GetById), new { id = order.ID }, response);
    }

    private string? GetCurrentUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier);
    }
}
