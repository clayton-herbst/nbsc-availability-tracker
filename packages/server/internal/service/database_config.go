package service

import (
	"github.com/cherbie/player-cms/internal/config"
	"github.com/cherbie/player-cms/internal/provider"
)

type (
	DatabaseConfigService interface {
		provider.Disposable
		MongoURI() string
	}

	databaseConfigService struct{}
)

func NewDatabaseConfigService() DatabaseConfigService {
	return &databaseConfigService{}
}

func (c *databaseConfigService) MongoURI() string {
	return config.GetMongoDbUri()
}

func (c *databaseConfigService) Close() error {
	return nil
}
