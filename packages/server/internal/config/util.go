package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

func LoadEnvFromFile(file string) {
	godotenv.Load(file)
}

func getEnvOrDefault(name, otherwise string) string {
	envVar := os.Getenv(name)
	if len(envVar) == 0 {
		return otherwise
	}
	return envVar
}

func getEnv(name string) string {
	envVar := os.Getenv(name)
	if len(envVar) == 0 {
		panic(fmt.Sprintf("empty environment variable %s", name))
	}
	return envVar
}
