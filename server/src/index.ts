import './env.js';
import { createApp } from './app.js';
import { initDb } from './db/index.js';
import { startHealthChecker } from './services/health.js';

const PORT = process.env.PORT ?? 3001;

async function main() {
  initDb();
  const app = createApp();

  const server = app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    console.log(`Proxy endpoint: http://0.0.0.0:${PORT}/v1/chat/completions`);
    startHealthChecker();
  });

  // Reap idle keep-alive sockets predictably behind a reverse proxy.
  // headersTimeout must stay > keepAliveTimeout (Node requirement).
  server.keepAliveTimeout = 75_000;
  server.headersTimeout = 80_000;
}

main().catch(console.error);
