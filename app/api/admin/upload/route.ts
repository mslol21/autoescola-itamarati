import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { getSupabase } from '@/lib/supabase';
import { handle, HttpError, json, requireAdmin } from '@/lib/http';
import { rateLimit } from '@/lib/rate-limit';
import { MEDIA_BUCKET } from '@/lib/media';

const MAX = 8 * 1024 * 1024;
export async function POST(request: Request) { return handle(async () => {
  await requireAdmin(request);
  await rateLimit(request, 'uploads', 30, 600);
  // Bound streamed multipart bytes before formData allocates the whole request.
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, 'Nenhum arquivo enviado.');
  const chunks: Uint8Array[] = []; let size = 0;
  try {
    while (true) {
      const result = await reader.read(); if (result.done) break;
      size += result.value.length;
      if (size > MAX + 65536) { await reader.cancel(); throw new HttpError(413, 'O arquivo excede o limite de 8MB.'); }
      chunks.push(result.value);
    }
  } finally { reader.releaseLock(); }
  let form: FormData;
  try { form = await new Response(Buffer.concat(chunks), { headers: { 'Content-Type': request.headers.get('content-type') || '' } }).formData(); }
  catch { throw new HttpError(400, 'Upload inválido.'); }
  const file = form.get('file');
  if (!file || typeof file === 'string' || file.size === 0 || file.size > MAX) throw new HttpError(400, 'Envie uma imagem de até 8MB.');
  let output: Buffer;
  try {
    const input = Buffer.from(await file.arrayBuffer());
    const image = sharp(input, { limitInputPixels: 25000000, animated: false });
    const metadata = await image.metadata();
    if (!['jpeg','png','webp','gif'].includes(metadata.format || '')) throw new Error('INVALID_IMAGE');
    // Decode and re-encode: rejects disguised files, strips EXIF/GPS and executable payloads.
    output = await image.rotate().resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();
  } catch { throw new HttpError(400, 'Imagem inválida ou com dimensões muito grandes.'); }
  const fileName = `${randomUUID()}.webp`;
  const { error } = await getSupabase().storage.from(MEDIA_BUCKET).upload(fileName, output, { contentType: 'image/webp', upsert: false });
  if (error) throw new Error('UPLOAD_FAILED');
  return json({ success: true, url: `/api/media/${fileName}`, fileName, size: output.length });
}); }
