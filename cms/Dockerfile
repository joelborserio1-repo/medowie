# Strapi CMS — production image for Railway (or any Docker host / Cloudflare Containers).
FROM node:20-alpine AS build
RUN apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev git python3

WORKDIR /opt/app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV NODE_ENV=production
RUN npm run build

FROM node:20-alpine AS production
RUN apk add --no-cache vips-dev
WORKDIR /opt/app
ENV NODE_ENV=production

COPY --from=build /opt/app/node_modules ./node_modules
COPY --from=build /opt/app/package.json ./package.json
COPY --from=build /opt/app/dist ./dist
COPY --from=build /opt/app/public ./public
COPY --from=build /opt/app/config ./config
COPY --from=build /opt/app/src ./src
COPY --from=build /opt/app/seed-assets ./seed-assets

RUN addgroup -S strapi && adduser -S strapi -G strapi \
  && chown -R strapi:strapi /opt/app
USER strapi

EXPOSE 1337
CMD ["npm", "run", "start"]
