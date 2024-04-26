package service_test

import (
	"testing"

	crud_mocks "github.com/cherbie/player-cms/internal/__generated__/crud"
	service_mocks "github.com/cherbie/player-cms/internal/__generated__/service"
	"github.com/cherbie/player-cms/internal/crud"
	. "github.com/cherbie/player-cms/internal/service"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"go.mongodb.org/mongo-driver/mongo/integration/mtest"
)

func TestDatabaseService_GetPlayerModel(t *testing.T) {
	mt := mtest.New(t, mtest.NewOptions().ClientType(mtest.Mock))
	mt.Run("test", func(mt *mtest.T) {
		service, err := NewMongoDatabaseService(defaultMockDbConfigService(mt.T), func() crud.ConnectionPool { return defaultMockConnectionPool(mt) })
		assert.Nil(mt, err)

		model, err := service.GetPlayerModel()

		assert.Nil(mt, err)
		assert.NotNil(mt, model)
	})
}

func defaultMockConnectionPool(mt *mtest.T) *crud_mocks.MockConnectionPool {
	mockPool := crud_mocks.NewMockConnectionPool(mt)
	mockPool.On("Get").Return(crud.NewConnection(mt.Client), nil)
	mockPool.On("Connect", mock.Anything).Return(nil)
	return mockPool
}

func defaultMockDbConfigService(t *testing.T) *service_mocks.MockDatabaseConfigService {
	mockConfig := service_mocks.NewMockDatabaseConfigService(t)
	mockConfig.On("MongoURI").Return("mongodb://deadbeef:27017")
	return mockConfig
}
