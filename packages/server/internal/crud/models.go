package crud

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
)

type (
	PlayerModel struct {
		Collection
	}

	PlayerRecord struct {
		Name  string
		Email string
	}
)

func (model *PlayerModel) FindByEmail(email string) (player *PlayerRecord, err error) {
	result, err := model.Collection.FindOne(context.Background(), bson.D{{"email", email}})
	if err != nil {
		return nil, err
	}

	err = result.Decode(&player)

	return
}

func (model *PlayerModel) Create(record PlayerRecord) error {
	marshalledRecord, err := bson.Marshal(record)
	if err != nil {
		return err
	}

	_, err = model.Collection.InsertOne(context.Background(), marshalledRecord)
	if err != nil {
		return err
	}

	return nil
}
