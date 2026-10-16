import { isSameOrigin } from '@/lib/same-origin';
import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { isUserAdmin } from '@/lib/auth';
import { getMediaClient, MEDIA_BUCKET } from '@/lib/gallery-storage';

// Leave room for multipart headers below Vercel's request body limit.
const MAX_FILE_SIZE = 4 * 1024 * 1024;
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!(await isUserAdmin())) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: 'Origem inválida.' }, { status: 403 });
  }
  try {
    const reader = request.body?.getReader();
    if (!reader) return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 });
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      while (true) {
        const result = await reader.read();
        if (result.done) break;
        size += result.value.length;
        if (size > MAX_FILE_SIZE + 65536) {
          await reader.cancel();
          return NextResponse.json({ error: 'A imagem deve ter no máximo 4 MB.' }, { status: 413 });
        }
        chunks.push(result.value);
      }
    } finally { reader.releaseLock(); }
    let form: FormData;
    try {
      form = await new Response(Buffer.concat(chunks), {
        headers: { 'Content-Type': request.headers.get('content-type') || '' },
      }).formData();
    } catch { return NextResponse.json({ error: 'Envio inválido.' }, { status: 400 }); }
    const file = form.get('file');
    if (!file || typeof file === 'string' || !file.size || file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Envie uma imagem de até 4 MB.' }, { status: 400 });
    }
    let output: Buffer;
    try {
      const image = sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 25000000, animated: false });
      const metadata = await image.metadata();
      if (!['jpeg', 'png', 'webp', 'gif'].includes(metadata.format || '')) throw new Error('INVALID_IMAGE');
      // Correct phone orientation and strip EXIF/GPS while keeping adequate resolution.
      output = await image.rotate().resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85 }).toBuffer();
    } catch {
      return NextResponse.json({ error: 'Imagem inválida. Use JPG, PNG, WebP ou GIF com até 25 megapixels.' }, { status: 400 });
    }
    const fileName = `${randomUUID()}.webp`;
    const { error } = await getMediaClient().storage.from(MEDIA_BUCKET)
      .upload(fileName, output, { contentType: 'image/webp', upsert: false });
    if (error) throw new Error('STORAGE_WRITE_FAILED');
    return NextResponse.json({ success: true, url: `/api/media/${fileName}`, fileName, size: output.length });
  } catch {
    console.error('Image storage failed');
    return NextResponse.json({ error: 'Não foi possível armazenar a imagem. Tente novamente; se persistir, verifique a configuração do armazenamento.' }, { status: 503 });
  }
}
