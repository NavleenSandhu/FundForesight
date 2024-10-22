package budget

import (
	"database/sql"
	"fmt"
	"log"
)

type Repository struct {
	DB *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{DB: db}
}

func (repo *Repository) CreateBudget(budget *Budget) error {
	query := "INSERT INTO budgets (user_id, category_name, initial_amount, remaining_amount, start_date, end_date) VALUES($1, $2, $3, $4, $5, $6) RETURNING budget_id"
	err := repo.DB.QueryRow(query, budget.UserID, budget.CategoryName, budget.InitialAmount, budget.RemainingAmount, budget.StartDate, budget.EndDate).Scan(&budget.BudgetID)
	if err != nil {
		log.Println("Error inserting new budget:", err)
		return err
	}
	return nil
}

func (repo *Repository) GetAllBudgetsForAUser(UserID int) ([]Budget, error) {
	var budgets []Budget
	query := "SELECT * FROM budgets WHERE user_id=$1"
	rows, err := repo.DB.Query(query, UserID)
	if err != nil {
		log.Println(fmt.Sprintf("Error fetching budgets for user with user_id: %d", UserID), err)
		return nil, err
	}
	defer rows.Close()
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

func (repo *Repository) GetBudgetByBudgetID(BudgetID int) (*Budget, error) {
	var budget Budget
	query := "SELECT * FROM budgets WHERE budget_id=$1"
	err := repo.DB.QueryRow(query, BudgetID).Scan(&budget.BudgetID, &budget.UserID, &budget.CategoryName, &budget.InitialAmount, &budget.RemainingAmount, &budget.StartDate, &budget.EndDate)
	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("no budget found with ID %d", BudgetID)
	} else if err != nil {
		log.Println("Error fetching budget by ID:", err)
		return nil, err
	}
	return &budget, nil
}

func (repo *Repository) UpdateBudget(budget *Budget) error {
	query := "UPDATE budgets SET user_id = $1, category_name = $2, initial_amount = $3, remaining_amount = $4, start_date = $5, end_date = $6 WHERE budget_id = $7"
	_, err := repo.DB.Exec(query, &budget.UserID, &budget.CategoryName, &budget.InitialAmount, &budget.RemainingAmount, &budget.StartDate, &budget.EndDate, &budget.BudgetID)
	if err != nil {
		log.Println("Error updating budget:", err)
		return err
	}
	return nil
}

func (repo *Repository) DeleteBudget(BudgetID int) error {
	query := `DELETE FROM budgets WHERE budget_id = $1`
	_, err := repo.DB.Exec(query, BudgetID)
	if err != nil {
		log.Println("Error deleting budget:", err)
		return err
	}

	return nil
}
