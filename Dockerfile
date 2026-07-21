# Substrate Sandbox — serve Vite build on port 8080
# Frontend is built in GitHub Actions (Artifactory) before this image build.
FROM harbor.ol.epicgames.net/docker-hub/node:22.17-alpine

WORKDIR /app

COPY server.mjs ./
COPY dist ./dist

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

USER node
CMD ["node", "server.mjs"]
