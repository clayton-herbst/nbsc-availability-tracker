package service

import (
	"errors"

	"github.com/cherbie/player-cms/internal/crud"
)

type (
	PlayerService interface {
		FindByEmail(string) (*Player, error)
		Create(*Player) error
	}

	playerService struct {
		model *crud.PlayerModel
	}

	Player struct {
		FirstName string
		LastName  string
		Email     string
	}
)

var (
	ErrInvalidArgument = errors.New("invalid argument provided")
)

func NewPlayerService(collection crud.Collection) PlayerService {
	model := &crud.PlayerModel{collection}
	return &playerService{model}
}

func (service *playerService) FindByEmail(email string) (*Player, error) {
	if len(email) == 0 {
		return nil, ErrInvalidArgument
	}

	record, err := service.model.FindByEmail(email)
	if err != nil {
		return nil, err
	}

	player := Player{Email: record.Email, FirstName: record.Name}
	return &player, err
}

func (service *playerService) Create(player *Player) error {
	if player == nil {
		return ErrInvalidArgument
	}

	dbPlayer := crud.PlayerRecord{Name: player.FirstName, Email: player.Email}
	err := service.model.Create(dbPlayer)
	if err != nil {
		return err
	}

	return nil
}
