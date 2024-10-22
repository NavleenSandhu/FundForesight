package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DBConnString string
}

func LoadConfig(filename string) (*Config, error) {
	err := godotenv.Load(filename)
	if err != nil {
		return nil, err
	}
	return &Config{DBConnString: os.Getenv("DB_CONN_STRING")}, nil
}
