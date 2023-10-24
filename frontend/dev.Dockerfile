FROM node:18-buster as build-frontend

WORKDIR /app
COPY package.json package-lock.json index.html tsconfig.json vite.config.ts postcss.config.js tailwind.config.js ./

RUN npm ci --force

CMD [ "npm", "run", "dev" ]