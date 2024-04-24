package controllers

import (
	"net/http"

	"github.com/cherbie/player-cms/internal/service"
	"github.com/gin-gonic/gin"
)

type (
	PlayerController interface {
		GetPlayer(ctx *gin.Context) error
	}

	playerController struct {
		service service.PlayerService
	}
)

func NewPlayerController(playerService service.PlayerService) PlayerController {
	return &playerController{playerService}
}

func (controller *playerController) GetPlayer(ctx *gin.Context) error {
	_, err := controller.service.FindByEmail("test@gmail.com")
	if err != nil {
		return err
	}

	ctx.String(http.StatusOK, "Hello World!\n")
	return nil
}
