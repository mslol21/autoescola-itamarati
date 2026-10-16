import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import { isUserAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { galleryMediaVisibility, getMediaClient, MEDIA_BUCKET } from '@/lib/gallery-storage';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
const headers = { 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' };
const types: Record<string, string> = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif' };

export async function GET(_request: Request, { params }: { params: { file: string } }) {
  const name = params.file;
  const type = types[path.extname(name || '').toLowerCase()];
  if (!name || !/^[a-zA-Z0-9_-][a-zA-Z0-9_.-]*$/.test(name) || !type) return new NextResponse('Not found', { status: 404, headers });
  try {
    if (!(await isUserAdmin())) {
      const url = `/api/media/${name}`;
      const visibility = await galleryMediaVisibility(url);
      // Explicit withdrawal of consent takes precedence over any other reference.
      const elsewhere = visibility === 'unreferenced' && (
        db.getHeroConfig().heroImageUrl === url ||
        db.getNewsArticles({ onlyPublished: true }).some(item => item.coverImage === url) ||
        db.getTestimonials(true).some(item => item.avatarUrl === url)
      );
      if (visibility !== 'public' && !elsewhere) return new NextResponse('Not found', { status: 404, headers });
    }
    const { data, error } = await getMediaClient().storage.from(MEDIA_BUCKET).download(name);
    if (!error && data) return new NextResponse(await data.arrayBuffer(), { headers: { ...headers, 'Content-Type': type } });
    if (error && !['400', '404'].includes(String((error as { statusCode?: string }).statusCode))) {
      return new NextResponse('Image unavailable', { status: 503, headers });
    }
    // Existing self-hosted files remain readable; new uploads never use local disk.
    try {
      const file = await fs.readFile(path.join(process.cwd(), 'data', 'uploads', name));
      return new NextResponse(file, { headers: { ...headers, 'Content-Type': type } });
    } catch { return new NextResponse('Not found', { status: 404, headers }); }
  } catch { return new NextResponse('Image unavailable', { status: 503, headers }); }
}
