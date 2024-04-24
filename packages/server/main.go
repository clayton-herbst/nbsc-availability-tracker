package main

import (
	"github.com/cherbie/player-cms/internal/app"
	"github.com/cherbie/player-cms/internal/config"
)

func main() {
	config.LoadEnvFromFile("env/.env.local")

	appInstance := app.NewApp()
	err := appInstance.Run()
	if err != nil {
		panic(err)
	}
}
