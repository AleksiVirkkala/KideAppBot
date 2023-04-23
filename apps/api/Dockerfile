# workspace refers to the project root Dockerfile
FROM workspace as pruned
RUN pnpm --filter kideappbot-backend --prod deploy pruned

FROM node:19.3-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY --from=pruned /app/pruned .

EXPOSE 3000

ENTRYPOINT ["node", "dist/index.js"]

# TODO: Check if works
HEALTHCHECK --interval=5s --timeout=3s --start-period=10s --retries=3 CMD curl -f http://localhost:3000/misc.healthCheck || exit 1
