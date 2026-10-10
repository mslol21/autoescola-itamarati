import 'server-only';
import { createHmac } from 'node:crypto';
import { getSupabase } from './supabase';
import { HttpError } from './http';
export async function rateLimit(request: Request, scope: string, limit: number, seconds: number, global = false) {
  // Only trust the platform-owned header. Other hosts use a shared conservative bucket.
  const ip = process.env.VERCEL ? request.headers.get('x-vercel-forwarded-for') || 'unknown' : 'local';
  const secret = process.env.RATE_LIMIT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) throw new Error('DATABASE_NOT_CONFIGURED');
  const key = createHmac('sha256', secret).update(scope + ':' + (global ? 'global' : ip)).digest('hex');
  const { data, error } = await getSupabase().rpc('consume_request_limit', { p_key: key, p_limit: limit, p_seconds: seconds });
  if (error) throw new Error('RATE_LIMIT_UNAVAILABLE');
  if (data !== true) throw new HttpError(429, 'Muitas tentativas. Aguarde alguns minutos e tente novamente.');
}
