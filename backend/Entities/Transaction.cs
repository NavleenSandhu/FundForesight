namespace Entities
{
    public class Transaction : BaseEntity
    {
        public int BudgetId { get; set; }
        public int UserId { get; set; }
        public decimal Amount { get; set; }
        public string MerchantName { get; set; } = "";
        public DateTime TransactionDate { get; set; }
        public TransactionType TransactionType { get; set; }
    }
    public enum TransactionType
    {
        Expense,
        Income
    }
}