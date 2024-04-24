package main

import (
	"github.com/cherbie/player-cms/internal/config"
	"github.com/cherbie/player-cms/internal/controllers"
	"github.com/cherbie/player-cms/internal/crud"
	"github.com/cherbie/player-cms/internal/service"
	"github.com/gin-gonic/gin"
)

func setupRoutes(engine *gin.Engine) {
	playerService := newPlayerServiceSingleton()

	healthController := controllers.NewHealthController()
	playerController := controllers.NewPlayerController(playerService)

	engine.GET("/health", controllers.HandlerWrapper(healthController.GetHealth))
	engine.GET("/player", controllers.HandlerWrapper(playerController.GetPlayer))
}

func newPlayerServiceSingleton() service.PlayerService {
	connectionPool := config.GetConnectionPoolSingleton()
	connection, err := connectionPool.Get()
	if err != nil {
		panic(err)
	}

	collection := crud.NewCollection(connection.Database("player-cms").Collection("players"))
	return service.NewPlayerService(collection)
}
