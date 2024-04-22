package controllers

import (
	"errors"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestHandlerOk(t *testing.T) {
	var okHandlerFunc HandlerFunc = func(ctx *gin.Context) error {
		ctx.Status(200)
		return nil
	}

	w := httptest.NewRecorder()
	testContext := gin.CreateTestContextOnly(w, testGinEngine)

	HandlerWrapper(okHandlerFunc)(testContext)

	assert.Equal(t, 200, w.Result().StatusCode)
}

func TestHandler_InternalServerError(t *testing.T) {
	var okHandlerFunc HandlerFunc = func(ctx *gin.Context) error {
		ctx.Status(503)
		return errors.New("unknown error")
	}

	w := httptest.NewRecorder()
	testContext := gin.CreateTestContextOnly(w, testGinEngine)

	HandlerWrapper(okHandlerFunc)(testContext)

	assert.Equal(t, 500, w.Result().StatusCode)
}
