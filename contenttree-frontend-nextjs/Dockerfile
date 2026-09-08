FROM dhi.io/node:24.20.0-alpine3.24@sha256:7b9165f2b8f0ebd5291db9ebfbb0484bcf38f7855a33419a10c0660db29e5398

WORKDIR /app

ENV NODE_ENV=production \
  HOSTNAME="0.0.0.0" \
  NEXT_TELEMETRY_DISABLED=1

COPY --chown=root:root --chmod=a=rX public public
COPY --chown=root:root --chmod=a=rX .next/standalone docker/healthcheck.mjs ./
COPY --chown=root:root --chmod=a=rX .next/static .next/static

USER node

EXPOSE 3000

CMD ["node", "server.js"]
