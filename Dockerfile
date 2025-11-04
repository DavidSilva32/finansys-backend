# Etapa 1 — build da aplicação
FROM node:20-alpine AS builder

# Define diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm ci

# Copia o restante do código-fonte
COPY . .

# Compila o projeto (gera dist/)
RUN npm run build


# Etapa 2 — imagem final, apenas o necessário para rodar
FROM node:20-alpine AS production

WORKDIR /app

# Copia apenas o necessário da etapa anterior
COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

# Define variável de ambiente padrão
ENV NODE_ENV=production
ENV PORT=3000

# Expõe a porta do servidor NestJS
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["node", "dist/main.js"]
