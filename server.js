/**
 * Servidor Web Nativo y Ligero para GeneradorPlantillaAhorro
 *
 * Utiliza los módulos nativos de Node.js (node:http, node:fs, node:path)
 * sin dependencias externas obligatorias para máxima velocidad y seguridad.
 * Incluye endpoint /health para Docker y encabezados de seguridad.
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';

// Compatibilidad universal para ESM y empaquetado en snapshot pkg (CommonJS)
const appFilename = typeof __filename !== 'undefined' ? __filename : fileURLToPath(import.meta.url);
const appDirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(appFilename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.yaml': 'text/yaml; charset=utf-8',
  '.yml': 'text/yaml; charset=utf-8',
  '.ics': 'text/calendar; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

export function createServer() {
  return http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = decodeURIComponent(url.pathname);

    // Encabezados de seguridad
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Endpoint de salud (Health Check para Docker y orquestadores)
    if (pathname === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      }));
      return;
    }

    // Endpoint informativo de API
    if (pathname === '/api/v1/info') {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        name: 'GeneradorPlantillaAhorro',
        version: '1.0.0',
        description: 'API y servidor de aplicación para planificación de metas de ahorro programado.',
        status: 'active'
      }));
      return;
    }

    // Prevención de Directory Traversal y resolución de rutas relativas al snapshot
    let filePath;
    if (pathname === '/' || pathname === '') {
      filePath = path.join(appDirname, 'index.html');
    } else {
      const safePath = path.normalize(pathname).replace(/^(\.\.[/\\])+/, '');
      filePath = path.join(appDirname, safePath);

      // Si la ruta solicitada es un directorio, servir index.html
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }
    }

    // Comprobar si el archivo existe
    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        // 404 No encontrado
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><title>404 - No Encontrado</title></head>
<body style="font-family: sans-serif; text-align: center; padding: 3rem;">
  <h2>404 - Archivo no encontrado</h2>
  <p>La ruta solicitada no existe.</p>
  <a href="/">Volver al Generador de Plantilla de Ahorro</a>
</body>
</html>`);
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': stats.size,
        'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
      });

      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
    });
  });
}

// Iniciar servidor automáticamente si se ejecuta como proceso principal o binario pkg
const isPkg = typeof process.pkg !== 'undefined';
const isMain = isPkg || (process.argv[1] && appFilename === process.argv[1]);
let defaultServer = null;

function startListenWithRetry(server, initialPort, host, maxAttempts = 10) {
  let currentPort = initialPort;
  let attempts = 0;

  function tryListen() {
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        attempts++;
        if (attempts < maxAttempts) {
          console.warn(`[GeneradorPlantillaAhorro] Puerto ${currentPort} en uso. Intentando en ${currentPort + 1}...`);
          currentPort++;
          setTimeout(tryListen, 250);
          return;
        }
      }
      console.error(`[GeneradorPlantillaAhorro] Error al iniciar servidor: ${err.message}`);
    });

    server.listen(currentPort, host, () => {
      const localUrl = `http://localhost:${currentPort}`;
      console.log(`================================================================`);
      console.log(` 💰 [GeneradorPlantillaAhorro] Aplicación Iniciada con Éxito`);
      console.log(` 🌐 Dirección en tu navegador: ${localUrl}`);
      console.log(` 🩺 Verificación (Health):    ${localUrl}/health`);
      console.log(`================================================================`);
      console.log(` Mantén esta ventana abierta mientras uses la aplicación.`);
      console.log(` Para salir, presiona Ctrl + C o cierra esta ventana.`);
      console.log(`================================================================`);

      // Apertura automática del navegador predeterminado
      if (process.env.OPEN_BROWSER !== 'false') {
        const openCmd = process.platform === 'win32'
          ? `start ${localUrl}`
          : process.platform === 'darwin'
            ? `open "${localUrl}"`
            : `xdg-open "${localUrl}"`;

        exec(openCmd, (err) => {
          if (!err) {
            console.log(` [GeneradorPlantillaAhorro] Navegador web abierto automáticamente.`);
          }
        });
      }
    });
  }

  tryListen();
}

if (isMain) {
  defaultServer = createServer();
  startListenWithRetry(defaultServer, PORT, HOST);

  process.on('SIGINT', () => {
    console.log('\n[GeneradorPlantillaAhorro] Apagando servidor...');
    defaultServer.close(() => process.exit(0));
  });

  process.on('SIGTERM', () => {
    console.log('\n[GeneradorPlantillaAhorro] Apagando servidor...');
    defaultServer.close(() => process.exit(0));
  });
}

export default defaultServer;

