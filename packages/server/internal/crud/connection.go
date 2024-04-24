package crud

import (
	"context"

	"go.mongodb.org/mongo-driver/mongo"
)

type Connection struct {
	*mongo.Client
}

func NewConnection(client *mongo.Client) *Connection {
	return &Connection{client}
}

func (conn *Connection) Close() error {
	return conn.Client.Disconnect(context.Background())
}
