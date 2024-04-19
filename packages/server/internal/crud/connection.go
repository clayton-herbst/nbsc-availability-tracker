package crud

import (
	"context"
	"errors"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

// -- Connection --
type Connection struct {
	*mongo.Client
}

func newConnection(client *mongo.Client) Connection {
	return Connection{client}
}

type ConnectionOpts struct {
	uri string
}

type Disposable interface {
	Close() error
}

func (conn *Connection) Close() error {
	return conn.Client.Disconnect(context.Background())
}

// -- In-Memory Connection Pool --

type inMemoryPool struct {
	resources []Connection
}

// -- ConnectionPool --

type ConnectionGetter interface {
	Get() (*Connection, error)
}

type ConnectionPool interface {
	ConnectionGetter
	Disposable
	Connect(opts ConnectionOpts) error
}

func NewConnectionPool() ConnectionPool {
	return &inMemoryPool{make([]Connection, 0)}
}

func (pool *inMemoryPool) Get() (*Connection, error) {
	if len(pool.resources) == 0 {
		return nil, errors.New("empty connection pool")
	}
	conn := &pool.resources[len(pool.resources)-1]
	return conn, nil
}

func (pool *inMemoryPool) Connect(opts ConnectionOpts) error {
	client, err := connectToMongoClient(opts.uri)
	if err != nil {
		return err
	}

	connection := newConnection(client)
	pool.resources = append(pool.resources, connection)

	return nil
}

func (pool *inMemoryPool) Close() error {
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
