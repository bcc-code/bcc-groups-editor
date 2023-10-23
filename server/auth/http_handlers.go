package auth

import (
	"crypto/rand"
	"encoding/base64"
	"errors"
	"fmt"
	"net/http"
	"time"

	"golang.org/x/oauth2"
)

func (a *Auth) SetLoginHandlers(mux *http.ServeMux) {
	mux.HandleFunc("/login", a.loginHandler)
	mux.HandleFunc("/callback", a.callbackHandler)
	mux.HandleFunc("/logout", a.logoutHandler)
}

func (a *Auth) loginHandler(w http.ResponseWriter, req *http.Request) {
	state, err := generateRandomState()
	if err != nil {
		errCtx := fmt.Errorf("cannot generate random state: %w", err)
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, errCtx.Error())
		return
	}

	cookie := http.Cookie{Name: "state", Value: state, Expires: time.Now().AddDate(0, 0, 1)}
	http.SetCookie(w, &cookie)

	http.Redirect(w, req, a.oauthConfig.AuthCodeURL(state), http.StatusTemporaryRedirect)
}

func generateRandomState() (string, error) {
	b := make([]byte, 32)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}

	state := base64.StdEncoding.EncodeToString(b)

	return state, nil
}

func (a *Auth) callbackHandler(w http.ResponseWriter, req *http.Request) {
	token, err := a.getCallbackToken(req)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Fprintf(w, "cannot get callback token: %s", err)
	}

	rawIDToken, ok := token.Extra("id_token").(string)
	if !ok {
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Fprint(w, "missing id token")
		return
	}

	idToken, err := a.idTokenVerifier.Verify(req.Context(), rawIDToken)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Fprintf(w, "invalid id token: %s", err)
		return
	}

	session, err := getSessionFromIdToken(idToken)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Fprintf(w, "cannot create session from token: %s", err)
		return
	}

	a.setSession(w, session)

	http.Redirect(w, req, "/", http.StatusTemporaryRedirect)
}

func (a *Auth) getCallbackToken(req *http.Request) (*oauth2.Token, error) {
	state, err := req.Cookie("state")
	if err != nil {
		return nil, errors.New("invalid state parameter")
	}

	if req.URL.Query().Get("state") != state.Value {
		return nil, errors.New("invalid state parameter")
	}

	token, err := a.oauthConfig.Exchange(req.Context(), req.URL.Query().Get("code"))
	if err != nil {
		return nil, errors.New("failed to exchange an authorization code for a token")
	}
	return token, nil
}

// Handler for our login.
func (a *Auth) logoutHandler(w http.ResponseWriter, req *http.Request) {
	a.deleteSession(w)
	http.Redirect(w, req, a.logoutEndpoint, http.StatusTemporaryRedirect)
}
