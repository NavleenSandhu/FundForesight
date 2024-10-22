package config

import (
	"github.com/joho/godotenv"
	"log"
	"os"
)

// Config holds the configuration values for the application.
type Config struct {
	DBConnString string // Database connection string
}

// LoadConfig loads configuration from the .env file and returns a Config struct.
func LoadConfig(envFile string) (*Config, error) {
	// Load the environment variables from the .env file
	err := godotenv.Load(envFile)
	if err != nil {
		log.Println("Error loading .env file:", err)
		return nil, err
	}

	// Get the database connection string from environment variables
	dbConnString := os.Getenv("DB_CONN_STRING")
	if dbConnString == "" {
		log.Println("DB_CONN_STRING is not set in .env file")
		return nil, err
	}

	// Return the loaded configuration
	return &Config{
		DBConnString: dbConnString,
	}, nil
}
