package db

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
)

func NewPostgresDB(connectionString string) (*sql.DB, error){
	db, err := sql.Open("postgres", connectionString)
	if err != nil {
		return nil, err
	}
	if err := db.Ping(); err != nil {
		return nil, err
	}
	log.Println("Connected to DB")
	return db, nil
}