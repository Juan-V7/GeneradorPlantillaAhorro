import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../server.js';

let appServer;
let baseUrl;

test.before(async () => {
  appServer = createServer();
  await new Promise((resolve) => {
    appServer.listen(0, '127.0.0.1', () => {
      const port = appServer.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

test('Servidor responde a /health con estado healthy', async () => {
  const res = await fetch(`${baseUrl}/health`);
  assert.equal(res.status, 200);

  const data = await res.json();
  assert.equal(data.status, 'healthy');
  assert.ok(typeof data.uptime === 'number');
});

test('Servidor sirve index.html en ruta raíz /', async () => {
  const res = await fetch(`${baseUrl}/`);
  assert.equal(res.status, 200);
  assert.ok(res.headers.get('content-type').includes('text/html'));

  const text = await res.text();
  assert.ok(text.includes('Generador de Plantilla de Ahorro'));
});

test('Servidor retorna 404 para rutas inexistentes', async () => {
  const res = await fetch(`${baseUrl}/ruta-que-no-existe-xyz`);
  assert.equal(res.status, 404);
});

test.after(async () => {
  if (appServer) {
    await new Promise((resolve) => appServer.close(resolve));
  }
});
