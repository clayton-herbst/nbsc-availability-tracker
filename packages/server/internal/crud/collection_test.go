package crud

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/integration/mtest"
)

func TestNewCollectionName(t *testing.T) {
	mt := mtest.New(t, mtest.NewOptions().ClientType(mtest.Mock))
	mt.Run("test", func(mt *mtest.T) {
		assert.NotNil(t, mt.Coll)
		col := NewCollection(mt.Coll)
		assert.Equal(t, t.Name()+"/test", col.(*collectionCore).name)
	})
}

func TestCollection_FindOneSuccess(t *testing.T) {
	mt := mtest.New(t, mtest.NewOptions().ClientType(mtest.Mock))
	mt.Run("test", func(mt *mtest.T) {
		coll := NewCollection(mt.Coll)
		lookupKey, lookupValue := "key", "lookup-value"
		mockFindResp := mtest.CreateCursorResponse(1, "DbName.CollectionName", mtest.FirstBatch, bson.D{{lookupKey, lookupValue}})
		mt.AddMockResponses(mockFindResp)

		filter := bson.D{}
		response, err := coll.FindOne(context.Background(), filter)
		assert.Nil(t, err)

		rawResponse, _ := response.Raw()
		assert.Equal(t, lookupValue, rawResponse.Lookup(lookupKey).StringValue())
	})
}

var (
	mockCommandError = mtest.CommandError{
		Code:    3,
		Message: "mock command error",
		Name:    "deadbeef",
		Labels:  []string{},
	}

	mockWriteConcernError = mtest.WriteConcernError{
		Name:    "deadbeef",
		Message: "mock write concern error",
		Code:    4,
	}
)

func TestCollection_FindOneError(t *testing.T) {
	mt := mtest.New(t, mtest.NewOptions().ClientType(mtest.Mock))
	mt.Run("test", func(mt *mtest.T) {
		coll := NewCollection(mt.Coll)

		mockError := mockCommandError
		mockFindResp := mtest.CreateCommandErrorResponse(mockError)
		mt.AddMockResponses(mockFindResp)

		filter := bson.D{}
		response, err := coll.FindOne(context.Background(), filter)
		assert.Nil(t, err, "expect cursor fetch response to be ok!")

		expectedErr := response.Err()
		assert.NotNil(t, expectedErr)
		assert.Contains(t, expectedErr.Error(), mockError.Message)
	})
}

func TestCollection_InsertOneSuccess(t *testing.T) {
	mt := mtest.New(t, mtest.NewOptions().ClientType(mtest.Mock))
	mt.Run("test", func(mt *mtest.T) {
		coll := NewCollection(mt.Coll)

		mockSuccessResp := mtest.CreateSuccessResponse()
		mt.AddMockResponses(mockSuccessResp)

		result, err := coll.InsertOne(context.Background(), bson.D{{"name", "john"}})
		assert.Nil(t, err, "expecting successful insert response")
		assert.NotNil(t, result)
	})
}

func TestCollection_InsertOneError(t *testing.T) {
	mt := mtest.New(t, mtest.NewOptions().ClientType(mtest.Mock))
	mt.Run("test", func(mt *mtest.T) {
		coll := NewCollection(mt.Coll)

		mockError := mockWriteConcernError
		mockErrResp := mtest.CreateWriteConcernErrorResponse(mockError)
		mt.AddMockResponses(mockErrResp)

		document := bson.D{{"name", "john"}}
		result, err := coll.InsertOne(context.Background(), document)
		assert.Nil(t, result, "do not expect result")
		assert.Contains(t, err.Error(), mockError.Message)
	})
}
