using Trucking.Domain;
using TruckingApp.Server.Data.Entities;

namespace TruckingApp.Server.Models.Orders;

public sealed record OrderResponse(
    int Id,
    string OrderNumber,
    string SenderCity,
    string SenderAddress,
    string ReceiverCity,
    string ReceiverAddress,
    decimal Weight,
    CargoType CargoType,
    decimal Price,
    DateOnly PickupDate,
    DateTime CreatedAt)
{
    public static OrderResponse FromOrder(Order order)
    {
        return FromOrder(order, 0.0m);
    }
    public static OrderResponse FromOrder(Order order, decimal price)
    {
        var pickupDate = DateOnly.FromDateTime(EnsureUtc(order.PickupDate));

        return new OrderResponse(
            order.ID,
            order.OrderNumber,
            order.SenderCity,
            order.SenderAddress,
            order.ReceiverCity,
            order.ReceiverAddress,
            order.Weight,
            order.CargoType,
            price,
            pickupDate,
            EnsureUtc(order.CreatedAt));
    }

    private static DateTime EnsureUtc(DateTime value)
    {
        return value.Kind == DateTimeKind.Unspecified
            ? DateTime.SpecifyKind(value, DateTimeKind.Utc)
            : value.ToUniversalTime();
    }
}
