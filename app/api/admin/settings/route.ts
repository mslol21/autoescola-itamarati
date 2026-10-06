import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isUserAdmin } from '@/lib/auth';

export async function GET() {
  const settings = db.getSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updated = db.updateSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Erro ao salvar configurações do site.' }, { status: 500 });
  }
}
