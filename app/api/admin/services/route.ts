import { randomUUID } from 'node:crypto';
import { db } from '@/lib/db';
import { handle, json, readJson, requireAdmin } from '@/lib/http';
import { serviceSchema, idSchema } from '@/lib/validation';
export const dynamic = 'force-dynamic';
export async function GET() { return handle(async () => {
  await requireAdmin();
  return json(await db.getServices(false));
}); }
export async function POST(request: Request) { return handle(async () => {
  await requireAdmin(request);
  const body = serviceSchema.parse(await readJson(request));
  const item = { ...body, id: body.id || randomUUID() };
  const saved = await db.saveService(item);
  return json({ success: true, service: saved });
}); }
export async function DELETE(request: Request) { return handle(async () => {
  await requireAdmin(request);
  const id = idSchema.parse(new URL(request.url).searchParams.get('id'));
  const deleted = await db.deleteService(id);
  return deleted ? json({ success: true }) : json({ error: 'Registro não encontrado.' },404);
}); }
