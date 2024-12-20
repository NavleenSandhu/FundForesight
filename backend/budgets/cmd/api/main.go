package main

import (
	"fmt"
	"go-budget-app/internal/config"
	"go-budget-app/internal/db"
	"go-budget-app/internal/routing"
	"go-budget-app/internal/scheduler"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
)

func main() {
	// Load the configuration from the .env file
	cfg, err := config.LoadConfig(".env")
	if err != nil {
		log.Fatal(err) // Log an error and stop the program if the config fails to load
	}

	// Initialize a new database connection
	DB, err := db.NewPostgresDB(cfg.DBConnString)

	// Create a new router with the database connection
	router := routing.NewRouter(DB)

	// Use logging middleware to log HTTP requests
	router.Use(routing.LoggingMiddleware)

	// Get the port number from the environment variables
	PORT := os.Getenv("PORT")

	// Initialize the cron scheduler
	scheduler.InitializeCron(DB)
	scheduler.StartCron()

	// Start the server and listen on the specified port
	log.Printf("Starting server on port %v", PORT)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%v", PORT), router))

	// Wait for termination signal to gracefully stop the application
	sig := make(chan os.Signal, 1)
	signal.Notify(sig, os.Interrupt, syscall.SIGTERM)
	<-sig

	fmt.Println("\nShutting down...")

	// Stop the cron scheduler
	scheduler.StopCron()
}
