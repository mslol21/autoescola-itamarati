import { getSupabase } from '@/lib/supabase';
import { AUTH_COOKIE_NAME, cookieOptions, createSession } from '@/lib/auth';
import { hashPassword, verifyPassword } from '@/lib/passwords';
import { handle, json, readJson, requireAdmin } from '@/lib/http';
import { passwordSchema } from '@/lib/validation';
import { rateLimit } from '@/lib/rate-limit';
export async function POST(request: Request) { return handle(async () => {
  const session = await requireAdmin(request);
  const { currentPassword, newPassword } = passwordSchema.parse(await readJson(request, 2048));
  await rateLimit(request, 'password-change', 5, 900);
  const client = getSupabase();
  const { data: admin, error } = await client.from('admin_users').select('password_hash').eq('id',session.id).single();
  if (error) throw new Error('ADMIN_READ_FAILED');
  if (!await verifyPassword(currentPassword, admin.password_hash)) return json({ error: 'A senha atual informada está incorreta.' },400);
  const hash = await hashPassword(newPassword);
  const { data: changed, error: updateError } = await client.from('admin_users').update({ password_hash: hash, updated_at: new Date().toISOString() }).eq('id', session.id).eq('password_hash',admin.password_hash).select('id');
  if (updateError || !changed?.length) throw new Error('PASSWORD_WRITE_FAILED');
  // credential_version immediately invalidates every old session, even if cleanup fails.
  await client.from('admin_sessions').delete().eq('admin_id',session.id);
  const token = await createSession(session.id, hash);
  const response = json({ success: true, message: 'Senha administrativa atualizada com sucesso!' });
  response.cookies.set(AUTH_COOKIE_NAME,token,cookieOptions);
  return response;
}); }
