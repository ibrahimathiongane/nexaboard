# =============================================================================
# Backend API - NestJS + Prisma
# =============================================================================

# -- Dependencies --
FROM node:20-alpine AS deps
RUN corepack enable pnpm
WORKDIR /app

# Copy workspace root files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc turbo.json ./

# Copy all workspace package.json files
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY libs/shared/package.json ./libs/shared/

RUN pnpm install --frozen-lockfile

# -- Development --
FROM node:20-alpine AS development
RUN corepack enable pnpm
WORKDIR /app
# Copy root node_modules + workspace node_modules (pnpm hoists differently)
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules 2>/dev/null || true
# Copy workspace root files (needed for pnpm workspace resolution)
COPY package.json pnpm-workspace.yaml .npmrc turbo.json ./
# Copy prisma schema + generate client
COPY apps/api/prisma ./apps/api/prisma
RUN cd apps/api && npx prisma generate
# Copy source (will be overridden by docker-compose volume mount)
COPY apps/api ./apps/api
EXPOSE 4000
CMD ["pnpm", "--filter", "@nexaboard/api", "run", "start:dev"]

# -- Build --
FROM node:20-alpine AS build
RUN corepack enable pnpm
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules 2>/dev/null || true
COPY apps/api .
RUN npx prisma generate
RUN pnpm run build

# -- Production --
FROM node:20-alpine AS runner
RUN corepack enable pnpm
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=build /app/package.json ./
COPY --from=build /app/apps/api/prisma ./apps/api/prisma

USER nestjs

EXPOSE 4000
CMD ["node", "apps/api/dist/main.js"]
