package crud

import (
	"context"
	"errors"

	"go.mongodb.org/mongo-driver/mongo"
	mopts "go.mongodb.org/mongo-driver/mongo/options"
)

type (
	Collection interface {
		// FindOne returns up to one document that matches the provided filter.
		FindOne(ctx context.Context, filter any, opts ...*mopts.FindOneOptions) (*mongo.SingleResult, error)
		// InsertOne inserts the provided document.
		InsertOne(ctx context.Context, document any, opts ...*mopts.InsertOneOptions) (*mongo.InsertOneResult, error)
	}

	collectionCore struct {
		*mongo.Collection
		name string
	}
)

func NewCollection(collection *mongo.Collection) Collection {
	core := collectionCore{collection, collection.Name()}
	return &core
}

func (core *collectionCore) InsertOne(ctx context.Context, document any, opts ...*mopts.InsertOneOptions) (
	*mongo.InsertOneResult, error) {
	return core.Collection.InsertOne(ctx, document, opts...)
}

func (core *collectionCore) FindOne(ctx context.Context, filter any, opts ...*mopts.FindOneOptions) (*mongo.SingleResult, error) {
	result := core.Collection.FindOne(ctx, filter, opts...)

	if result == nil {
		return nil, errors.New("empty FindOne result")
	}

	return result, nil
}
