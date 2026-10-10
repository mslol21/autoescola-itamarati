import { getSupabase } from '@/lib/supabase';
import { verifyPassword } from '@/lib/passwords';
import { AUTH_COOKIE_NAME, cookieOptions, createSession } from '@/lib/auth';
import { assertSameOrigin, handle, json, readJson } from '@/lib/http';
import { loginSchema } from '@/lib/validation';
import { rateLimit } from '@/lib/rate-limit';
export async function POST(request: Request) { return handle(async () => {
  assertSameOrigin(request);
  const { username, password } = loginSchema.parse(await readJson(request, 2048));
  await rateLimit(request, 'login-ip', 5, 900);
  await rateLimit(request, 'login-global', 30, 900, true);
  const { data: admin, error } = await getSupabase().from('admin_users').select('id,username,password_hash').eq('username', username.toLowerCase()).maybeSingle();
  if (error) throw new Error('ADMIN_READ_FAILED');
  // Valid dummy hash keeps unknown-user and wrong-password work comparable.
  const dummy = 'scrypt$' + '0'.repeat(32) + '$' + '0'.repeat(128);
  const valid = await verifyPassword(password, admin?.password_hash || dummy);
  if (!valid || !admin) return json({ error: 'Credenciais inválidas.' },401);
  const token = await createSession(admin.id, admin.password_hash);
  const response = json({ success: true, message: 'Autenticado com sucesso.' });
  response.cookies.set(AUTH_COOKIE_NAME, token, cookieOptions);
  return response;
}); }
