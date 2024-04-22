package controllers

import (
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"go.mongodb.org/mongo-driver/mongo/integration/mtest"
)

func TestGetPlayerOk(t *testing.T) {
	mt := mtest.New(t, mtest.NewOptions().ClientType(mtest.Mock))
	mt.Run("test", func(mt *mtest.T) {
		mockConnectionPool := newConnectionPoolMock(mt.Client)
		playerController, err := NewPlayerController(mockConnectionPool)
		assert.Nil(t, err)

		w := httptest.NewRecorder()
		testContext := gin.CreateTestContextOnly(w, testGinEngine)

		err = playerController.GetPlayer(testContext)
		assert.Nil(t, err)
		assert.Equal(t, 200, w.Result().StatusCode)
	})
}
