FROM node:18 AS base

FROM base AS dependencies
WORKDIR /app
COPY package*.json ./
COPY .env ./
COPY prisma ./prisma/
RUN npm install


FROM base AS build
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN npm run build


FROM base AS deploy
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist/ ./dist/
COPY --from=dependencies /app/prisma ./prisma

CMD ["npm", "run", "start:migrate:prod"]