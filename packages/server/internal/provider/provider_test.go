package provider_test

import (
	"testing"

	. "github.com/cherbie/player-cms/internal/provider"
	"github.com/stretchr/testify/assert"
)

func TestResourceManager_RegisterSingleton(t *testing.T) {
	mockSingleton := "mocked singleton"
	manager := NewResourceManager()
	manager.RegisterSingleton("mockName", mockSingleton)

	resolvedProvider := manager.Resolve("mockName")
	assert.NotNil(t, resolvedProvider)
	assert.Equal(t, mockSingleton, resolvedProvider)
}

func TestResourceManager_RegisterTransient(t *testing.T) {
	mockTransient := "mocked transient"
	manager := NewResourceManager()
	manager.RegisterTransient("mockName", func() any {
		return mockTransient
	})

	resolvedProvider := manager.Resolve("mockName")
	assert.NotNil(t, resolvedProvider)
	assert.Equal(t, mockTransient, resolvedProvider)
}
