import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isUserAdmin } from '@/lib/auth';
import { GalleryItem } from '@/lib/types';

export async function GET() {
  const isAdmin = await isUserAdmin();
  // If admin, return all items including those without authorization
  // If public or not authenticated, return only authorized
  const items = db.getGalleryItems({ onlyAuthorized: !isAdmin });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as GalleryItem;
    if (!body.title || !body.imageUrl) {
      return NextResponse.json(
        { error: 'Título e URL da imagem são obrigatórios.' },
        { status: 400 }
      );
    }

    if (!body.id) {
      body.id = `gal-${Date.now()}`;
    }
    if (!body.createdAt) {
      body.createdAt = new Date().toISOString().split('T')[0];
    }
    if (typeof body.autorizadoUsoImagem !== 'boolean') {
      body.autorizadoUsoImagem = false; // Default to false until explicitly authorized!
    }

    const saved = db.saveGalleryItem(body);
    return NextResponse.json({ success: true, item: saved });
  } catch (error) {
    console.error('Error saving gallery item:', error);
    return NextResponse.json({ error: 'Erro ao salvar item na galeria.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório.' }, { status: 400 });
    }

    const deleted = db.deleteGalleryItem(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    return NextResponse.json({ error: 'Erro ao excluir item da galeria.' }, { status: 500 });
  }
}
