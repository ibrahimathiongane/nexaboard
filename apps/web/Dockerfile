# =============================================================================
# Frontend - Next.js 14 (App Router)
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
COPY --from=deps /app/node_modules ./node_modules
# Copy workspace root files (needed for pnpm workspace resolution)
COPY package.json pnpm-workspace.yaml .npmrc turbo.json ./
# Copy source (will be overridden by docker-compose volume mount)
COPY apps/web ./apps/web
EXPOSE 3000
CMD ["pnpm", "--filter", "@nexaboard/web", "run", "dev"]

# -- Build --
FROM node:20-alpine AS build
RUN corepack enable pnpm
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY apps/web .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm run build

# -- Production --
FROM node:20-alpine AS runner
RUN corepack enable pnpm
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=build /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
