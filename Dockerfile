# Dockerfile para Site Survey Telecom Pro
# Compatible con cualquier servidor (Linux, Mac, Windows, Cloud Run, AWS, VPS, Docker Compose)

# Etapa 1: Compilación
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar manifiestos de dependencias
COPY package*.json ./
RUN npm install

# Copiar el código fuente y compilar activos estáticos
COPY . .
RUN npm run build

# Etapa 2: Entorno de ejecución ligero de producción
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Copiar manifiesto e instalar solo dependencias de producción
COPY package*.json ./
RUN npm install --omit=dev

# Copiar compilación del frontend y servidor
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./
COPY --from=builder /app/.env.example ./.env.example

EXPOSE 3000

# Verificación de salud del contenedor
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/health || exit 1

# Iniciar servidor Node.js
CMD ["node", "server.ts"]
