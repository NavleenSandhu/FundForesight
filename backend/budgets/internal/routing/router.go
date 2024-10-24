package routing

import (
	"database/sql"
	"go-budget-app/internal/budget"

	"github.com/gorilla/mux"
)

func NewRouter(db *sql.DB) *mux.Router {
	router := mux.NewRouter()
	budgetHandler := budget.NewHandler(budget.NewRepository(db))
	router.HandleFunc("/budgets", budgetHandler.CreateBudget).Methods("POST")
	router.HandleFunc("/budgets/{budget_id:[0-9]+}", budgetHandler.GetBudget).Methods("GET")
	router.HandleFunc("/budgets", budgetHandler.GetBudgets).Methods("GET")
	router.HandleFunc("/budgets/{budget_id:[0-9]+}", budgetHandler.UpdateBudget).Methods("PUT")
	router.HandleFunc("/budgets/{budget_id:[0-9]+}", budgetHandler.DeleteBudget).Methods("DELETE")
	return router
}
