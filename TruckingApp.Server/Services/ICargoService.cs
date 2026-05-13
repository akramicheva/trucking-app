using Trucking.Domain;
using TruckingApp.Server.Data.Entities;
using TruckingApp.Server.Models.Orders;

namespace TruckingApp.Server.Services;
public interface ICargoService
{
    public decimal GetPrice(Cargo cargo, RouteInfo route); 
    public Task<Order?> GetById(int id, string userId);
    public Task<IEnumerable<Order>> GetOrders(string userId);
    public Task<Order> CreateOrder(OrderRequest dto, string userId);
}