FROM golang:1.21-bullseye as build-server
WORKDIR /app
RUN go install github.com/cosmtrek/air@latest

COPY go.mod go.sum .air.toml ./
RUN go mod download

CMD ["air"]