using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TruckingApp.Server.Data.Entities
{
    public class Order
    {
        private Order()
        {
        }

        [Key]
        public int ID { get; private set; }

        [Required]
        [MaxLength(20)]
        public string OrderNumber { get; private set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string SenderCity { get; private set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string SenderAddress { get; private set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string ReceiverCity { get; private set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string ReceiverAddress { get; private set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal Weight { get; private set; }

        [Required]
        public DateTime PickupDate { get; private set; }

        public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;

        [Required]
        [MaxLength(450)]
        public string CreatedBy { get; private set; } = string.Empty;

        public static Order Create(
            string senderCity,
            string senderAddress,
            string receiverCity,
            string receiverAddress,
            decimal weight,
            DateOnly pickupDate,
            string createdBy)
        {
            if (weight <= 0)
            {
                throw new ArgumentOutOfRangeException(nameof(weight), "Weight must be greater than zero.");
            }

            return new Order
            {
                OrderNumber = GenerateOrderNumber(),
                SenderCity = NormalizeRequired(senderCity, nameof(senderCity)),
                SenderAddress = NormalizeRequired(senderAddress, nameof(senderAddress)),
                ReceiverCity = NormalizeRequired(receiverCity, nameof(receiverCity)),
                ReceiverAddress = NormalizeRequired(receiverAddress, nameof(receiverAddress)),
                Weight = weight,
                PickupDate = pickupDate.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc),
                CreatedAt = DateTime.UtcNow,
                CreatedBy = NormalizeRequired(createdBy, nameof(createdBy))
            };
        }

        private static string GenerateOrderNumber()
        {
            string datePart = DateTime.UtcNow.ToString("yyyyMMdd");
            string randomPart = Guid.NewGuid().ToString("N")[..7].ToUpperInvariant();

            return $"ORD-{datePart}-{randomPart}";
        }

        private static string NormalizeRequired(string value, string parameterName)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                throw new ArgumentException("Value cannot be empty.", parameterName);
            }

            return value.Trim();
        }
    }
}
