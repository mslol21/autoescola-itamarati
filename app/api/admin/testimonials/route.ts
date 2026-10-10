import { randomUUID } from 'node:crypto';
import { db } from '@/lib/db';
import { handle, json, readJson, requireAdmin } from '@/lib/http';
import { testimonialSchema, idSchema } from '@/lib/validation';
export const dynamic = 'force-dynamic';
export async function GET() { return handle(async () => {
  await requireAdmin();
  return json(await db.getTestimonials(false));
}); }
export async function POST(request: Request) { return handle(async () => {
  await requireAdmin(request);
  const body = testimonialSchema.parse(await readJson(request));
  const item = { ...body, id: body.id || randomUUID() };
  const saved = await db.saveTestimonial(item);
  return json({ success: true, testimonial: saved });
}); }
export async function DELETE(request: Request) { return handle(async () => {
  await requireAdmin(request);
  const id = idSchema.parse(new URL(request.url).searchParams.get('id'));
  const deleted = await db.deleteTestimonial(id);
  return deleted ? json({ success: true }) : json({ error: 'Registro não encontrado.' },404);
}); }
