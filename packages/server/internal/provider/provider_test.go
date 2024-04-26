package provider_test

import (
	"errors"
	"testing"

	. "github.com/cherbie/player-cms/internal/provider"
	"github.com/stretchr/testify/assert"
)

func TestResourceManager_RegisterSingleton(t *testing.T) {
	mockSingleton := "mocked singleton"
	manager := NewResourceManager()
	manager.RegisterSingleton("mockName", func(*ResourceManager) (any, error) { return mockSingleton, nil })

	resolvedProvider := manager.Resolve("mockName")
	assert.NotNil(t, resolvedProvider)
	assert.Equal(t, mockSingleton, resolvedProvider)
}

func TestResourceManager_RegisterSingleton_Err(t *testing.T) {
	mockErr := errors.New("mock error")

	manager := NewResourceManager()
	expectedErrMessage := mockErr.Error()

	assert.PanicsWithError(t, expectedErrMessage, func() {
		manager.RegisterSingleton("mockName", func(*ResourceManager) (any, error) { return nil, mockErr })
	})
}

func TestResourceManager_RegisterTransient(t *testing.T) {
	mockTransient := "mocked transient"
	manager := NewResourceManager()
	manager.RegisterTransient("mockName", func(*ResourceManager) (any, error) {
		return mockTransient, nil
	})

	resolvedProvider := manager.Resolve("mockName")
	assert.NotNil(t, resolvedProvider)
	assert.Equal(t, mockTransient, resolvedProvider)
}

func TestResourceManager_RegisterTransient_Err(t *testing.T) {
	mockErr := errors.New("mock error")

	manager := NewResourceManager()
	expectedErrMessage := mockErr.Error()

	manager.RegisterTransient("mockName", func(*ResourceManager) (any, error) {
		return nil, mockErr
	})

	assert.PanicsWithError(t, expectedErrMessage, func() {
		manager.Resolve("mockName")
	})
}
