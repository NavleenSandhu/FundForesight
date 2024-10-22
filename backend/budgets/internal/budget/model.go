package budget

type Budget struct{
	BudgetID             int     `json:"budget_id"`
    UserID         int     `json:"user_id"`
    CategoryName   string  `json:"category_name"`
    InitialAmount  float64 `json:"initial_amount"`
    RemainingAmount float64 `json:"remaining_amount"`
    StartDate      string  `json:"start_date"`
    EndDate        string  `json:"end_date"`
}