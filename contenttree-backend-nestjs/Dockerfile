# ---- Install stage ----
FROM dhi.io/node:24.22.1-alpine3.24-dev@sha256:7b851ff65d774343caf89450555663caef54dbd8f673658a615d256883973337 AS installer

WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --production && npm cache clean --force

# ---- Final stage ----
FROM dhi.io/node:24.20.0-alpine3.24@sha256:7b9165f2b8f0ebd5291db9ebfbb0484bcf38f7855a33419a10c0660db29e5398

WORKDIR /app

ENV NODE_ENV=production

COPY --from=installer --chown=node:node --chmod=a=rX /app/node_modules ./node_modules
COPY --chown=node:node --chmod=a=rX dist dist
COPY --chown=node:node --chmod=a=rX docker/healthcheck.mjs ./

USER node

EXPOSE 3000

CMD ["node", "dist/main.js"]
