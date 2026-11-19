# MoneyTrack

Plateforme web de gestion budgétaire personnelle : centraliser ses comptes, importer ses relevés CSV, détecter les doublons, catégoriser ses dépenses et suivre son reste à vivre, sans exploitation commerciale des données.

Projet réalisé dans le cadre du titre RNCP 39583 « Expert en développement logiciel » (preuve de concept).

## Stack

| Couche | Technologies |
| --- | --- |
| Interface | React 19, Vite, TypeScript, TanStack Query |
| API | Node.js 26 LTS, Express 5, Zod, JWT |
| Données | PostgreSQL 16, Prisma |
| Infrastructure | Docker Compose, Nginx |
| Qualité | ESLint (avec règles d'accessibilité), Vitest, GitHub Actions, CodeQL, Dependabot |

## Structure du dépôt

```
apps/
  api/        API REST (Express) — logique métier dans src/domain, schéma Prisma dans prisma/
  web/        Interface React, servie par Nginx en production
packages/
  shared/     Schémas Zod et types partagés entre l'API et l'interface
docker/nginx/ Configuration Nginx (reverse proxy, en-têtes de sécurité)
.github/      CI, analyse CodeQL, Dependabot, modèles de tickets
```

## Démarrage en local

Prérequis : Node.js 26 (voir `.nvmrc`) et Docker.

```bash
# 1. Installer les dépendances, puis committer le package-lock.json généré
npm install

# 2. Configurer l'environnement
cp .env.example .env   # puis remplacer les valeurs, notamment JWT_ACCESS_SECRET

# 3. Lancer PostgreSQL (exposé uniquement sur localhost)
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d db

# 4. Générer le client Prisma et créer la première migration
npm run build:shared
npm run prisma:generate -w @moneytrack/api
npm run prisma:migrate -w @moneytrack/api -- --name init

# 5. Lancer l'API et l'interface (deux terminaux)
npm run dev:api   # http://localhost:3000/api/health
npm run dev:web   # http://localhost:5173
```

Pour lancer toute la pile comme en production : `docker compose up --build`, puis ouvrir http://localhost.

## Scripts utiles

| Commande | Rôle |
| --- | --- |
| `npm run lint` | Analyse statique (TypeScript, hooks React, accessibilité) |
| `npm run typecheck` | Vérification des types de tous les paquets |
| `npm test` | Tests unitaires de l'API et de l'interface |
| `npm run test:coverage -w @moneytrack/api` | Tests de l'API avec seuil de couverture de 80 % sur `src/domain` |
| `npm run build` | Build de production de tous les paquets |

## Flux de travail

- Une branche par user story : `feature/US-04-import-csv`, `fix/…`, `chore/…`.
- Messages de commit au format [Conventional Commits](https://www.conventionalcommits.org/fr/) : `feat(import): …`, `fix(auth): …`.
- Chaque modification passe par une pull request : la CI (lint, types, tests, build, images Docker) et CodeQL doivent être verts avant la fusion.
- Les anomalies et incidents sont consignés avec les modèles de tickets GitHub ; chaque version est décrite dans `CHANGELOG.md`.

## Sécurité

- Accès aux données toujours filtré par l'utilisateur identifié par le JWT (protection contre l'IDOR).
- Entrées validées avec Zod, requêtes paramétrées par Prisma, en-têtes de sécurité (Helmet et Nginx).
- API et base de données non exposées : seul Nginx reçoit le trafic.

## Mise en production (à compléter)

Sur le VPS : terminaison TLS 1.3 avec un certificat Let's Encrypt devant le service `web`, sauvegarde quotidienne chiffrée de la base vers un stockage externe, sonde de disponibilité sur `/api/health`.
