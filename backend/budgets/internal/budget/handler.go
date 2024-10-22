package budget

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"fmt"
	"github.com/gorilla/mux"
)

type Handler struct {
	Repo *Repository
}

func handleError(w http.ResponseWriter, err error, statusCode int) {
	log.Println(err) // Log the error for server-side debugging
	http.Error(w, http.StatusText(statusCode), statusCode)
}

func NewHandler(repo *Repository) *Handler {
	return &Handler{Repo: repo}
}

func (handler *Handler) CreateBudget(w http.ResponseWriter, r *http.Request) {
	var budget Budget
	err := json.NewDecoder(r.Body).Decode(&budget)
	if err != nil {
		handleError(w, err, http.StatusBadRequest)
		return
	}
	err = handler.Repo.CreateBudget(&budget)
	if err != nil {
		handleError(w, err, http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
}

func (handler *Handler) GetBudgets(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	UserID, err := strconv.Atoi(q.Get("user_id"))
	if err != nil {
		handleError(w, err, http.StatusBadRequest)
		return
	}
	budgets, err := handler.Repo.GetAllBudgetsForAUser(UserID)
	if err != nil {
		handleError(w, err, http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(budgets)
}

func (handler *Handler) GetBudget(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	BudgetID, err := strconv.Atoi(vars["budget_id"])
	if err != nil {
		handleError(w, fmt.Errorf("invalid budget ID"), http.StatusBadRequest)
		return
	}
	budget, err := handler.Repo.GetBudgetByBudgetID(BudgetID)
	if err != nil {
		handleError(w, err, http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(budget)
}

func (handler *Handler) UpdateBudget(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	BudgetID, err := strconv.Atoi(vars["budget_id"])
	if err != nil {
		handleError(w, fmt.Errorf("invalid budget ID"), http.StatusBadRequest)
		return
	}
	var budget Budget
	err = json.NewDecoder(r.Body).Decode(&budget)
	budget.BudgetID = BudgetID
	if err != nil {
		handleError(w, err, http.StatusBadRequest)
		return
	}
	err = handler.Repo.UpdateBudget(&budget)
	if err != nil {
		handleError(w, err, http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (handler *Handler) DeleteBudget(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	BudgetID, err := strconv.Atoi(vars["budget_id"])
	if err != nil {
		handleError(w, fmt.Errorf("invalid budget ID"), http.StatusBadRequest)
		return
	}
	err = handler.Repo.DeleteBudget(BudgetID)
	if err != nil {
		handleError(w, err, http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
