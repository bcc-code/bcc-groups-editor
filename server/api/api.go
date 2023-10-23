package api

import (
	"fmt"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"

	"golang.org/x/oauth2"
)

func Handler(remote string, tokens oauth2.TokenSource) http.Handler {
	remoteUrl, err := url.Parse(remote)
	if err != nil {
		panic(err)
	}
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		t, err := tokens.Token()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintf(w, "cannot get auth token: %s", err.Error())
			return
		}

		proxy := httputil.NewSingleHostReverseProxy(remoteUrl)
		proxy.Director = func(r *http.Request) {
			r.Header = req.Header
			r.Header.Add("Authorization", fmt.Sprintf("Bearer %s", t.AccessToken))
			r.Host = remoteUrl.Host
			r.URL.Path, _ = strings.CutPrefix(r.URL.Path, "/api")
			r.URL.Scheme = remoteUrl.Scheme
			r.URL.Host = remoteUrl.Host
		}
		proxy.ServeHTTP(w, req)
	})
}
