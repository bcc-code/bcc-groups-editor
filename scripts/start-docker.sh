docker build . -t groups-editor
docker run --env-file .env -p 4120:4120 groups-editor
