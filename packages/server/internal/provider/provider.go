package provider

type Provider interface {
	Provide() any
}

type SingletonProvider struct {
	instance any
}

func (p *SingletonProvider) Provide() any {
	return p.instance
}

type ProviderFactoryFunc func(*ResourceManager) (any, error)

type TransientProvider struct {
	resources *ResourceManager
	factory   ProviderFactoryFunc
}

func (p *TransientProvider) Provide() any {
	instance, err := p.factory(p.resources)
	if err != nil {
		panic(err)
	}
	return instance
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

func (r *ResourceManager) Resolve(name string) any {
	provider, ok := r.providers[name]
	if !ok {
		panic("No provider registered with name: " + name)
	}
	return provider.Provide()
}
