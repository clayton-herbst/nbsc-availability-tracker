package controllers

import (
	"github.com/cherbie/player-cms/internal/crud"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

type connectionPoolMock struct {
	*mongo.Client
}

func newConnectionPoolMock(client *mongo.Client) crud.ConnectionPool {
	return &connectionPoolMock{client}
}

func (c *connectionPoolMock) Close() error {
	return nil
}

func (c *connectionPoolMock) Get() (*crud.Connection, error) {
	conn := crud.NewConnection(c.Client)
	return &conn, nil
}

func (c *connectionPoolMock) Connect(crud.ConnectionOpts) error {
	return nil
}

var (
	testGinEngine = gin.Default()
)
