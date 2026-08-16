# Next.js app image for Railway.
#
# This service is NOT publicly routed: the Spring Cloud Gateway reaches it over
# Railway's private network and is the only thing the browser talks to. It holds
# no secrets and performs no authentication — the gateway owns all of that.

FROM node:26-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# `npm ci` needs the lockfile to match package.json exactly, which is what we
# want for a reproducible image.
RUN npm ci

FROM node:26-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:26-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Must bind all interfaces, otherwise Railway's private network cannot reach it.
ENV HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# `output: "standalone"` produces server.js plus a pruned node_modules; static
# assets and public/ are not included in it and must be copied alongside.
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

# Railway injects PORT; server.js reads it, falling back to 3000 locally.
CMD ["node", "server.js"]
