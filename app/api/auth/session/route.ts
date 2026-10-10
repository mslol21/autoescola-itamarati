import { getAdminSession } from '@/lib/auth';
import { handle, json } from '@/lib/http';
export const dynamic = 'force-dynamic';
export async function GET() { return handle(async () => {
  const session = await getAdminSession();
  return json(session ? { authenticated: true, username: session.username, role: session.role } : { authenticated: false });
}); }
