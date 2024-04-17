package main

import (
	"testing"

	"net/http"
	"net/http/httptest"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestHealthEndpoint(t *testing.T) {
	stubRouter := gin.New()
	SetupRoutes(stubRouter)

	reqResponseRW := httptest.NewRecorder()
	mockHealthReq := httptest.NewRequest("GET", "/health", nil)
	stubRouter.ServeHTTP(reqResponseRW, mockHealthReq)

	assert.Equal(t, http.StatusOK, reqResponseRW.Code)
	assert.Equal(t, "Ok!\n", reqResponseRW.Body.String())
}

func TestPlayerEndpoint(t *testing.T) {
	stubRouter := gin.New()
	SetupRoutes(stubRouter)

	reqResponseRW := httptest.NewRecorder()
	mockPlayerReq := httptest.NewRequest("GET", "/player", nil)
	stubRouter.ServeHTTP(reqResponseRW, mockPlayerReq)

	assert.Equal(t, http.StatusOK, reqResponseRW.Code)
	assert.Equal(t, "Hello World!\n", reqResponseRW.Body.String())
}
