import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isUserAdmin } from '@/lib/auth';
import { NewsArticle } from '@/lib/types';

function sanitizeContent(htmlOrMarkdown: string): string {
  if (!htmlOrMarkdown) return '';
  return htmlOrMarkdown
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '');
}

export async function GET(request: Request) {
  const isAdmin = await isUserAdmin();
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('q') || undefined;
  const category = searchParams.get('category') || undefined;

  // Admin gets all articles (drafts, published, archived)
  // Public only gets published articles
  const articles = db.getNewsArticles({
    onlyPublished: !isAdmin,
    search,
    category,
  });

  return NextResponse.json(articles);
}

export async function POST(request: Request) {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as NewsArticle;
    if (!body.title || !body.slug) {
      return NextResponse.json(
        { error: 'Título e slug são obrigatórios.' },
        { status: 400 }
      );
    }

    if (!body.id) {
      body.id = `news-${Date.now()}`;
    }

    const today = new Date().toISOString().split('T')[0];
    if (!body.publishedAt) {
      body.publishedAt = today;
    }
    body.updatedAt = today;

    // Sanitize content
    body.content = sanitizeContent(body.content);
    body.summary = sanitizeContent(body.summary);

    const saved = db.saveNewsArticle(body);
    return NextResponse.json({ success: true, article: saved });
  } catch (error) {
    console.error('Error saving news article:', error);
    return NextResponse.json({ error: 'Erro ao salvar notícia.' }, { status: 500 });
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

    const deleted = db.deleteNewsArticle(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error('Error deleting news article:', error);
    return NextResponse.json({ error: 'Erro ao excluir notícia.' }, { status: 500 });
  }
}
