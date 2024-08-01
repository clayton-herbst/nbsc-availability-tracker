package provider_test

import (
	"errors"
	"testing"

	provider_mocks "github.com/cherbie/player-cms/internal/__generated__/provider"
	. "github.com/cherbie/player-cms/internal/provider"
	"github.com/stretchr/testify/assert"
)

func TestResourceManager_RegisterSingleton(t *testing.T) {
	mockSingleton, mockId := defaultMockDisposable(t), "mockName"
	manager := NewResourceManager()
	manager.RegisterSingleton(mockId, func(*ResourceManager) (Disposable, error) { return mockSingleton, nil })

	resolvedProvider, err := manager.Resolve(mockId)
	assert.Nil(t, err)
	assert.NotNil(t, resolvedProvider)
	assert.Exactly(t, mockSingleton, resolvedProvider)
}

func TestResourceManager_RegisterSingleton_Err(t *testing.T) {
	mockErr := errors.New("mock error")

	manager := NewResourceManager()
	expectedErrMessage := mockErr.Error()

	assert.PanicsWithError(t, expectedErrMessage, func() {
		manager.RegisterSingleton("mockName", func(*ResourceManager) (Disposable, error) { return nil, mockErr })
	})
}

func TestResourceManager_RegisterTransient(t *testing.T) {
	mockTransient, mockId := defaultMockDisposable(t), "mockName"
	manager := NewResourceManager()
	manager.RegisterTransient(mockId, func(*ResourceManager) (Disposable, error) {
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

	manager.RegisterTransient(mockId, func(*ResourceManager) (Disposable, error) {
		return nil, mockErr
	})
	instance, err := manager.Resolve(mockId)
	assert.Nil(t, instance)
	assert.Error(t, mockErr, err)
}

func TestResourceManager_Close(t *testing.T) {
	mockSingleton1, mockSingleton2 := defaultMockDisposable(t), defaultMockDisposable(t)
	// only called once
	mockSingleton1.On("Close").Return(nil).Once()
	mockSingleton2.On("Close").Return(nil).Once()

	manager := NewResourceManager()
	manager.RegisterSingleton("singleton1", func(*ResourceManager) (Disposable, error) { return mockSingleton1, nil })
	manager.RegisterSingleton("singleton2", func(*ResourceManager) (Disposable, error) { return mockSingleton2, nil })

	err := manager.Close()
	assert.Nil(t, err)
}

func TestResourceManager_CloseSingleErr(t *testing.T) {
	mockSingleton1, mockSingleton2 := defaultMockDisposable(t), defaultMockDisposable(t)
	mockErr := errors.New("mock error")
	// only called once
	mockSingleton1.On("Close").Return(mockErr).Once()
	mockSingleton2.On("Close").Return(nil).Once()

	manager := NewResourceManager()
	manager.RegisterSingleton("singleton1", func(*ResourceManager) (Disposable, error) { return mockSingleton1, nil })
	manager.RegisterSingleton("singleton2", func(*ResourceManager) (Disposable, error) { return mockSingleton2, nil })

	err := manager.Close()
	assert.Error(t, mockErr, err)
}

func TestResourceManager_CloseMultipleErr(t *testing.T) {
	mockSingleton1, mockSingleton2 := defaultMockDisposable(t), defaultMockDisposable(t)
	mockErr := errors.New("mock error")

	// only called once
	mockSingleton1.On("Close").Return(mockErr).Once()
	mockSingleton2.On("Close").Return(mockErr).Once()

	manager := NewResourceManager()
	manager.RegisterSingleton("singleton1", func(*ResourceManager) (Disposable, error) { return mockSingleton1, nil })
	manager.RegisterSingleton("singleton2", func(*ResourceManager) (Disposable, error) { return mockSingleton2, nil })

	err := manager.Close()
	assert.EqualError(t, err, "mock error\nmock error")
}

func defaultMockDisposable(t *testing.T) *provider_mocks.MockDisposable {
	mock := provider_mocks.NewMockDisposable(t)
	return mock
}
