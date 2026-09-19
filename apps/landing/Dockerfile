# =============================================================================
# Landing - Next.js 14 (App Router)
# =============================================================================

# -- Dependencies --
FROM node:20-alpine AS deps
RUN corepack enable pnpm
WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc turbo.json ./
COPY apps/landing/package.json ./apps/landing/

RUN pnpm install --frozen-lockfile

# -- Development --
FROM node:20-alpine AS development
RUN corepack enable pnpm
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json pnpm-workspace.yaml .npmrc turbo.json ./
COPY apps/landing ./apps/landing
EXPOSE 3001
CMD ["pnpm", "--filter", "@nexaboard/landing", "run", "dev"]

# -- Build --
FROM node:20-alpine AS build
RUN corepack enable pnpm
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/landing/node_modules ./apps/landing/node_modules
COPY apps/landing ./apps/landing
ENV NEXT_TELEMETRY_DISABLED=1
RUN cd apps/landing && ./node_modules/.bin/next build

# -- Production --
FROM node:20-alpine AS runner
RUN corepack enable pnpm
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=build /app/apps/landing/public ./public
COPY --from=build --chown=nextjs:nodejs /app/apps/landing/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/apps/landing/.next/static ./.next/static
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/landing/node_modules ./apps/landing/node_modules
ENV NODE_PATH=/app/apps/landing/node_modules:/app/node_modules

USER nextjs

EXPOSE 3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
