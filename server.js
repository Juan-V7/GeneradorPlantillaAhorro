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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

    // Prevención de Directory Traversal
    const safePath = path.normalize(pathname).replace(/^(\.\.[/\\])+/, '');
    let filePath = path.join(__dirname, safePath);

    // Si la ruta solicitada es un directorio, servir index.html
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
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

// Iniciar servidor automáticamente si se ejecuta como proceso principal
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
let defaultServer = null;

if (isMain) {
  defaultServer = createServer();
  defaultServer.listen(PORT, HOST, () => {
    console.log(`[GeneradorPlantillaAhorro] Servidor iniciado con éxito en http://localhost:${PORT}`);
    console.log(`[GeneradorPlantillaAhorro] Healthcheck disponible en http://localhost:${PORT}/health`);
  });

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

