package controllers

import (
	"net/http/httptest"
	"testing"

	mocks "github.com/cherbie/player-cms/internal/__generated__/service"
	"github.com/cherbie/player-cms/internal/service"

	"github.com/gin-gonic/gin"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestGetPlayerOk(t *testing.T) {
	mockService := defaultPlayerService(t)
	playerController := NewPlayerController(mockService)

	w := httptest.NewRecorder()
	testContext := gin.CreateTestContextOnly(w, &gin.Engine{})

	err := playerController.GetPlayer(testContext)
	assert.Nil(t, err)
	assert.Equal(t, 200, w.Result().StatusCode)
}

func defaultPlayerService(t *testing.T) *mocks.MockPlayerService {
	mockPlayerService := mocks.NewMockPlayerService(t)
	mockPlayerService.On("FindByEmail", mock.Anything).Return(&service.Player{Email: "test@email.com"}, nil)
	return mockPlayerService
}
