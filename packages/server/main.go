package main

import (
	"github.com/cherbie/player-cms/internal/config"
)

func main() {
	config.LoadEnvFromFile("env/.env.local")
	engine := SetupServer()

	RunServer(engine)
}
