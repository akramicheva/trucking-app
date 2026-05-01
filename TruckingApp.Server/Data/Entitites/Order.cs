using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TruckingApp.Server.Data.Entities
{
    public class Order
    {
        private string? orderNumber;
        private DateTime pickupDate;
        
        [Key]
        public int ID { get; set; }

  
        [MaxLength(20)]
        public  string OrderNumber 
        { 
            get => orderNumber ?? string.Empty;

            set
            {
                if (string.IsNullOrEmpty(orderNumber))
                {
                    string datePart = DateTime.UtcNow.ToString("yyyyMMdd");
                    string randomPart = Guid.NewGuid().ToString("N").Substring(0, 5).ToUpper();
                    orderNumber = $"ORD-{datePart}-{randomPart}";
                }
            }
        }
        
        [Required]
        public required string SenderCity { get; set;}
        
        [Required]
        public required string SenderAddress { get; set;}

        [Required]
        public required string ReceiverCity { get; set;}
        
        [Required]
        public required string ReceiverAddress { get; set;}
  
        [Column(TypeName = "decimal(18,2)")]
        public decimal Weight { get; set; }

        [Required]
        public DateTime PickupDate
        {
            get => pickupDate;
            set => pickupDate = value.Kind == DateTimeKind.Unspecified 
                ? DateTime.SpecifyKind(value, DateTimeKind.Utc) 
                : value.ToUniversalTime();
        }
        public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
        public string? CreatedBy { get; set; }
    }
}
