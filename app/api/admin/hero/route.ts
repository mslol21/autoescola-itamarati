import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isUserAdmin } from '@/lib/auth';

export async function GET() {
  const hero = db.getHeroConfig();
  return NextResponse.json(hero);
}

export async function PUT(request: Request) {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updated = db.updateHeroConfig(body);
    return NextResponse.json({ success: true, hero: updated });
  } catch (error) {
    console.error('Error updating hero config:', error);
    return NextResponse.json({ error: 'Erro ao salvar configuração do Hero.' }, { status: 500 });
  }
}
