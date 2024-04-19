package crud

import (
	"context"

	"go.mongodb.org/mongo-driver/mongo"
)

type ConnectionGetter interface {
	Get() (*Connection, error)
}

type Connection struct {
	Disposable
	*mongo.Client
}

func NewConnection(client *mongo.Client) Connection {
	return Connection{nil, client}
}

type Disposable interface {
	Close() error
}

func (conn *Connection) Close() error {
	return conn.Client.Disconnect(context.Background())
}
