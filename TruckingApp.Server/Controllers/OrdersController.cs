using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TruckingApp.Server.Data;
using TruckingApp.Server.Models.Orders;
using TruckingApp.Server.Services;
using Trucking.Domain;

namespace TruckingApp.Server.Controllers;

[ApiController]
[Route("api/orders")]
[Authorize]
public class OrdersController : ControllerBase
{

    private readonly ICargoService cargoService;
    private readonly ILogger<OrdersController> logger;

    public OrdersController(ICargoService cargoService, ILogger<OrdersController> logger)
    {
        this.cargoService = cargoService;
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

        var orders = await cargoService.GetOrders(userId);

        return orders.Select(o => OrderResponse.FromOrder(o, 0.0m)).ToList();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<OrderResponse>> GetById(int id)
    {
        var userId = GetCurrentUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var order = await cargoService.GetById(id, userId);
        if (order != null)
        {
            var route = new RouteInfo(
                distanceKm: 450.5m, 
                isInternational: false
            );

            var cargo = new Cargo(
                weightKg: order.Weight, 
                type: CargoType.Fragile // Discriminated Union в C# выглядит как иерархия классов
            );

            var price = cargoService.GetPrice(cargo, route);                         
            logger.LogInformation("Цена заказа {orderNumber} составила: {userId} рублей", order.OrderNumber, price);
            return OrderResponse.FromOrder(order, price);
        }
        return NotFound();
    }

    [HttpPost]
    public async Task<ActionResult<OrderResponse>> CreateOrder(OrderRequest dto)
    {
        var userId = GetCurrentUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var order = await cargoService.CreateOrder(dto, userId);
        var response = OrderResponse.FromOrder(order);
        return CreatedAtAction(nameof(GetById), new { id = order.ID }, response);
    }

    private string? GetCurrentUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier);
    }
}
