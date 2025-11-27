import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import ThemeProvider from './providers/ThemeProvider';
import { logger } from './utils/logger';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);

// Global error handlers to capture uncaught errors and promise rejections
window.addEventListener('error', (ev) => {
  try {
    const ee = ev as ErrorEvent;
    logger.error('Uncaught error', {
      message: ee.message,
      filename: ee.filename,
      lineno: ee.lineno,
      colno: ee.colno,
    });
  } catch (e) {
    console.error('Failed to log error', e);
  }
});

window.addEventListener('unhandledrejection', (ev) => {
  try {
    logger.error('Unhandled promise rejection', { reason: (ev as PromiseRejectionEvent).reason });
  } catch (e) {
    console.error('Failed to log unhandledrejection', e);
  }
});
