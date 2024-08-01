package service

import "github.com/cherbie/player-cms/internal/config"

type (
	DatabaseConfigService interface {
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
