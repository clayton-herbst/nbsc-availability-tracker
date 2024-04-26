package app

import (
	"github.com/cherbie/player-cms/internal/controllers"
	"github.com/cherbie/player-cms/internal/provider"
	"github.com/cherbie/player-cms/internal/service"
	"github.com/gin-gonic/gin"
)

func setupRoutes(resources *provider.ResourceManager) {
	engine := unwrapErr(func() (any, error) { return resources.Resolve(AppEngineResourceId) }).(*gin.Engine)
	playerService := unwrapErr(func() (any, error) { return resources.Resolve(PlayerServiceResourceId) }).(service.PlayerService)

	healthController := controllers.NewHealthController()
	playerController := controllers.NewPlayerController(playerService)

	engine.GET("/health", controllers.HandlerWrapper(healthController.GetHealth))
	engine.GET("/player", controllers.HandlerWrapper(playerController.GetPlayer))
}

func unwrapErr(factory func() (any, error)) any {
	instance, err := factory()
	if err != nil {
		panic(err)
	}
	return instance
}
