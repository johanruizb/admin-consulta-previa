// Sentry disabled - uncomment to re-enable
// import * as Sentry from '@sentry/nextjs';

export async function register() {
  // Sentry instrumentation disabled
  // Uncomment to re-enable:
  // if (process.env.NEXT_RUNTIME === 'nodejs') {
  //   await import('./sentry.server.config');
  // }
  //
  // if (process.env.NEXT_RUNTIME === 'edge') {
  //   await import('./sentry.edge.config');
  // }
}

// export const onRequestError = Sentry.captureRequestError;
