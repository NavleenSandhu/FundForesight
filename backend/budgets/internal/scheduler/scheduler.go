package scheduler

import (
	"database/sql"
	"fmt"
	"go-budget-app/internal/budget"
	"time"

	"github.com/robfig/cron/v3"
)

var cronScheduler *cron.Cron

func GetFirstAndLastDateOfLastMonth() (time.Time, time.Time) {
	now := time.Now()

	// Start of the current month
	startOfCurrentMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())

	// End of the last month
	endOfLastMonth := startOfCurrentMonth.Add(-time.Second)

	// Start of the last month
	startOfLastMonth := time.Date(endOfLastMonth.Year(), endOfLastMonth.Month(), 1, 0, 0, 0, 0, endOfLastMonth.Location())

	return startOfLastMonth, endOfLastMonth
}

// InitializeCron initializes the cron scheduler and adds tasks
func InitializeCron(DB *sql.DB) *cron.Cron {
	repo := budget.NewRepository(DB)
	if cronScheduler == nil {
		cronScheduler = cron.New()
		// Task: Get the budgets of all user of the previous month and create same for the current month
		cronScheduler.AddFunc("0 0 1 * *", func() {
			startDate, endDate := GetFirstAndLastDateOfLastMonth()

			// Fetch budgets of the last month
			budgets, _ := repo.GetBudgetsBetweenDates(startDate.Format("2006-01-02"), endDate.Format("2006-01-02"))

			// Calculate start and end dates for the current month
			currentMonthStart := time.Date(time.Now().Year(), time.Now().Month(), 1, 0, 0, 0, 0, time.Now().Location())
			currentMonthEnd := currentMonthStart.AddDate(0, 1, -1)

			// Update budgets for the current month
			for _, budget := range budgets {
				budget.RemainingAmount = budget.InitialAmount
				budget.StartDate = currentMonthStart.Format("2006-01-02")
				budget.EndDate = currentMonthEnd.Format("2006-01-02")

				// Save the updated budget
				repo.CreateBudget(&budget)
			}
		})
	}
	return cronScheduler
}

// StartCron starts the cron scheduler
func StartCron() {
	if cronScheduler != nil {
		cronScheduler.Start()
		fmt.Println("Cron scheduler started...")
	}
}

// StopCron stops the cron scheduler
func StopCron() {
	if cronScheduler != nil {
		cronScheduler.Stop()
		fmt.Println("Cron scheduler stopped...")
	}
}
