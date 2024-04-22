package controllers

import "github.com/gin-gonic/gin"

type HandlerFunc func(ctx *gin.Context) error

func HandlerWrapper(handler HandlerFunc) gin.HandlerFunc {
	wrapper := func(ctx *gin.Context) {
		if err := handler(ctx); err != nil {
			ctx.String(500, err.Error())
		}
	}
	return wrapper
}
