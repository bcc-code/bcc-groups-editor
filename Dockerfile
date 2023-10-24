FROM node:18-buster as build-frontend

WORKDIR /app
COPY frontend .

RUN npm ci --force
RUN npm run build

FROM golang:1.21-bullseye as build-server
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY server server

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o server ./server/cmd/server


FROM alpine:3.15
WORKDIR /
COPY --from=build-server /app/server /usr/bin/
COPY --from=build-frontend /app/dist /dist

ENV FRONTEND_LOCATION /dist

ENTRYPOINT ["server"]