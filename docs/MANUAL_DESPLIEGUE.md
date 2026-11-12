# Manual de Despliegue y Operación
# GeneradorPlantillaAhorro 💰🌱

> **Guía Técnica de Instalación, Contenedores y Empaquetado Portable**  
> **Versión:** 1.0.0  
> **Runtime Objetivo:** Node.js >= 20.0.0 LTS / Docker Engine 24+  
> **Plataformas Soportadas:** Windows 10/11, Linux (Debian, Ubuntu, Alpine, RHEL), macOS

---

## 1. Introducción y Modos de Despliegue

**GeneradorPlantillaAhorro** ha sido diseñado bajo los principios de la arquitectura *Twelve-Factor App* y la filosofía *Zero-External-Dependencies*. Esto significa que no depende de frameworks de terceros en el backend (como Express o Fastify), garantizando una superficie de ataque mínima, un consumo de memoria insignificante (< 30 MB de RAM) y tiempos de arranque inferiores a 100 milisegundos.

La aplicación admite cuatro modalidades de ejecución y despliegue:

1. **Ejecución Local Nativa con Node.js:** Ideal para desarrollo, auditoría y pruebas rápidas.
2. **Despliegue Contenedorizado con Docker:** Configuración inmutable en dos etapas (*multi-stage build*) con validación previa de pruebas automatizadas y ejecución bajo usuario sin privilegios.
3. **Orquestación con Docker Compose y Reverse Proxy:** Para despliegues en servidores de producción con terminación SSL/TLS (Nginx, Caddy o Traefik).
4. **Distribución Portable Autónoma para Windows:** Generación de paquetes portables autoejecutables para usuarios finales que no disponen de Node.js instalado en su sistema.

---

## 2. Requisitos Previos del Sistema

### 2.1. Requisitos de Hardware
* **Procesador:** CPU de 64 bits (x86_64 o ARM64 / Apple Silicon).
* **Memoria RAM:** Mínimo 512 MB (Recomendado: 1 GB o superior).
* **Espacio en Disco:** Mínimo 100 MB de espacio libre.

### 2.2. Requisitos de Software
* **Node.js:** Versión 20.0.0 LTS o superior (v20.x, v22.x o v24.x).
* **Docker Engine:** Versión 24.0 o superior (o Docker Desktop en Windows / macOS) si se despliega en contenedores.
* **Git CLI:** Para clonar el repositorio de control de versiones.
* **Navegador Web:** Chrome 90+, Firefox 90+, Edge 90+ o Safari 15+.

---

## 3. Descarga del Proyecto y Estructura de Dependencias

### 3.1. Clonación del Repositorio
Ejecuta en tu terminal preferida (PowerShell, CMD o Bash):

```bash
git clone https://github.com/Juan-V7/GeneradorPlantillaAhorro.git
cd GeneradorPlantillaAhorro
```

### 3.2. Análisis del Archivo `package.json`
El archivo de configuración del proyecto se define de la siguiente manera:

```json
{
  "name": "generador-plantilla-ahorro",
  "version": "1.0.0",
  "description": "Aplicación web accesible y modular para planificar metas de ahorro programado a medida.",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "test": "node --test tests/*.test.js"
  },
  "engines": {
    "node": ">=20.0.0"
  }
}
```

> [!NOTE]
> **Arquitectura Cero Dependencias:** Observa que el proyecto no incluye la sección `"dependencies"` en `package.json`. No es necesario ejecutar `npm install` de librerías de terceros para poner en marcha la aplicación en producción. Todo el servidor HTTP y el motor de pruebas utilizan los módulos estándar nativos del runtime de Node.js (`node:http`, `node:fs`, `node:path`, `node:url`, `node:test`, `node:assert/strict`).

### 3.3. Verificación Previa de Calidad (Pruebas Automatizadas)
Antes de desplegar en cualquier entorno, comprueba la integridad del código ejecutando la suite de 19 pruebas nativas:

```bash
npm test
```

Salida esperada:
```
✔ parseLocalDate maneja strings YYYY-MM-DD sin alteración por zona horaria
✔ calculateInstallmentCount calcula cuotas según meses y periodicidad
✔ calculateInstallmentDate ajusta días de fin de mes correctamente
✔ generateSavingsPlan reparte los céntimos con exactitud matemática al 100%
✔ calculatePlanMetrics refleja el progreso, saldo pendiente y próxima cuota
...
ℹ tests 19
ℹ pass 19
ℹ fail 0
```

---

## 4. Ejecución Local con Node.js (`server.js`)

### 4.1. Arranque Estándar
Inicia el servidor con cualquiera de los siguientes comandos:

```bash
npm start
```
o bien:
```bash
node server.js
```

La consola confirmará el inicio del proceso:
```
[GeneradorPlantillaAhorro] Servidor iniciado con éxito en http://localhost:3000
[GeneradorPlantillaAhorro] Healthcheck disponible en http://localhost:3000/health
```

Abre tu navegador en:  
👉 **[http://localhost:3000](http://localhost:3000)**

### 4.2. Configuración mediante Variables de Entorno
El servidor `server.js` admite variables de entorno para adaptarse dinámicamente a la infraestructura:

| Variable | Tipo | Valor por Defecto | Descripción |
|---|---|---|---|
| `PORT` | Entero | `3000` | Puerto TCP de enlace donde escuchará el servidor. |
| `HOST` | String | `0.0.0.0` | Dirección IP de la interfaz de red (`0.0.0.0` permite conexiones externas y dentro de contenedores; `127.0.0.1` confina el acceso a localhost). |
| `NODE_ENV` | String | `production` | Modo de entorno del runtime. |

#### Ejemplos de Arranque Personalizado:

* **En Windows PowerShell:**
  ```powershell
  $env:PORT="8080"
  $env:HOST="127.0.0.1"
  node server.js
  ```

* **En Windows Command Prompt (CMD):**
  ```cmd
  set PORT=8080
  set HOST=127.0.0.1
  node server.js
  ```

* **En Linux / macOS (Bash):**
  ```bash
  PORT=8080 HOST=127.0.0.1 node server.js
  ```

### 4.3. Verificación de Endpoints y Salud del Proceso
Puedes verificar el estado del servidor mediante `curl` o herramientas HTTP:

```bash
# Comprobar Healthcheck
curl -i http://localhost:3000/health

# Comprobar Metadata informativa
curl -i http://localhost:3000/api/v1/info
```

### 4.4. Apagado Controlado (*Graceful Shutdown*)
El servidor intercepta las señales del sistema operativo (`SIGINT` mediante `Ctrl + C` y `SIGTERM`). Al recibirlas, cierra las conexiones TCP pendientes de forma limpia antes de finalizar el proceso, evitando la corrupción de transferencias en curso.

---

## 5. Despliegue con Contenedores Docker

El proyecto incluye un `Dockerfile` multi-stage altamente optimizado y un archivo `.dockerignore`.

### 5.1. Anatomía del `Dockerfile`

```dockerfile
# Etapa 1: Build y verificación
FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
COPY . .
# Ejecuta las pruebas automatizadas como barrera de compilación
RUN node --test tests/*.test.js

# Etapa 2: Entorno de Producción
FROM node:24-bookworm-slim
WORKDIR /app

LABEL maintainer="Antigravity Team"
LABEL description="Generador de Plantilla de Ahorro Programado"

# Copia solo los artefactos validados
COPY --from=build /app /app

ENV PORT=3000
ENV NODE_ENV=production

# Seguridad: Ejecución con usuario no-root 'node'
USER node

EXPOSE 3000

# Verificación de salud periódica
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

CMD ["node", "server.js"]
```

### 5.2. Ventajas del Enfoque Docker del Proyecto
1. **Compilación Inmutable con Barrera de Pruebas:** Si alguna de las 19 pruebas falla durante la etapa de construcción, la imagen no se genera, previniendo despliegues rotos.
2. **Usuario Sin Privilegios (`USER node`):** El contenedor no se ejecuta como `root`, protegiendo el host frente a potenciales vulnerabilidades de escape de contenedor.
3. **Monitor de Salud Integrado (`HEALTHCHECK`):** Docker verifica cada 30 segundos el endpoint `/health` mediante la API nativa `fetch` de Node.js.

### 5.3. Comandos de Construcción y Ejecución con Docker

#### Paso 1: Construir la imagen
```bash
docker build -t generador-plantilla-ahorro:1.0.0 .
```

#### Paso 2: Ejecutar el contenedor
```bash
docker run -d \
  --name ahorro-app \
  -p 3000:3000 \
  --restart unless-stopped \
  generador-plantilla-ahorro:1.0.0
```

#### Paso 3: Verificar el estado y el healthcheck
```bash
# Ver estado del contenedor
docker ps

# Inspeccionar el estado de salud específico
docker inspect --format='{{json .State.Health.Status}}' ahorro-app
# Debe retornar: "healthy"

# Consultar los logs del servidor
docker logs -f ahorro-app
```

#### Paso 4: Detener y eliminar el contenedor
```bash
docker stop ahorro-app
docker rm ahorro-app
```

### 5.4. Despliegue con Docker Compose
Para entornos de integración continua o servidores locales, crea un archivo `docker-compose.yml` en la raíz del proyecto:

```yaml
version: '3.8'

services:
  ahorro-web:
    build:
      context: .
      dockerfile: Dockerfile
    image: generador-plantilla-ahorro:latest
    container_name: generador-ahorro
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - HOST=0.0.0.0
      - NODE_ENV=production
    healthcheck:
      test: ["CMD", "node", "-e", "fetch('http://127.0.0.1:3000/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 5s
```

Para iniciar el servicio con compose:
```bash
docker compose up -d
```

Para detener el servicio:
```bash
docker compose down
```

---

## 6. Compilación de Versión Portable para Windows

Para distribuir la aplicación a usuarios finales que no tienen Node.js ni Docker instalados en sus computadores con Windows, dispones de dos estrategias de empaquetado autónomo:

### 6.1. Estrategia A: Compilación en Ejecutable Nativo Único (.exe) con Node.js SEA

A partir de Node.js v20+, es posible empaquetar aplicaciones en un único archivo ejecutable (`.exe`) sin necesidad de librerías externas mediante la característica nativa **Single Executable Applications (SEA)**.

#### Paso a Paso para compilar en Windows:

1. **Crear el archivo de configuración `sea-config.json`:**
   En la raíz del proyecto, crea un archivo llamado `sea-config.json`:
   ```json
   {
     "main": "server.js",
     "output": "sea-prep.blob"
   }
   ```

2. **Generar el blob preparatorio:**
   Ejecuta en PowerShell:
   ```powershell
   node --experimental-sea-config sea-config.json
   ```

3. **Obtener una copia del binario de Node.js:**
   Copia el archivo ejecutable de Node.js actual hacia el directorio de compilación:
   ```powershell
   node -e "require('fs').copyFileSync(process.execPath, 'GeneradorPlantillaAhorro.exe')"
   ```

4. **Inyectar el blob en el ejecutable usando Postject:**
   Para inyectar el código JavaScript dentro del ejecutable `.exe` se utiliza la utilidad nativa de Microsoft:
   ```powershell
   npx postject GeneradorPlantillaAhorro.exe NODE_SEA_BLOB sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2
   ```

5. **Distribuir:**
   El archivo resultante `GeneradorPlantillaAhorro.exe` puede copiarse junto a las carpetas `css/`, `src/` e `index.html`. Al hacer doble clic en `GeneradorPlantillaAhorro.exe`, la aplicación arrancará inmediatamente y se ejecutará en segundo plano.

---

### 6.2. Estrategia B: Paquete Portable Autónomo con Node.js Standalone (.zip)

Esta es la alternativa más sencilla y confiable para distribuir en memorias USB o carpetas compartidas sin requerir privilegios de administrador.

#### Paso 1: Descargar el binario portable de Node.js para Windows
Descarga la versión oficial en `.zip` de Node.js (por ejemplo `node-v20.18.0-win-x64.zip`) desde [nodejs.org](https://nodejs.org/dist/) y extrae únicamente el archivo `node.exe` dentro de una subcarpeta llamada `bin/`.

#### Paso 2: Crear el lanzador `Iniciar_Ahorro.bat`
Crea en la raíz del paquete un archivo de procesamiento por lotes llamado `Iniciar_Ahorro.bat`:

```bat
@echo off
title Generador de Plantilla de Ahorro Programado
cd /d "%~dp0"

echo ========================================================
echo   Iniciando GeneradorPlantillaAhorro...
echo ========================================================

REM Comprobar si existe node.exe local en bin/, si no, usar el del sistema
if exist "bin\node.exe" (
    set "NODE_CMD=bin\node.exe"
) else (
    set "NODE_CMD=node"
)

REM Iniciar el servidor en segundo plano
start /B "" %NODE_CMD% server.js

REM Esperar 1 segundo para asegurar el arranque del puerto
timeout /t 1 /nobreak > nul

REM Abrir el navegador predeterminado en la aplicación
start http://localhost:3000

echo Servidor en ejecucion en http://localhost:3000
echo Para cerrar la aplicacion, cierra esta ventana.
echo ========================================================
pause
```

#### Paso 3: Estructura final del paquete portable Windows
```
GeneradorPlantillaAhorro-Portable/
├── Iniciar_Ahorro.bat           # Doble clic para arrancar
├── server.js                   # Servidor HTTP nativo
├── index.html                  # Interfaz de usuario
├── manifest.json               # Configuración PWA
├── package.json
├── bin/
│   └── node.exe                # Ejecutable portable de Node.js (opcional)
├── css/
│   └── styles.css
└── src/
    ├── core/
    └── ui/
```

El usuario final simplemente descomprime la carpeta, hace doble clic en `Iniciar_Ahorro.bat` y su navegador predeterminado se abrirá de inmediato mostrando la aplicación lista para usar, sin instalaciones previas.

---

## 7. Mantenimiento, Monitoreo y Solución de Problemas

### 7.1. Error: "Puerto 3000 ya en uso" (`EADDRINUSE`)
Si al iniciar el servidor recibes el error:
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solución:**
* Cambia el puerto mediante la variable de entorno:
  ```powershell
  $env:PORT="3005"; node server.js
  ```
* O identifica y finaliza el proceso que ocupa el puerto en Windows:
  ```powershell
  netstat -ano | findstr :3000
  taskkill /PID <PID_NUMERO> /F
  ```

### 7.2. Contenedor Docker no saludable (*Unhealthy Status*)
Si `docker ps` reporta el estado `unhealthy`:
* Verifica si el puerto configurado en `server.js` coincide con el expuesto en `Dockerfile` (`PORT=3000`).
* Prueba el endpoint manualmente desde el contenedor:
  ```bash
  docker exec -it ahorro-app node -e "fetch('http://127.0.0.1:3000/health').then(r => r.json()).then(console.log)"
  ```

### 7.3. Actualización de Código en Producción (*Zero-Downtime*)
Para actualizar una instancia en producción sin interrumpir el servicio:
1. Construir la nueva versión de la imagen Docker:
   ```bash
   docker build -t generador-plantilla-ahorro:1.0.1 .
   ```
2. Desplegar el nuevo contenedor en un puerto alternativo (ej. 3001).
3. Conmutar el tráfico en el reverse proxy (Nginx / Caddy).
4. Detener el contenedor antiguo.
