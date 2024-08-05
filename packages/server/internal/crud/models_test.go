package crud

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/integration/mtest"
)

func TestPlayerModel_FindByEmail(t *testing.T) {
	mt := mtest.New(t, mtest.NewOptions().ClientType(mtest.Mock))

	mt.Run("test", func(mt *mtest.T) {
		coll := NewCollection(mt.Coll)
		playerModel := PlayerModel{coll}

		expectedEmail := "test@email.com"
		mockPlayerRecordCursorResp := mtest.CreateCursorResponse(1, "DBName.Players", mtest.FirstBatch, bson.D{{"Name", "Test Player"}, {"Email", expectedEmail}})
		mt.AddMockResponses(mockPlayerRecordCursorResp)

		record, err := playerModel.FindByEmail(expectedEmail)
		assert.Nil(t, err)
		assert.NotNil(t, record)
		assert.Equal(t, expectedEmail, record.Email)
	})
}

func TestPlayerModel_FindByEmailWithErr(t *testing.T) {
	mt := mtest.New(t, mtest.NewOptions().ClientType(mtest.Mock))

	mt.Run("test", func(mt *mtest.T) {
		coll := NewCollection(mt.Coll)
		playerModel := PlayerModel{coll}

		errorResponse := mtest.CreateCommandErrorResponse(mtest.CommandError{})
		mt.AddMockResponses(errorResponse)

		_, err := playerModel.FindByEmail("test@email.com")
		assert.NotNil(t, err)
	})
}

func TestPlayerModel_Create(t *testing.T) {
	mt := mtest.New(t, mtest.NewOptions().ClientType(mtest.Mock))

	mt.Run("test", func(mt *mtest.T) {
		coll := NewCollection(mt.Coll)
		playerModel := PlayerModel{coll}

		successResponse := mtest.CreateSuccessResponse()
		mt.AddMockResponses(successResponse)

		mockPlayer := PlayerRecord{Name: "Test Player", Email: "test@email.com"}
		err := playerModel.Create(mockPlayer)
		assert.Nil(t, err)
	})
}

func TestPlayerModel_CreateWithErr(t *testing.T) {
	mt := mtest.New(t, mtest.NewOptions().ClientType(mtest.Mock))

	mt.Run("test", func(mt *mtest.T) {
		coll := NewCollection(mt.Coll)
		playerModel := PlayerModel{coll}

		errorResponse := mtest.CreateWriteErrorsResponse(mtest.WriteError{})
		mt.AddMockResponses(errorResponse)

		mockPlayer := PlayerRecord{Name: "Test Player", Email: "test@email.com"}
		err := playerModel.Create(mockPlayer)
		assert.NotNil(t, err)
	})
}
