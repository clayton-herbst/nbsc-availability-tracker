package service

import (
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/cherbie/player-cms/internal/crud"
	"go.mongodb.org/mongo-driver/mongo/integration/mtest"
)

func TestDatabaseService_GetPlayerModel(t *testing.T) {
	mt := mtest.New(t, mtest.NewOptions().ClientType(mtest.Mock))
	mt.Run("test", func(mt *mtest.T) {
		mockPool := crud.NewConnectionPoolMock(crud.NewConnection(mt.Client))
		service := NewDatabaseService(mockPool)

		model, err := service.GetPlayerModel()
		assert.Nil(t, err)
		assert.NotNil(t, model)
	})
}
