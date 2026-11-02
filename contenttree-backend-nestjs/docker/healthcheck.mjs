const PORT = process.env.NESTJS_PORT ?? 3001;
const URL = `http://localhost:${PORT}/api/ping`;
const TIMEOUT_IN_MS = 5000;

try {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, TIMEOUT_IN_MS);
  const res = await fetch(URL, { signal: controller.signal });

  clearTimeout(timeoutId);

  process.exit(res.ok ? 0 : 1);
} catch (error) {
  console.log('[Health check] ', error);
  process.exit(1);
}
