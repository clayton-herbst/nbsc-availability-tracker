package config

import (
	"sync"

	"github.com/cherbie/player-cms/internal/crud"
)

var (
	lock                    = &sync.Mutex{}
	connectionPoolSingleton *crud.InMemoryPool
)

func GetConnectionPoolSingleton() crud.ConnectionPool {
	if connectionPoolSingleton == nil {
		lock.Lock()
		if connectionPoolSingleton == nil {
			connectionPoolSingleton = crud.NewInMemoryPool().(*crud.InMemoryPool)

			// remove from singleton
			if err := connectionPoolSingleton.Connect(crud.ConnectionOpts{Uri: GetMongoDbUri()}); err != nil {
				panic(err)
			}
		}
		lock.Unlock()
	}

	return connectionPoolSingleton
}
