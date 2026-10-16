import 'server-only';

export function isSameOrigin(request: Request): boolean {
  try {
    const origin = new URL(request.headers.get('origin') || '');
    // Next may rewrite request.url to the internal server hostname behind a proxy.
    // The browser-controlled Origin must match the incoming public Host instead.
    return ['https:', 'http:'].includes(origin.protocol) && origin.host === request.headers.get('host');
  } catch { return false; }
}
