# Journal des versions

Toutes les évolutions notables du projet sont consignées ici.
Format inspiré de [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/), versions selon le [versionnage sémantique](https://semver.org/lang/fr/).

## [Non publié]

### Ajouté

- Monorepo npm : API (`apps/api`), interface (`apps/web`), package partagé (`packages/shared`).
- Schéma Prisma issu du dossier de cadrage : utilisateurs, comptes, transactions, catégories, règles, imports, budgets.
- Logique métier testée : empreinte anti-doublon des lignes importées, catégorisation par règles, normalisation des montants et libellés.
- Middleware d'authentification JWT et gestion centralisée des erreurs.
- Page d'accueil accessible indiquant l'état de l'API.
- Docker Compose (Nginx, API, PostgreSQL 16) et configuration Nginx avec en-têtes de sécurité.
- Intégration continue GitHub Actions, analyse CodeQL, Dependabot, modèles de tickets et de pull request.
- Limitation globale du débit des requêtes sur l'API.

### Sécurité

- Passage à Zod 4.6.7 et à `deepmerge-ts` 8 (sous-dépendance de Prisma) pour corriger 4 vulnérabilités de sévérité élevée signalées par `npm audit`.
