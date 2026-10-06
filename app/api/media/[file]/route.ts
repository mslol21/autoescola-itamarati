import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Serves images uploaded through /admin. Files live in data/uploads (outside
// /public) because `next start` only serves public files that existed at build time.
export const dynamic = 'force-dynamic';

const TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

export async function GET(_req: Request, { params }: { params: { file: string } }) {
  const name = path.basename(params.file || '');
  const ext = path.extname(name).toLowerCase();
  if (!name || name !== params.file || !TYPES[ext]) {
    return new NextResponse('Not found', { status: 404 });
  }
  const filePath = path.join(process.cwd(), 'data', 'uploads', name);
  if (!fs.existsSync(filePath)) {
    return new NextResponse('Not found', { status: 404 });
  }
  const buf = fs.readFileSync(filePath);
  return new NextResponse(buf, {
    headers: {
      'Content-Type': TYPES[ext],
      'Content-Length': String(buf.length),
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
