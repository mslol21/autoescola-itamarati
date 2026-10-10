import { AUTH_COOKIE_NAME, cookieOptions, deleteCurrentSession } from '@/lib/auth';
import { assertSameOrigin, handle, json } from '@/lib/http';
export async function POST(request: Request) { return handle(async () => {
  assertSameOrigin(request);
  await deleteCurrentSession();
  const response = json({ success: true, message: 'Desconectado com sucesso.' });
  response.cookies.set(AUTH_COOKIE_NAME, '', { ...cookieOptions, maxAge: 0 });
  return response;
}); }
