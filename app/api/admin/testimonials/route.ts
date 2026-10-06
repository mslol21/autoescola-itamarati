import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isUserAdmin } from '@/lib/auth';
import { Testimonial } from '@/lib/types';

export async function GET() {
  const testimonials = db.getTestimonials(false);
  return NextResponse.json(testimonials);
}

export async function POST(request: Request) {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Testimonial;
    if (!body.author || !body.text) {
      return NextResponse.json(
        { error: 'Nome do autor e depoimento são obrigatórios.' },
        { status: 400 }
      );
    }

    if (!body.id) {
      body.id = `test-${Date.now()}`;
    }

    const saved = db.saveTestimonial(body);
    return NextResponse.json({ success: true, testimonial: saved });
  } catch (error) {
    console.error('Error saving testimonial:', error);
    return NextResponse.json({ error: 'Erro ao salvar depoimento.' }, { status: 500 });
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

    const deleted = db.deleteTestimonial(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json({ error: 'Erro ao excluir depoimento.' }, { status: 500 });
  }
}
