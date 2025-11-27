/* A small client-side logger that prints to console and optionally POSTS logs to a server endpoint.
   It is safe to call from anywhere and will never throw. Enable server posting by setting
   VITE_LOGGING_ENDPOINT in your frontend env (e.g. .env).
*/
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Vite exposes environment variables on import.meta.env
const LOGGING_ENDPOINT =
  (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_LOGGING_ENDPOINT || '';
const ENABLE_SERVER = !!String(LOGGING_ENDPOINT).trim();

function safeStringify(obj: unknown) {
  try {
    return typeof obj === 'string' ? obj : JSON.stringify(obj);
  } catch {
    return String(obj);
  }
}

async function sendToServer(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  if (!ENABLE_SERVER) return;
  const payload = JSON.stringify({ ts: new Date().toISOString(), level, message, meta });
  try {
    // Prefer sendBeacon for reliability on page unload
    if (navigator && 'sendBeacon' in navigator && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon(LOGGING_ENDPOINT, blob);
      return;
    }
    // Fallback to fetch with keepalive when available. Cast options to any to avoid TS complaints.
    const fetchOpts = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      // keepalive is supported in modern browsers
      keepalive: true,
    } as unknown as RequestInit;
    await fetch(LOGGING_ENDPOINT, fetchOpts);
  } catch (e) {
    // swallow errors - logger should not crash the app
    console.warn('logger: failed to send logs to server', e);
  }
}

export const logger = {
  debug: (message: string, meta?: Record<string, unknown>) => {
    console.debug('[DEBUG]', message, meta ?? '');
    void sendToServer('debug', message, meta);
  },
  info: (message: string, meta?: Record<string, unknown>) => {
    console.info('[INFO]', message, meta ?? '');
    void sendToServer('info', message, meta);
  },
  warn: (message: string, meta?: Record<string, unknown>) => {
    console.warn('[WARN]', message, meta ?? '');
    void sendToServer('warn', message, meta);
  },
  error: (message: string, meta?: Record<string, unknown>) => {
    console.error('[ERROR]', message, meta ?? '');
    void sendToServer('error', message, meta);
  },
  // helper that returns a safe string representation
  stringify: safeStringify,
};

export default logger;
