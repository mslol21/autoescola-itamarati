import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isUserAdmin } from '@/lib/auth';
import { FaqItem } from '@/lib/types';

export async function GET() {
  const faqs = db.getFaqs(false);
  return NextResponse.json(faqs);
}

export async function POST(request: Request) {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as FaqItem;
    if (!body.question || !body.answer) {
      return NextResponse.json(
        { error: 'Pergunta e resposta são obrigatórias.' },
        { status: 400 }
      );
    }

    if (!body.id) {
      body.id = `faq-${Date.now()}`;
    }

    const saved = db.saveFaq(body);
    return NextResponse.json({ success: true, faq: saved });
  } catch (error) {
    console.error('Error saving FAQ:', error);
    return NextResponse.json({ error: 'Erro ao salvar pergunta frequente.' }, { status: 500 });
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

    const deleted = db.deleteFaq(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return NextResponse.json({ error: 'Erro ao excluir pergunta frequente.' }, { status: 500 });
  }
}
