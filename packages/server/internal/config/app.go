package config

func GetServerPort() string {
	return getEnvOrDefault("APP_PORT", defaultAppServerPort)
}

var (
	defaultAppServerPort = "3333"
)
