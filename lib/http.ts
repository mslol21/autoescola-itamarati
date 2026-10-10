import 'server-only';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { getAdminSession } from './auth';

export class HttpError extends Error { constructor(public status: number, message: string) { super(message); } }
export function assertSameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  const expected = process.env.APP_ORIGIN || new URL(request.url).origin;
  if (!origin || origin !== new URL(expected).origin || request.headers.get('sec-fetch-site') === 'cross-site') {
    throw new HttpError(403, 'Origem da solicitação não autorizada.');
  }
}
export async function requireAdmin(request?: Request) {
  if (request) assertSameOrigin(request);
  const session = await getAdminSession();
  if (!session) throw new HttpError(401, 'Não autorizado.');
  return session;
}
export async function readJson(request: Request, limit = 256 * 1024): Promise<unknown> {
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) throw new HttpError(415, 'Envie dados em formato JSON.');
  return JSON.parse(await readBody(request, limit));
}
export async function readBody(request: Request, limit: number) {
  if (Number(request.headers.get('content-length')) > limit) throw new HttpError(413, 'Solicitação muito grande.');
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, 'Solicitação vazia.');
  let total = 0; const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { value, done } = await reader.read(); if (done) break;
      total += value.length;
      if (total > limit) { await reader.cancel(); throw new HttpError(413, 'Solicitação muito grande.'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  return Buffer.concat(chunks).toString('utf8');
}
export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: { 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' } });
}
export async function handle(action: () => Promise<Response>): Promise<Response> {
  try { return await action(); }
  catch (error) {
    if (error instanceof HttpError) return json({ error: error.message }, error.status);
    if (error instanceof ZodError || error instanceof SyntaxError) return json({ error: 'Dados inválidos. Revise os campos e tente novamente.' }, 400);
    // Do not log payloads, PII, credentials or database error details.
    console.error('Request failed', { code: 'SERVER_OPERATION_FAILED' });
    return json({ error: 'Não foi possível concluir a operação. Tente novamente ou entre em contato pelo WhatsApp.' }, 503);
  }
}
