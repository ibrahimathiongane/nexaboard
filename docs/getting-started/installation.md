# Installation

## Prerequisites

- Node.js 20 or higher
- pnpm 9 or higher
- Docker (optional, for database and Redis)

## Local Development

1. Clone the repository:

```bash
git clone https://github.com/your-org/nexaboard.git
cd nexaboard
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

4. Start the development servers:

```bash
pnpm dev
```

This will start both the API (port 4000) and web (port 3000) servers.

## Docker Setup

For a complete development environment with database and Redis:

```bash
docker compose up -d
```

## Database Setup

1. Generate Prisma client:

```bash
pnpm db:generate
```

2. Run migrations:

```bash
pnpm db:migrate
```

3. Seed the database (optional):

```bash
pnpm db:seed
```

## Verification

1. Open http://localhost:3000 in your browser
2. Register a new account
3. You should be redirected to the dashboard
