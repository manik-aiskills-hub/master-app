FROM node:22-alpine AS base

RUN corepack enable && corepack prepare pnpm@9 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml* .npmrc* ./
RUN pnpm install --frozen-lockfile || pnpm install

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .

FROM base AS dev
EXPOSE 3000
CMD ["sh", "-c", "pnpm db:push && pnpm dev"]

FROM base AS test
CMD ["pnpm", "test"]

FROM base AS build
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
