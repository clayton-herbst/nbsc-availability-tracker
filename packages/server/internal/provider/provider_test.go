package provider_test

import (
	"errors"
	"testing"

	. "github.com/cherbie/player-cms/internal/provider"
	"github.com/stretchr/testify/assert"
)

func TestResourceManager_RegisterSingleton(t *testing.T) {
	mockSingleton, mockId := "mocked singleton", "mockName"
	manager := NewResourceManager()
	manager.RegisterSingleton(mockId, func(*ResourceManager) (any, error) { return mockSingleton, nil })

	resolvedProvider, err := manager.Resolve(mockId)
	assert.Nil(t, err)
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
	mockTransient, mockId := "mocked transient", "mockName"
	manager := NewResourceManager()
	manager.RegisterTransient(mockId, func(*ResourceManager) (any, error) {
		return mockTransient, nil
	})

	resolvedProvider, err := manager.Resolve(mockId)
	assert.Nil(t, err)
	assert.NotNil(t, resolvedProvider)
	assert.Equal(t, mockTransient, resolvedProvider)
}

func TestResourceManager_RegisterTransient_Err(t *testing.T) {
	mockErr := errors.New("mock error")
	mockId := "mockName"

	manager := NewResourceManager()

	manager.RegisterTransient(mockId, func(*ResourceManager) (any, error) {
		return nil, mockErr
	})
	instance, err := manager.Resolve(mockId)
	assert.Nil(t, instance)
	assert.Error(t, mockErr, err)
}
