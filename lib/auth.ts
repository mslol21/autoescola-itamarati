import 'server-only';
import { cookies } from 'next/headers';
import { createHash, randomBytes } from 'node:crypto';
import { getSupabase } from './supabase';

export const AUTH_COOKIE_NAME = 'itam_admin_session';
export const SESSION_SECONDS = 8 * 60 * 60;
export const hashToken = (value: string) => createHash('sha256').update(value).digest('hex');
export const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' as const, path: '/', maxAge: SESSION_SECONDS };
export interface SessionData { id: string; username: string; role: 'admin'; tokenHash: string; }
export async function createSession(id: string, passwordHash: string): Promise<string> {
  const token = randomBytes(32).toString('hex');
  const { error } = await getSupabase().from('admin_sessions').insert({
    token_hash: hashToken(token), admin_id: id, credential_version: hashToken(passwordHash),
    expires_at: new Date(Date.now() + SESSION_SECONDS * 1000).toISOString(),
  });
  if (error) throw new Error('SESSION_WRITE_FAILED');
  return token;
}
export async function getAdminSession(): Promise<SessionData | null> {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const supabase = getSupabase();
  const { data: session, error } = await supabase.from('admin_sessions').select('admin_id,credential_version,expires_at').eq('token_hash', hashToken(token)).maybeSingle();
  if (error) throw new Error('SESSION_READ_FAILED');
  if (!session || Date.parse(session.expires_at) <= Date.now() || !Number.isFinite(Date.parse(session.expires_at))) return null;
  const { data: admin, error: adminError } = await supabase.from('admin_users').select('id,username,password_hash').eq('id', session.admin_id).maybeSingle();
  if (adminError) throw new Error('SESSION_READ_FAILED');
  if (!admin || session.credential_version !== hashToken(admin.password_hash)) return null;
  return { id: admin.id, username: admin.username, role: 'admin', tokenHash: hashToken(token) };
}
export async function isUserAdmin(): Promise<boolean> { return Boolean(await getAdminSession()); }
export async function deleteCurrentSession(): Promise<void> {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return;
  const { error } = await getSupabase().from('admin_sessions').delete().eq('token_hash', hashToken(token));
  if (error) throw new Error('SESSION_DELETE_FAILED');
}
