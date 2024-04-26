package service

import (
	"github.com/cherbie/player-cms/internal/crud"
)

type (
	MongoDatabaseService interface {
		GetPlayerModel() (*crud.PlayerModel, error)
	}

	mongoDatabaseService struct {
		pool crud.ConnectionPool
	}
)

func NewMongoDatabaseService(dbConfigService DatabaseConfigService, connectionPoolFactory func() crud.ConnectionPool) (MongoDatabaseService, error) {
	pool := connectionPoolFactory()
	err := pool.Connect(crud.ConnectionOpts{Uri: dbConfigService.MongoURI()})
	if err != nil {
		return nil, err
	}
	return &mongoDatabaseService{pool}, nil
}

func (s *mongoDatabaseService) GetPlayerModel() (*crud.PlayerModel, error) {
	connection, err := s.pool.Get()
	if err != nil {
		return nil, err
	}

	collection := crud.NewCollection(connection.Database("player-cms").Collection("players"))
	model := crud.NewPlayerModel(collection)

	return model, nil
}
