import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isUserAdmin } from '@/lib/auth';
import { Course } from '@/lib/types';

export async function GET() {
  const courses = db.getCourses(false);
  return NextResponse.json(courses);
}

export async function POST(request: Request) {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Course;
    if (!body.title || !body.slug) {
      return NextResponse.json(
        { error: 'Título e slug são obrigatórios.' },
        { status: 400 }
      );
    }

    if (!body.id) {
      body.id = `crs-${Date.now()}`;
    }

    const saved = db.saveCourse(body);
    return NextResponse.json({ success: true, course: saved });
  } catch (error) {
    console.error('Error saving course:', error);
    return NextResponse.json({ error: 'Erro ao salvar curso.' }, { status: 500 });
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

    const deleted = db.deleteCourse(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json({ error: 'Erro ao excluir curso.' }, { status: 500 });
  }
}
