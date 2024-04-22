package crud

import (
	"context"
	"errors"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

type ConnectionOpts struct {
	Uri string
}

type ConnectionPool interface {
	ConnectionGetter
	Disposable
	Connect(opts ConnectionOpts) error
}

type InMemoryPool struct {
	resources []Connection
}

func NewConnectionPool() ConnectionPool {
	return &InMemoryPool{make([]Connection, 0)}
}

func (pool *InMemoryPool) Get() (*Connection, error) {
	if len(pool.resources) == 0 {
		return nil, errors.New("empty connection pool")
	}
	conn := &pool.resources[len(pool.resources)-1]
	return conn, nil
}

func (pool *InMemoryPool) Connect(opts ConnectionOpts) error {
	client, err := connectToMongoClient(opts.Uri)
	if err != nil {
		return err
	}

	connection := NewConnection(client)
	pool.resources = append(pool.resources, connection)

	return nil
}

func (pool *InMemoryPool) Close() error {
	errList := make([]error, 0)
	for _, conn := range pool.resources {
		errList = append(errList, conn.Close())
	}
	return errors.Join(errList...)
}

func connectToMongoClient(uri string) (*mongo.Client, error) {
	client, err := mongo.Connect(context.Background(), makeMongoClientConfig(uri))
	if err != nil {
		return nil, err
	}

	// test connection
	if err := client.Ping(context.Background(), readpref.Primary()); err != nil {
		return nil, err
	}

	return client, err
}

func makeMongoClientConfig(uri string) *options.ClientOptions {
	return options.Client().ApplyURI(uri)
}
