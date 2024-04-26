package service_test

import (
	"os"
	"testing"

	"github.com/cherbie/player-cms/internal/service"
	"github.com/stretchr/testify/assert"
)

func TestDatabaseConfig_MongoURI(t *testing.T) {
	t.Run("should return the mongo uri", func(t *testing.T) {
		expected := "mongodb://localhost:27017"
		os.Setenv("MONGODB_URI", expected)

		config := service.NewDatabaseConfigService()
		actual := config.MongoURI()

		assert.Equal(t, expected, actual)
	})
}
