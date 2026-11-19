# Image Nginx servant l'interface et relayant /api vers l'API. Construire depuis la racine :
#   docker build -f apps/web/Dockerfile .

FROM node:26-slim AS build
WORKDIR /app
COPY . .
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
RUN npm run build -w @moneytrack/shared && npm run build -w @moneytrack/web

FROM nginx:stable-alpine
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY docker/nginx/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
EXPOSE 80
