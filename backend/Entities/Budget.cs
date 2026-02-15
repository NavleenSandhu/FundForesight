namespace Entities
{
    public class Budget : BaseEntity
    {
        public int UserId { get; set; }
        public string CategoryName { get; set; } = "";
        public decimal InitialAmount { get; set; }
        public decimal RemainingAmount { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}