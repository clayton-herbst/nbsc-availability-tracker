package service

import "github.com/cherbie/player-cms/internal/crud"

type (
	DatabaseService interface {
		GetPlayerModel() (*crud.PlayerModel, error)
	}

	databaseService struct {
		pool crud.ConnectionPool
	}

	mockDatabaseService struct {
		crud.Collection
	}
)

func NewDatabaseService(connectionPool crud.ConnectionPool) DatabaseService {
	return &databaseService{connectionPool}
}

func (ds *databaseService) GetPlayerModel() (*crud.PlayerModel, error) {
	connection, err := ds.pool.Get()
	if err != nil {
		return nil, err
	}

	collection := crud.NewCollection(connection.Database("player-cms").Collection("players"))
	model := crud.NewPlayerModel(collection)

	return model, nil
}

func NewDatabaseServiceMock(collection crud.Collection) DatabaseService {
	return &mockDatabaseService{collection}
}

func (mock *mockDatabaseService) GetPlayerModel() (*crud.PlayerModel, error) {
	return crud.NewPlayerModel(mock.Collection), nil
}
