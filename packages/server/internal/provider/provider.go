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
	factory func() any
}

func (p *TransientProvider) Provide() any {
	return p.factory()
}

type ResourceManager struct {
	providers map[string]Provider
}

func NewResourceManager() *ResourceManager {
	return &ResourceManager{providers: make(map[string]Provider)}
}

func (c *ResourceManager) RegisterSingleton(name string, instance any) {
	c.providers[name] = &SingletonProvider{instance: instance}
}

func (c *ResourceManager) RegisterTransient(name string, factory func() any) {
	c.providers[name] = &TransientProvider{factory: factory}
}

func (c *ResourceManager) Resolve(name string) any {
	provider, ok := c.providers[name]
	if !ok {
		panic("No provider registered with name: " + name)
	}
	return provider.Provide()
}
