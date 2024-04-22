package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type (
	HealthController interface {
		GetHealth(ctx *gin.Context) error
	}

	healthController struct{}
)

func NewHealthController() HealthController {
	return &healthController{}
}

func (controller *healthController) GetHealth(ctx *gin.Context) error {
	ctx.String(http.StatusOK, "Ok!\n")
	return nil
}
