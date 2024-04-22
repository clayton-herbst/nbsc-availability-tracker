package controllers

import (
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestHealthOk(t *testing.T) {
	w := httptest.NewRecorder()
	testContext := gin.CreateTestContextOnly(w, testGinEngine)

	healthController := NewHealthController()
	err := healthController.GetHealth(testContext)
	assert.Nil(t, err)

	assert.Equal(t, 200, w.Result().StatusCode)
}
