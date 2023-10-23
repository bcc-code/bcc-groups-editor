FROM node:18-buster as build-frontend

WORKDIR /app
COPY package.json package-lock.json index.html tsconfig.json vite.config.ts ./

RUN npm ci

CMD [ "npm", "run", "dev" ]