namespace Entities
{
    public class SavingGoal : BaseEntity
    {
        public int UserId { get; set; }
        public string GoalName { get; set; } = "";
        public decimal TargetAmount { get; set; }
        public decimal CurrentAmount { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public SavingGoalStatus Status { get; set; }
    }
    public enum SavingGoalStatus
    {
        Active,
        Completed,
        Cancelled
    }
}