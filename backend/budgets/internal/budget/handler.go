package budget

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/lib/pq"
)

type Handler struct {
	Repo *Repository // The repository that handles database operations
}

// NewHandler creates a new Handler instance with the given repository
func NewHandler(repo *Repository) *Handler {
	return &Handler{Repo: repo}
}

// CreateBudget handles creating a new budget
func (handler *Handler) CreateBudget(w http.ResponseWriter, r *http.Request) {
	var budget Budget
	// Decode the JSON request body into a Budget struct
	err := json.NewDecoder(r.Body).Decode(&budget)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest) // Return 400 if JSON is invalid
		return
	}
	// Call the repository to save the new budget to the database
	err = handler.Repo.CreateBudget(&budget)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError) // Return 500 on internal error
		return
	}
	// Set response header and return status 201 for successful creation
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(budget)
}

// GetBudgets retrieves all budgets for a specific user
func (handler *Handler) GetBudgets(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	// Get the user_id query parameter and convert it to an integer
	UserID, err := strconv.Atoi(q.Get("user_id"))
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest) // Return 400 for invalid user_id
		return
	}
	// Fetch budgets from the repository for the specified user
	budgets, err := handler.Repo.GetAllBudgetsForAUser(UserID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError) // Return 500 on internal error
		return
	}
	// Respond with the budgets in JSON format
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(budgets)
}

// GetBudget retrieves a single budget by budget_id
func (handler *Handler) GetBudget(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	// Get the budget_id from the URL and convert it to an integer
	BudgetID, err := strconv.Atoi(vars["budget_id"])
	if err != nil {
		http.Error(w, "Invalid budget ID", http.StatusBadRequest) // Return 400 for invalid budget_id
		return
	}
	// Fetch the budget from the repository
	budget, err := handler.Repo.GetBudgetByBudgetID(BudgetID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError) // Return 500 on internal error
		return
	}
	// Respond with the budget in JSON format
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(budget)
}

// UpdateBudget handles updating an existing budget
func (handler *Handler) UpdateBudget(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	// Get the budget_id from the URL and convert it to an integer
	BudgetID, err := strconv.Atoi(vars["budget_id"])
	if err != nil {
		http.Error(w, "Invalid budget ID", http.StatusBadRequest) // Return 400 for invalid budget_id
		return
	}
	// Decode the request body into a Budget struct
	var budget Budget
	err = json.NewDecoder(r.Body).Decode(&budget)
	budget.BudgetID = BudgetID
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest) // Return 400 for invalid JSON
		return
	}
	// Call the repository to update the budget in the database
	err = handler.Repo.UpdateBudget(&budget)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError) // Return 500 on internal error
		return
	}
	// Respond with status 204 for successful update
	w.WriteHeader(http.StatusNoContent)
}

// DeleteBudget handles deleting a budget by budget_id
func (handler *Handler) DeleteBudget(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	q := r.URL.Query()
	// Get the budget_id from the URL and convert it to an integer
	BudgetID, err := strconv.Atoi(vars["budget_id"])
	UserID, err2 := strconv.Atoi(q.Get("user_id"))
	if err != nil {
		http.Error(w, "Invalid budget ID", http.StatusBadRequest) // Return 400 for invalid budget_id
		return
	}
	if err2 != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest) // Return 400 for invalid budget_id
		return
	}
	// Call the repository to delete the budget from the database
	err = handler.Repo.DeleteBudget(BudgetID, UserID)
	if err != nil {
		// Check if the error is of type *pq.Error
		if pqErr, ok := err.(*pq.Error); ok {
			switch pqErr.Code {
			case "23503": // foreign_key_violation
				http.Error(w, err.Error(), http.StatusConflict)
				// Handle the foreign key violation case
			}
		} else {
			http.Error(w, err.Error(), http.StatusInternalServerError) // Return 500 on internal error
		}
		return
	}
	// Respond with status 204 for successful deletion
	w.WriteHeader(http.StatusNoContent)
}
