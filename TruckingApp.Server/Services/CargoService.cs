using Microsoft.EntityFrameworkCore;
using TruckingApp.Server.Data;
using Trucking.Domain;
using TruckingApp.Server.Data.Entities;
using TruckingApp.Server.Models.Orders;

namespace TruckingApp.Server.Services;
public class CargoService: ICargoService
{
    private readonly ApplicationDbContext context;
    private readonly ILogger<CargoService> logger;

    public CargoService(ApplicationDbContext dbContext, ILogger<CargoService> logger)
    {
        context = dbContext;
        this.logger = logger;
    }

    public async Task<Order> CreateOrder(OrderRequest dto, string userId)
    {
        var order = Order.Create(dto.SenderCity, dto.SenderAddress, dto.ReceiverCity, dto.ReceiverAddress, dto.Weight, dto.PickupDate, userId);
        context.Orders.Add(order);
        await context.SaveChangesAsync();

        logger.LogInformation("Заказ {orderNumber} был создан пользователем {userId}", order.OrderNumber, order.CreatedBy);
        return order;
    }

    public async Task<Order?> GetById(int id, string userId)
    {
        return await context.Orders
                            .AsNoTracking()
                            .FirstOrDefaultAsync(order => order.ID == id && order.CreatedBy == userId);;
    }

    public async Task<IEnumerable<Order>> GetOrders(string userId)
    {
        return await context.Orders
                            .AsNoTracking()
                            .Where(order => order.CreatedBy == userId)
                            .OrderByDescending(order => order.CreatedAt)
                            .ToListAsync();
    }

    public decimal GetPrice(Cargo cargo, RouteInfo route)
    {
        var result = PriceCalculator.calculatePrice(cargo, route);
        if (result.IsOk)
        {
            return result.ResultValue;
        }
        else return -1;
    }
}