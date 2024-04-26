package app

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os/signal"
	"syscall"
	"time"

	"github.com/cherbie/player-cms/internal/config"
	"github.com/cherbie/player-cms/internal/provider"
	"github.com/cherbie/player-cms/internal/service"
	"github.com/gin-gonic/gin"
)

type App interface {
	Run() error
}

type appCore struct {
	resources *provider.ResourceManager
}

func NewApp() App {
	resources := provider.NewResourceManager()

	resources.RegisterSingleton(DatabaseConfigServiceResourceId, service.NewDatabaseConfigService())
	dbService, err := service.NewMongoDatabaseService(resources.Resolve(DatabaseConfigServiceResourceId).(service.DatabaseConfigService),
		newConnectionPoolSingleton)
	if err != nil {
		panic(err)
	}
	resources.RegisterSingleton(MongoDatabaseServiceResourceId, dbService)
	resources.RegisterSingleton(PlayerServiceResourceId,
		newPlayerServiceSingleton(resources.Resolve(MongoDatabaseServiceResourceId).(service.MongoDatabaseService)))
	resources.RegisterSingleton(AppEngineResourceId, gin.Default())

	setupRoutes(resources)
	return &appCore{resources}
}

func (app *appCore) Run() error {
	engine := app.resources.Resolve(AppEngineResourceId).(*gin.Engine)
	runServer(engine)
	return nil
}

func runServer(engine *gin.Engine) error {
	// Create context that listens for the interrupt signal from the OS.
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	srv := http.Server{
		Addr:    serverConnectionString(),
		Handler: engine,
	}

	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s\n", err)
		}
	}()

	// Listen for the interrupt signal.
	<-ctx.Done()

	// Restore default behavior on the interrupt signal and notify user of shutdown.
	stop()
	log.Println("shutting down gracefully, press Ctrl+C again to force")

	// The context is used to inform the server it has 5 seconds to finish
	// the request it is currently handling
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server forced to shutdown: ", err)
	}

	log.Println("Server exiting")
	return nil
}

func serverConnectionString() string {
	port := config.GetServerPort()
	return fmt.Sprint(":", port)
}
