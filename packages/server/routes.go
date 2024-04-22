package main

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

func SetupRoutes(engine *gin.Engine) {
	engine.GET("/health", healthHandler)
	engine.GET("/player", getPlayerHandler)
}

func healthHandler(ctx *gin.Context) {
	ctx.String(http.StatusOK, "Ok!\n")
}

func getPlayerHandler(ctx *gin.Context) {
	connection, err := connectionPoolSingleton.Get()
	if err != nil {
		panic(err)
	}
	if err := connection.Ping(context.Background(), readpref.Primary()); err != nil {
		panic(err)
	}
	ctx.String(http.StatusOK, "Hello World!\n")
}
