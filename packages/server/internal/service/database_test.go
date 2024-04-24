package service_test

import (
	"testing"

	mocks "github.com/cherbie/player-cms/internal/__generated__/crud"
	"github.com/cherbie/player-cms/internal/crud"
	. "github.com/cherbie/player-cms/internal/service"

	"github.com/stretchr/testify/assert"
	"go.mongodb.org/mongo-driver/mongo/integration/mtest"
)

func TestDatabaseService_GetPlayerModel(t *testing.T) {
	mt := mtest.New(t, mtest.NewOptions().ClientType(mtest.Mock))
	mt.Run("test", func(mt *mtest.T) {
		mockPool := defaultMockConnectionPool(mt)
		service := NewDatabaseService(mockPool)

		model, err := service.GetPlayerModel()
		assert.Nil(t, err)
		assert.NotNil(t, model)
	})
}

func defaultMockConnectionPool(mt *mtest.T) *mocks.MockConnectionPool {
	mockPool := mocks.NewMockConnectionPool(mt)
	mockPool.On("Get").Return(crud.NewConnection(mt.Client), nil)
	return mockPool
}
