# 1) Sukompiliuojame React programą į statinius failus (dist/)
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# 2) Statinius failus aptarnauja Caddy, o /api užklausas persiunčia backend'ui.
#    Naršyklei frontend ir API – tas pats domenas, todėl refresh slapukas veikia be CORS.
FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
ENV PORT=8080 \
    API_UPSTREAM=http://backend:8080
EXPOSE 8080
