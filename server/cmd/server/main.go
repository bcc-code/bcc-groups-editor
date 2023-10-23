package main

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"net/url"

	"github.com/bcc-code/bcc-groups-editor/server/api"
	"github.com/bcc-code/bcc-groups-editor/server/auth"
	"github.com/bcc-code/bcc-groups-editor/server/config"
	"github.com/bcc-code/bcc-groups-editor/server/frontend"
	"github.com/samber/lo"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/clientcredentials"
)

func main() {
	cfg := config.Load()

	a := auth.New(
		auth.Config{
			ClientId:     cfg.Oauth.ClientID,
			ClientSecret: cfg.Oauth.ClientSecret,
			Issuer:       cfg.Oauth.Issuer,
			Host:         cfg.Server.Host,
		},
	)

	mux := http.NewServeMux()

	a.SetLoginHandlers(mux)

	authenticatedMux := http.NewServeMux()
	mux.Handle("/", a.RequiresAuth(a.ClaimCheck(verifyRoles, authenticatedMux)))

	authenticatedMux.Handle("/api/", api.Handler(
		cfg.Coreapi.BasePath,
		getCoreApiTokenSource(a, cfg.Coreapi.Audience)))
	authenticatedMux.Handle("/", (frontend.Handler(cfg.FrontendLocation)))

	http.ListenAndServe(fmt.Sprintf(":%d", cfg.Server.Port), mux)
}

func getCoreApiTokenSource(a *auth.Auth, audience string) oauth2.TokenSource {
	clientCredentialsCfg := &clientcredentials.Config{
		ClientID:     a.Config().ClientId,
		ClientSecret: a.Config().ClientSecret,
		TokenURL:     a.TokenEndpoint(),
		EndpointParams: url.Values{
			"audience": []string{audience},
		},
	}

	return clientCredentialsCfg.TokenSource(context.Background())
}

func verifyRoles(s auth.Session) error {
	allowedRoles := []string{"Developer", "Central Administrator"}

	for _, r := range s.Roles {
		if lo.Contains(allowedRoles, r.RoleName) {
			return nil
		}
	}

	return errors.New("missing roles")
}
