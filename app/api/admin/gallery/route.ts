import { isSameOrigin } from '@/lib/same-origin';
import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { isUserAdmin } from '@/lib/auth';
import type { GalleryItem } from '@/lib/types';

export const dynamic = 'force-dynamic';
const headers = { 'Cache-Control': 'private, no-store' };
const categories = ['conquistas', 'equipe', 'estrutura', 'aulas', 'eventos'];
const failure = () => NextResponse.json({ error: 'Não foi possível acessar a galeria no banco de dados. Tente novamente.' }, { status: 503, headers });

export async function GET() {
  try {
    const items = await db.getGalleryItems({ onlyAuthorized: !(await isUserAdmin()) });
    return NextResponse.json(items, { headers });
  } catch { return failure(); }
}

export async function POST(request: Request) {
  if (!(await isUserAdmin())) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401, headers });
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Origem inválida.' }, { status: 403, headers });
  let body: GalleryItem;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400, headers }); }
  if (!body || typeof body.title !== 'string' || !body.title.trim() || body.title.length > 200 ||
      typeof body.imageUrl !== 'string' || body.imageUrl.length > 2048 ||
      !/^(\/images\/[a-zA-Z0-9/_ .-]+|\/api\/media\/[a-zA-Z0-9_.-]+|https:\/\/[^\s]+)$/.test(body.imageUrl) ||
      !categories.includes(body.category) ||
      (body.id !== undefined && (typeof body.id !== 'string' || body.id.length > 100 || !/^[a-zA-Z0-9_-]*$/.test(body.id))) ||
      !['categoryLabel', 'caption', 'studentName', 'categoryBadge', 'createdAt'].every(key => {
        const value = body[key as keyof GalleryItem];
        return value === undefined || (typeof value === 'string' && value.length <= 2000);
      }) || (body.order !== undefined && (!Number.isInteger(body.order) || Math.abs(body.order) > 1000000))) {
    return NextResponse.json({ error: 'Verifique o título, a imagem, a categoria e a ordem da foto.' }, { status: 400, headers });
  }
  try {
    const saved = await db.saveGalleryItem({
      ...body, id: body.id || `gal-${randomUUID()}`, title: body.title.trim(),
      categoryLabel: body.categoryLabel || '', caption: body.caption || '', order: body.order ?? 0,
      createdAt: body.createdAt || new Date().toISOString().split('T')[0],
      autorizadoUsoImagem: body.autorizadoUsoImagem === true, isFeaturedHome: body.isFeaturedHome === true,
    });
    revalidatePath('/'); revalidatePath('/galeria');
    return NextResponse.json({ success: true, item: saved }, { headers });
  } catch { return failure(); }
}

export async function DELETE(request: Request) {
  if (!(await isUserAdmin())) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401, headers });
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Origem inválida.' }, { status: 403, headers });
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID é obrigatório.' }, { status: 400, headers });
  try {
    await db.deleteGalleryItem(id);
    revalidatePath('/'); revalidatePath('/galeria');
    return NextResponse.json({ success: true }, { headers });
  } catch { return failure(); }
}
