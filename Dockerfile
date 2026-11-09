# Multi-stage Dockerfile para GeneradorPlantillaAhorro
# Cumple con las directrices de seguridad de SKILLS.md: usuario sin privilegios y healthcheck

# Etapa 1: Build y verificación
FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
# Copiar código y ejecutar pruebas para asegurar calidad
COPY . .
RUN node --test tests/*.test.js

# Etapa 2: Entorno de Producción
FROM node:24-bookworm-slim
WORKDIR /app

# Metadatos
LABEL maintainer="Antigravity Team"
LABEL description="Generador de Plantilla de Ahorro Programado"

# Copiar artefactos y código validado
COPY --from=build /app /app

# Variables de entorno
ENV PORT=3000
ENV NODE_ENV=production

# Usar usuario no-root por seguridad
USER node

# Exponer puerto de servicio
EXPOSE 3000

# Verificación de salud periódica
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

# Comando de arranque
CMD ["node", "server.js"]
