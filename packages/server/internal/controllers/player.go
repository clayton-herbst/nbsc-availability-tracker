package controllers

import (
	"net/http"

	"github.com/cherbie/player-cms/internal/crud"
	"github.com/gin-gonic/gin"
)

type (
	PlayerController interface {
		GetPlayer(ctx *gin.Context) error
	}

	playerController struct {
		crud.ConnectionPool
	}
)

func NewPlayerController(connectionPool crud.ConnectionPool) (PlayerController, error) {
	return &playerController{connectionPool}, nil
}

func (controller *playerController) GetPlayer(ctx *gin.Context) error {
	_, err := controller.ConnectionPool.Get()
	if err != nil {
		return err
	}

	ctx.String(http.StatusOK, "Hello World!\n")
	return nil
}
