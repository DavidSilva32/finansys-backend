FROM node:20-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

RUN echo "=== Estrutura do diretório dist ===" && ls -laR dist/

FROM node:20-alpine AS production
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

EXPOSE 3000
CMD ["node", "dist/src/main.js"]