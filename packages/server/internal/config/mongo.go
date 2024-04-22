package config

func GetMongoDbUri() string {
	uri := getEnv("MONGODB_URI")
	return uri
}
