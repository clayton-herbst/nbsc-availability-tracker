package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(engine *gin.Engine) {
	engine.GET("/health", healthHandler)
	engine.GET("/player", getPlayerHandler)
}

func healthHandler(ctx *gin.Context) {
	ctx.String(http.StatusOK, "Ok!\n")
}

func getPlayerHandler(ctx *gin.Context) {
	ctx.String(http.StatusOK, "Hello World!\n")
}
