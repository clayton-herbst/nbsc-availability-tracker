package app

import (
	"fmt"

	"github.com/cherbie/player-cms/internal/config"
	"github.com/cherbie/player-cms/internal/crud"
	"github.com/cherbie/player-cms/internal/provider"
	"github.com/cherbie/player-cms/internal/service"
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
	resources.RegisterSingleton(AppEngineResourceId, defaultFactoryFunc(NewAppEngine()))

	setupRoutes(resources)
	return &appCore{resources}
}

func (app *appCore) Run() error {
	instance, err := app.resources.Resolve(AppEngineResourceId)
	if err != nil {
		return err
	}
	runServer(instance.(*AppEngine).Engine)
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
