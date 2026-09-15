# =============================================================================
# Backend API - NestJS + Prisma
# =============================================================================

# -- Dependencies --
FROM node:20-alpine AS deps
RUN corepack enable pnpm
RUN apk add --no-cache openssl
WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc turbo.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY libs/shared/package.json ./libs/shared/

RUN pnpm install --frozen-lockfile

# -- Development --
FROM node:20-alpine AS development
RUN corepack enable pnpm
RUN apk add --no-cache openssl
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY package.json pnpm-workspace.yaml .npmrc turbo.json ./
COPY apps/api ./apps/api
RUN cd apps/api && pnpm exec prisma generate
EXPOSE 4000
CMD ["pnpm", "--filter", "@nexaboard/api", "run", "start:dev"]

# -- Build --
FROM node:20-alpine AS build
RUN corepack enable pnpm
RUN apk add --no-cache openssl
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY apps/api ./apps/api
RUN cd apps/api && ./node_modules/.bin/prisma generate
RUN cd apps/api && ./node_modules/.bin/nest build

# -- Production --
FROM node:20-alpine AS runner
RUN corepack enable pnpm
RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/prisma ./prisma
COPY --from=build /app/apps/api/package.json ./package.json

USER nestjs

EXPOSE 4000
HEALTHCHECK --interval=10s --timeout=5s --start-period=20s --retries=5 \
  CMD wget --spider --quiet http://localhost:4000/api/v1/health/ready || exit 1
CMD ["sh", "-c", "node /app/node_modules/.pnpm/prisma@5.22.0/node_modules/prisma/build/index.js migrate deploy && node dist/main.js"]
