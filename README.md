# BCC Groups Editor

Provides a UI for viewing, creating and editing groups in BCC

## Overview

The application is build with the BFF pattern where the server is used as an authentication layer maintainig a cookie session with the browser, 
and taking care of authenticating and forwarding api requests to the Core API

## Running application

### Locally

1. Install Dependencies
   1. Golang
   2. [Air](https://github.com/cosmtrek/air)
   3. [Node](https://nodejs.org/en)
2. Copy `.env-example` into `.env` and fill missing env vars
3. Start the frontend (`./scripts/start-dev-frontend.sh` or vs code task: `start-dev-frontend`)
4. Start the server (`./scripts/start-dev-server.sh` or vs code task: `start-dev-server`)

### Docker
1. Install Dependencies
   1. [docker](https://docs.docker.com/get-docker/)
   2. [docker compose v2](https://docs.docker.com/compose/install/)
2. Copy `.env-example` into `.env` and fill missing env vars
3. Start the app (`./scripts/compose-up.sh` or vs code task: `compose-up`)

The application will be available at `http://localhost:4120`

## Deployment

1. Production and staging environments are automatically deployed to Google Cloud Run on a commit to the main branch.
2. Dev and staging environments can be manually deployed in github actions UI.
