package config

import (
	"github.com/kelseyhightower/envconfig"
)

type Config struct {
	Server struct {
		Port int    `envconfig:"PORT"`
		Host string `envconfig:"SERVER_HOST"`
	}
	Oauth struct {
		ClientID     string `envconfig:"OAUTH_CLIENT_ID"`
		ClientSecret string `envconfig:"OAUTH_CLIENT_SECRET"`
		Issuer       string `envconfig:"OAUTH_ISSUER"`
	}
	Coreapi struct {
		BasePath string `envconfig:"COREAPI_BASE_PATH"`
		Audience string `envconfig:"COREAPI_AUDIENCE"`
	}
	FrontendLocation string `envconfig:"FRONTEND_LOCATION"`
}

func Load() Config {
	cfg := Config{}
	err := envconfig.Process("", &cfg)
	if err != nil {
		panic(err)
	}
	return cfg
}
