import { db } from '@/lib/db';
import { handle, json, readJson, requireAdmin } from '@/lib/http';
import { settingsSchema } from '@/lib/validation';
export const dynamic = 'force-dynamic';
export async function GET() { return handle(async () => { await requireAdmin(); return json(await db.getSettings()); }); }
export async function PUT(request: Request) { return handle(async () => {
  await requireAdmin(request);
  const body = settingsSchema.parse(await readJson(request));
  return json({ success: true, settings: await db.updateSettings(body) });
}); }
