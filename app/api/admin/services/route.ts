import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isUserAdmin } from '@/lib/auth';
import { Service } from '@/lib/types';

export async function GET() {
  const services = db.getServices(false);
  return NextResponse.json(services);
}

export async function POST(request: Request) {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Service;
    if (!body.title || !body.slug) {
      return NextResponse.json(
        { error: 'Título e slug são obrigatórios.' },
        { status: 400 }
      );
    }

    if (!body.id) {
      body.id = `srv-${Date.now()}`;
    }

    const saved = db.saveService(body);
    return NextResponse.json({ success: true, service: saved });
  } catch (error) {
    console.error('Error saving service:', error);
    return NextResponse.json({ error: 'Erro ao salvar serviço.' }, { status: 500 });
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

    const deleted = db.deleteService(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ error: 'Erro ao excluir serviço.' }, { status: 500 });
  }
}
