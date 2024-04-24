package service

import (
	"testing"

	"github.com/cherbie/player-cms/internal/crud"
	"github.com/stretchr/testify/assert"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/integration/mtest"
)

func TestPlayersFindByEmail(t *testing.T) {
	mt := mtest.New(t, mtest.NewOptions().ClientType(mtest.Mock))
	mt.Run("test", func(mt *mtest.T) {
		dbService := NewDatabaseServiceMock(crud.NewCollection(mt.Coll))
		service, err := NewPlayerService(dbService)
		assert.Nil(t, err)

		successResp := createSuccessCursorResponse()
		mt.AddMockResponses(successResp)

		player, err := service.FindByEmail("test@email.com")
		assert.Nil(t, err)
		assert.NotNil(t, player)
	})
}

func TestPlayersFindByEmail_Err(t *testing.T) {
	mt := mtest.New(t, mtest.NewOptions().ClientType(mtest.Mock))
	mt.Run("test", func(mt *mtest.T) {
		dbService := NewDatabaseServiceMock(crud.NewCollection(mt.Coll))
		service, err := NewPlayerService(dbService)
		assert.Nil(t, err)

		errorResponse := mtest.CreateCommandErrorResponse(mockCommandError)
		mt.AddMockResponses(errorResponse)

		_, err = service.FindByEmail("test@email.com")
		assert.NotNil(t, err)
	})
}

func TestPlayersCreate(t *testing.T) {
	mt := mtest.New(t, mtest.NewOptions().ClientType(mtest.Mock))
	mt.Run("test", func(mt *mtest.T) {
		dbService := NewDatabaseServiceMock(crud.NewCollection(mt.Coll))
		service, err := NewPlayerService(dbService)
		assert.Nil(t, err)

		okResponse := mtest.CreateSuccessResponse()
		mt.AddMockResponses(okResponse)

		err = service.Create(&Player{FirstName: "Mike", LastName: "Tyson", Email: "mike.tyson@gmail.com"})
		assert.Nil(t, err)
	})
}

func TestPlayersCreate_Err(t *testing.T) {
	mt := mtest.New(t, mtest.NewOptions().ClientType(mtest.Mock))
	mt.Run("test", func(mt *mtest.T) {
		dbService := NewDatabaseServiceMock(crud.NewCollection(mt.Coll))
		service, err := NewPlayerService(dbService)
		assert.Nil(t, err)

		errorResponse := mtest.CreateWriteErrorsResponse(mockWriteError)
		mt.AddMockResponses(errorResponse)

		err = service.Create(&Player{FirstName: "Mike", LastName: "Tyson", Email: "mike.tyson@gmail.com"})
		assert.NotNil(t, err)
	})
}

var (
	mockCommandError = mtest.CommandError{
		Code:    3,
		Message: "mock command error",
		Name:    "deadbeef",
		Labels:  []string{},
	}

	mockWriteError = mtest.WriteError{
		Index:   1,
		Message: "mock write concern error",
		Code:    4,
	}
)

func createSuccessCursorResponse() bson.D {
	return mtest.CreateCursorResponse(1, "DbName.CollectionName", mtest.FirstBatch, bson.D{})
}
