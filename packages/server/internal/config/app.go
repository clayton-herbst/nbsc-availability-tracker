package config

var (
	defaultAppServerPort = "3333"
)

func GetVersion() string {
	return getEnv("APP_VERSION")
}

func GetServerPort() string {
	return getEnvOrDefault("APP_PORT", defaultAppServerPort)
}
