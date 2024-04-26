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

type TransientProvider struct {
	resources *ResourceManager
	factory   func(*ResourceManager) any
}

func (p *TransientProvider) Provide() any {
	return p.factory(p.resources)
}

type ResourceManager struct {
	providers map[string]Provider
}

func NewResourceManager() *ResourceManager {
	return &ResourceManager{providers: make(map[string]Provider)}
}

func (r *ResourceManager) RegisterSingleton(name string, instance any) {
	r.providers[name] = &SingletonProvider{instance: instance}
}

func (r *ResourceManager) RegisterTransient(name string, factory func(*ResourceManager) any) {
	r.providers[name] = &TransientProvider{resources: r, factory: factory}
}

func (r *ResourceManager) Resolve(name string) any {
	provider, ok := r.providers[name]
	if !ok {
		panic("No provider registered with name: " + name)
	}
	return provider.Provide()
}
