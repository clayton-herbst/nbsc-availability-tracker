package main

import (
	"github.com/cherbie/player-cms/internal/config"
	"github.com/cherbie/player-cms/internal/controllers"
	"github.com/cherbie/player-cms/internal/service"
	"github.com/gin-gonic/gin"
)

func setupRoutes(engine *gin.Engine) {
	databaseService := newDatabaseServiceSingleton()
	playerService := newPlayerServiceSingleton(databaseService)

	healthController := controllers.NewHealthController()
	playerController := controllers.NewPlayerController(playerService)

	engine.GET("/health", controllers.HandlerWrapper(healthController.GetHealth))
	engine.GET("/player", controllers.HandlerWrapper(playerController.GetPlayer))
}

func newPlayerServiceSingleton(dbService service.DatabaseService) service.PlayerService {
	service, err := service.NewPlayerService(dbService)
	if err != nil {
		panic(err)
	}

	return service
}

func newDatabaseServiceSingleton() service.DatabaseService {
	connectionPool := config.GetConnectionPoolSingleton()
	return service.NewDatabaseService(connectionPool)
}
