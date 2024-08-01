package provider

import "errors"

var (
	ErrProviderUndefined = errors.New("provider is undefined")
	ErrProviderNotFound  = errors.New("provider not found")
)

type (
	Disposable interface {
		Close() error
	}

	Provider interface {
		Disposable
		Provide() (Disposable, error)
	}

	ProviderFactoryFunc func(*ResourceManager) (Disposable, error)

	SingletonProvider struct {
		instance Disposable
	}

	TransientProvider struct {
		resources *ResourceManager
		factory   ProviderFactoryFunc
	}

	ResourceManager struct {
		providers map[string]Provider
	}
)

func (p *SingletonProvider) Provide() (Disposable, error) {
	if p.instance == nil {
		return nil, ErrProviderUndefined
	}

	return p.instance, nil
}

func (p *SingletonProvider) Close() error {
	return p.instance.Close()
}

func (p *TransientProvider) Provide() (Disposable, error) {
	instance, err := p.factory(p.resources)
	if err != nil {
		return nil, err
	} else if instance == nil {
		return nil, ErrProviderUndefined
	}

	return instance, nil
}

func (p *TransientProvider) Close() error { return nil }

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

func (r *ResourceManager) Close() error {
	errList := make([]error, 0)
	for key, provider := range r.providers {
		if disposable, ok := provider.(Disposable); ok {
			if err := disposable.Close(); err != nil {
				errList = append(errList, err)
			} else {
				delete(r.providers, key)
			}
		}
	}

	return errors.Join(errList...)
}
