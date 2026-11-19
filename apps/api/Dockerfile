# Image de l'API MoneyTrack. Construire depuis la racine du dépôt :
#   docker build -f apps/api/Dockerfile .

FROM node:26-slim AS build
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY . .
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
RUN npm run build -w @moneytrack/shared \
 && npm run prisma:generate -w @moneytrack/api \
 && npm run build -w @moneytrack/api \
 && npm prune --omit=dev \
 && mkdir -p apps/api/node_modules

FROM node:26-slim
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=build --chown=node:node /app/packages/shared/dist ./packages/shared/dist
COPY --from=build --chown=node:node /app/apps/api/package.json ./apps/api/package.json
COPY --from=build --chown=node:node /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=build --chown=node:node /app/apps/api/prisma ./apps/api/prisma
COPY --from=build --chown=node:node /app/apps/api/dist ./apps/api/dist
USER node
WORKDIR /app/apps/api
EXPOSE 3000
# Applique les migrations en attente, puis démarre l'API
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
