import { db } from '@/lib/db';
import { handle, json, readJson, requireAdmin } from '@/lib/http';
import { heroSchema } from '@/lib/validation';
export const dynamic = 'force-dynamic';
export async function GET() { return handle(async () => { await requireAdmin(); return json(await db.getHeroConfig()); }); }
export async function PUT(request: Request) { return handle(async () => {
  await requireAdmin(request);
  const body = heroSchema.parse(await readJson(request));
  return json({ success: true, hero: await db.updateHeroConfig(body) });
}); }
