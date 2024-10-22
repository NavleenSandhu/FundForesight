package main

import (
	"fmt"
	"go-budget-app/internal/config"
	"go-budget-app/internal/db"
	"go-budget-app/internal/routing"
	"log"
	"net/http"
	"os"
)

func main() {
	cfg, err := config.LoadConfig(".env")
	if err != nil {
		log.Fatal(err)
	}
	
	DB, err := db.NewPostgresDB(cfg.DBConnString)
	if err != nil {
		log.Fatal(err)
	}
	
	router := routing.NewRouter(DB)
	router.Use(routing.LoggingMiddleware)
	PORT := os.Getenv("PORT")
	log.Printf("Starting server on port %v", PORT)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%v", PORT), router))
}
