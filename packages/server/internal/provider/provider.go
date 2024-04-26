package provider

import "errors"

var (
	ErrProviderUndefined = errors.New("provider is undefined")
	ErrProviderNotFound  = errors.New("provider not found")
)

type Provider interface {
	Provide() (any, error)
}

type SingletonProvider struct {
	instance any
}

func (p *SingletonProvider) Provide() (any, error) {
	if p.instance == nil {
		return nil, ErrProviderUndefined
	}

	return p.instance, nil
}

type ProviderFactoryFunc func(*ResourceManager) (any, error)

type TransientProvider struct {
	resources *ResourceManager
	factory   ProviderFactoryFunc
}

func (p *TransientProvider) Provide() (any, error) {
	instance, err := p.factory(p.resources)
	if err != nil {
		return nil, err
	} else if instance == nil {
		return nil, ErrProviderUndefined
	}

	return instance, nil
}

type ResourceManager struct {
	providers map[string]Provider
}

func NewResourceManager() *ResourceManager {
	return &ResourceManager{providers: make(map[string]Provider)}
}

func (r *ResourceManager) RegisterSingleton(name string, factory ProviderFactoryFunc) {
	instance, err := factory(r)
	if err != nil {
		panic(err)
	}
	r.providers[name] = &SingletonProvider{instance: instance}
}

func (r *ResourceManager) RegisterTransient(name string, factory ProviderFactoryFunc) {
	r.providers[name] = &TransientProvider{resources: r, factory: factory}
}

func (r *ResourceManager) Resolve(name string) (any, error) {
	provider, ok := r.providers[name]
	if !ok {
		return nil, ErrProviderNotFound
	}
	return provider.Provide()
}
