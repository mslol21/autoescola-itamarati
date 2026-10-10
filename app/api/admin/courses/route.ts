import { randomUUID } from 'node:crypto';
import { db } from '@/lib/db';
import { handle, json, readJson, requireAdmin } from '@/lib/http';
import { courseSchema, idSchema } from '@/lib/validation';
export const dynamic = 'force-dynamic';
export async function GET() { return handle(async () => {
  await requireAdmin();
  return json(await db.getCourses(false));
}); }
export async function POST(request: Request) { return handle(async () => {
  await requireAdmin(request);
  const body = courseSchema.parse(await readJson(request));
  const item = { ...body, id: body.id || randomUUID() };
  const saved = await db.saveCourse(item);
  return json({ success: true, course: saved });
}); }
export async function DELETE(request: Request) { return handle(async () => {
  await requireAdmin(request);
  const id = idSchema.parse(new URL(request.url).searchParams.get('id'));
  const deleted = await db.deleteCourse(id);
  return deleted ? json({ success: true }) : json({ error: 'Registro não encontrado.' },404);
}); }
