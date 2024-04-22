package main

import (
	"sync"

	"github.com/cherbie/player-cms/internal/config"
	"github.com/cherbie/player-cms/internal/crud"
)

func main() {
	config.LoadEnvFromFile("env/.env.local")
	engine := SetupServer()

	RunServer(engine)
}

var (
	lock                    = &sync.Mutex{}
	connectionPoolSingleton *crud.InMemoryPool
)

func getConnectionPoolSingleton() crud.ConnectionPool {
	if connectionPoolSingleton == nil {
		lock.Lock()
		if connectionPoolSingleton == nil {
			connectionPoolSingleton = crud.NewConnectionPool().(*crud.InMemoryPool)
			connectionPoolSingleton.Connect(crud.ConnectionOpts{Uri: config.GetMongoDbUri()})
		}
		lock.Unlock()
	}

	return connectionPoolSingleton
}
