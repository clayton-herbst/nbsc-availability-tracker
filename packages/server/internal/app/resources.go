package app

import (
	"github.com/cherbie/player-cms/internal/config"
	"github.com/cherbie/player-cms/internal/crud"
	"github.com/cherbie/player-cms/internal/service"
)

var (
	PlayerServiceResourceId         = "playerService"
	MongoDatabaseServiceResourceId  = "mongoDatabaseService"
	AppEngineResourceId             = "appEngine"
	ConnectionPoolResourceId        = "connectionPool"
	DatabaseConfigServiceResourceId = "databaseConfigService"
)

func newPlayerServiceSingleton(dbService service.MongoDatabaseService) service.PlayerService {
	service, err := service.NewPlayerService(dbService)
	if err != nil {
		panic(err)
	}

	return service
}

func newConnectionPoolSingleton() crud.ConnectionPool {
	pool := crud.NewInMemoryPool()
	if err := pool.Connect(crud.ConnectionOpts{Uri: config.GetMongoDbUri()}); err != nil {
		panic(err)
	}
	return pool
}
