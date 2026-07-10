FROM dhi.io/node:24.18.0-alpine3.24@sha256:342c79ff1f01e60ae61a1da3e07108838cad8317aca2c242168173acacf74eaf

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
