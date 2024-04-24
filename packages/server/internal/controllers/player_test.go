package controllers

import (
	"net/http/httptest"
	"testing"

	"github.com/cherbie/player-cms/internal/service"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestGetPlayerOk(t *testing.T) {
	mockService := mockPlayerService{}
	playerController := NewPlayerController(&mockService)

	w := httptest.NewRecorder()
	testContext := gin.CreateTestContextOnly(w, testGinEngine)

	err := playerController.GetPlayer(testContext)
	assert.Nil(t, err)
	assert.Equal(t, 200, w.Result().StatusCode)
}

type mockPlayerService struct{}

func (s *mockPlayerService) FindByEmail(email string) (*service.Player, error) {
	return &service.Player{Email: "test@email.com"}, nil
}

func (s *mockPlayerService) Create(*service.Player) error {
	return nil
}
