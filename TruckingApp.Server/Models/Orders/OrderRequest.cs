using System.ComponentModel.DataAnnotations;

namespace TruckingApp.Server.Models.Orders;

public sealed class OrderRequest : IValidatableObject
{
    [Required]
    [StringLength(100)]
    public string SenderCity { get; init; } = string.Empty;

    [Required]
    [StringLength(200)]
    public string SenderAddress { get; init; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string ReceiverCity { get; init; } = string.Empty;

    [Required]
    [StringLength(200)]
    public string ReceiverAddress { get; init; } = string.Empty;

    public decimal Weight { get; init; }

    public DateOnly PickupDate { get; init; }


    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (string.IsNullOrWhiteSpace(SenderCity))
        {
            yield return new ValidationResult("Укажите город отправления.", [nameof(SenderCity)]);
        }

        if (string.IsNullOrWhiteSpace(SenderAddress))
        {
            yield return new ValidationResult("Укажите адрес отправления.", [nameof(SenderAddress)]);
        }

        if (string.IsNullOrWhiteSpace(ReceiverCity))
        {
            yield return new ValidationResult("Укажите город назначения.", [nameof(ReceiverCity)]);
        }

        if (string.IsNullOrWhiteSpace(ReceiverAddress))
        {
            yield return new ValidationResult("Укажите адрес назначения.", [nameof(ReceiverAddress)]);
        }

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        if (PickupDate < today)
        {
            yield return new ValidationResult("Дата забора не может быть в прошлом.",[nameof(PickupDate)]);
        }

        // Keep decimal validation here instead of RangeAttribute to avoid culture-specific parsing.
        if (Weight <= 0)
        {
            yield return new ValidationResult("Вес должен быть больше нуля.", [nameof(Weight)]);
        }
    }
}
