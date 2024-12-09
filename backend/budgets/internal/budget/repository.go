package budget

import (
	"database/sql"
	"fmt"
	"log"
)

type Repository struct {
	DB *sql.DB // The database connection
}

// NewRepository initializes a new Repository with the given database connection
func NewRepository(db *sql.DB) *Repository {
	return &Repository{DB: db}
}

// CreateBudget inserts a new budget into the database
func (repo *Repository) CreateBudget(budget *Budget) error {
	query := "INSERT INTO budgets (user_id, category_name, initial_amount, remaining_amount, start_date, end_date) VALUES($1, $2, $3, $4, $5, $6) RETURNING budget_id"
	// Insert the budget into the database and scan the returned budget_id
	err := repo.DB.QueryRow(query, budget.UserID, budget.CategoryName, budget.InitialAmount, budget.RemainingAmount, budget.StartDate, budget.EndDate).Scan(&budget.BudgetID)
	if err != nil {
		log.Println("Error inserting new budget:", err)
		return err
	}
	return nil
}

// GetAllBudgets retrieves all budgets within a date range for cron job
func (repo *Repository) GetBudgetsBetweenDates(startDate, endDate string) ([]Budget, error) {
	var budgets []Budget
	query := "SELECT * FROM budgets WHERE start_date >= $1 AND end_date <= $2"
	// Execute the query to retrieve all budgets within the date range
	rows, err := repo.DB.Query(query, startDate, endDate)
	if err != nil {
		log.Println(fmt.Sprintf("Error fetching budgets between dates %s and %s", startDate, endDate), err)
		return nil, err
	}
	defer rows.Close()
	// Iterate over the rows and append each budget to the list
	for rows.Next() {
		var budget Budget
		if err := rows.Scan(&budget.BudgetID, &budget.UserID, &budget.CategoryName, &budget.InitialAmount, &budget.RemainingAmount, &budget.StartDate, &budget.EndDate); err != nil {
			log.Println("Error scanning budget row:", err)
			return nil, err
		}
		budgets = append(budgets, budget)
	}
	return budgets, nil
}

// GetAllBudgetsForAUser retrieves all budgets for a specific user within a date range
func (repo *Repository) GetBudgetsForUserBetweenDates(UserID int, startDate, endDate string) ([]Budget, error) {
	var budgets []Budget
	query := "SELECT * FROM budgets WHERE user_id=$1 AND start_date >= $2 AND end_date <= $3"
	// Execute the query to retrieve all budgets for the user within the date range
	rows, err := repo.DB.Query(query, UserID, startDate, endDate)
	if err != nil {
		log.Println(fmt.Sprintf("Error fetching budgets for user with user_id: %d between dates %s and %s", UserID, startDate, endDate), err)
		return nil, err
	}
	defer rows.Close()
	// Iterate over the rows and append each budget to the list
	for rows.Next() {
		var budget Budget
		if err := rows.Scan(&budget.BudgetID, &budget.UserID, &budget.CategoryName, &budget.InitialAmount, &budget.RemainingAmount, &budget.StartDate, &budget.EndDate); err != nil {
			log.Println("Error scanning budget row:", err)
			return nil, err
		}
		budgets = append(budgets, budget)
	}
	return budgets, nil
}

// GetBudgetByBudgetID retrieves a single budget by its budget_id
func (repo *Repository) GetBudgetByBudgetID(BudgetID int) (*Budget, error) {
	var budget Budget
	query := "SELECT * FROM budgets WHERE budget_id=$1"
	// Execute the query and scan the result into a Budget struct
	err := repo.DB.QueryRow(query, BudgetID).Scan(&budget.BudgetID, &budget.UserID, &budget.CategoryName, &budget.InitialAmount, &budget.RemainingAmount, &budget.StartDate, &budget.EndDate)
	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("no budget found with ID %d", BudgetID) // Return an error if no budget is found
	} else if err != nil {
		log.Println("Error fetching budget by ID:", err)
		return nil, err
	}
	return &budget, nil
}

// UpdateBudget updates an existing budget in the database
func (repo *Repository) UpdateBudget(budget *Budget) error {
	query := "UPDATE budgets SET category_name = $1, initial_amount = $2, remaining_amount = $3, start_date = $4, end_date = $5 WHERE budget_id = $6 AND user_id = $7"
	// Execute the update query
	_, err := repo.DB.Exec(query, budget.CategoryName, budget.InitialAmount, budget.RemainingAmount, budget.StartDate, budget.EndDate, budget.BudgetID, budget.UserID)
	if err != nil {
		log.Println("Error updating budget:", err)
		return err
	}
	return nil
}

// DeleteBudget deletes a budget by its budget_id
func (repo *Repository) DeleteBudget(BudgetID int, UserID int) error {
	query := "DELETE FROM budgets WHERE budget_id=$1 AND user_id=$2"
	// Execute the delete query
	_, err := repo.DB.Exec(query, BudgetID, UserID)
	if err != nil {
		log.Println("Error deleting budget:", err)
		return err
	}
	return nil
}
