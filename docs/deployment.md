# Déploiement nexaBoard

## Variables obligatoires

En production, fournir ces variables via le gestionnaire de secrets de la plateforme :

- `DATABASE_URL`
- `JWT_SECRET`
- `ALLOWED_ORIGINS`
- `NEXT_PUBLIC_API_URL`

Pour Railway, `ALLOWED_ORIGINS` doit contenir uniquement l'origine publique du
frontend, sans chemin et sans slash final :

```text
ALLOWED_ORIGINS=https://resplendent-hope-production-7e28.up.railway.app
FRONTEND_URL=https://resplendent-hope-production-7e28.up.railway.app
```

La variable `NEXT_PUBLIC_API_URL` du service frontend doit pointer vers :

```text
NEXT_PUBLIC_API_URL=https://nexaboard-production.up.railway.app
```

`JWT_SECRET` doit être aléatoire, long et différent entre chaque environnement. Ne jamais utiliser les valeurs de `docker-compose.yml` en production.

## Migrations

Les migrations Prisma sont versionnées dans `apps/api/prisma/migrations`.

Avant de démarrer une nouvelle version de l'API :

```bash
pnpm --filter @nexaboard/api exec prisma migrate deploy
```

Le déploiement doit appliquer les migrations avant de rendre l'API disponible.

## Health checks

- Liveness : `GET /api/v1/health`
- Readiness : `GET /api/v1/health/ready`

La readiness vérifie la connexion PostgreSQL. Le load balancer ne doit router le trafic vers l'API que lorsque cette route renvoie `200`.

## Conteneurs

L'image API de production utilise le stage `runner` du Dockerfile et exécute le processus avec un utilisateur non privilégié. L'image web utilise le build standalone de Next.js.

En production, PostgreSQL et Redis doivent rester sur un réseau privé. Seuls le frontend et l'API doivent être exposés publiquement derrière HTTPS.

## CI/CD

Le workflow `.github/workflows/ci.yml` exécute :

1. lint ;
2. génération Prisma, migrations, tests unitaires et tests E2E API ;
3. build de tous les packages.

Le déploiement doit être déclenché uniquement après le succès de ces contrôles.
