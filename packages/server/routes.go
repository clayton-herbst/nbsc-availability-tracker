package main

import (
	"github.com/cherbie/player-cms/internal/config"
	"github.com/cherbie/player-cms/internal/controllers"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(engine *gin.Engine) {
	connectionPool := config.GetConnectionPoolSingleton()

	healthController := controllers.NewHealthController()
	playerController, err := controllers.NewPlayerController(connectionPool)
	if err != nil {
		panic(err)
	}

	engine.GET("/health", controllers.HandlerWrapper(healthController.GetHealth))
	engine.GET("/player", controllers.HandlerWrapper(playerController.GetPlayer))
}
