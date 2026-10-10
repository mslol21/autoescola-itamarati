import { randomUUID } from 'node:crypto';
import { db } from '@/lib/db';
import { handle, json, readJson, requireAdmin } from '@/lib/http';
import { gallerySchema, idSchema } from '@/lib/validation';
export const dynamic = 'force-dynamic';
export async function GET() { return handle(async () => {
  await requireAdmin();
  return json(await db.getGalleryItems({}));
}); }
export async function POST(request: Request) { return handle(async () => {
  await requireAdmin(request);
  const body = gallerySchema.parse(await readJson(request));
  const today = new Date().toISOString().slice(0,10);
  const item = { ...body, id: body.id || randomUUID(), createdAt: body.createdAt || today };
  const saved = await db.saveGalleryItem(item);
  return json({ success: true, item: saved });
}); }
export async function DELETE(request: Request) { return handle(async () => {
  await requireAdmin(request);
  const id = idSchema.parse(new URL(request.url).searchParams.get('id'));
  const deleted = await db.deleteGalleryItem(id);
  return deleted ? json({ success: true }) : json({ error: 'Registro não encontrado.' },404);
}); }
