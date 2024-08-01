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
	"github.com/cherbie/player-cms/internal/crud"
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

	resources.RegisterSingleton(DatabaseConfigServiceResourceId, defaultFactoryFunc(service.NewDatabaseConfigService()))
	resources.RegisterSingleton(MongoDatabaseServiceResourceId, newMongoDatabaseServiceFactoryFunc())
	resources.RegisterSingleton(PlayerServiceResourceId, newPlayerServiceFactoryFunc())
	resources.RegisterSingleton(AppEngineResourceId, defaultFactoryFunc(gin.Default()))

	setupRoutes(resources)
	return &appCore{resources}
}

func (app *appCore) Run() error {
	instance, err := app.resources.Resolve(AppEngineResourceId)
	if err != nil {
		return err
	}
	runServer(instance.(*gin.Engine))
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

// TODO: use config service injected instead
func serverConnectionString() string {
	port := config.GetServerPort()
	return fmt.Sprint(":", port)
}

func newPlayerServiceFactoryFunc() provider.ProviderFactoryFunc {
	factoryFunc := func(resources *provider.ResourceManager) (instance provider.Disposable, err error) {
		mongoDbService, err := resources.Resolve(MongoDatabaseServiceResourceId)
		if err == nil {
			service, serviceErr := service.NewPlayerService(mongoDbService.(service.MongoDatabaseService))
			instance = service.(provider.Disposable)
			err = serviceErr
		}

		return
	}
	return factoryFunc
}

func newMongoDatabaseServiceFactoryFunc() provider.ProviderFactoryFunc {
	factoryFunc := func(resources *provider.ResourceManager) (instance provider.Disposable, err error) {
		configService, err := resources.Resolve(DatabaseConfigServiceResourceId)
		if err == nil {
			service, serviceErr := service.NewMongoDatabaseService(configService.(service.DatabaseConfigService), connectionPoolFactory)
			instance = service.(provider.Disposable) // TODO: check correctness of explicit cast here. Used to silence compilation error but could be masking greater issue
			err = serviceErr
		}

		return
	}
	return factoryFunc
}

func connectionPoolFactory() crud.ConnectionPool {
	pool := crud.NewInMemoryPool()
	if err := pool.Connect(crud.ConnectionOpts{Uri: config.GetMongoDbUri()}); err != nil {
		panic(err)
	}
	return pool
}

func defaultFactoryFunc(instance any) provider.ProviderFactoryFunc {
	return func(resources *provider.ResourceManager) (provider.Disposable, error) {
		return instance.(provider.Disposable), nil
	}
}
