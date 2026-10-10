import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getSupabase } from '@/lib/supabase';
import { getAdminSession } from '@/lib/auth';
import { handle, HttpError } from '@/lib/http';
import { isPublicMedia, MEDIA_BUCKET } from '@/lib/media';
export const dynamic = 'force-dynamic';
export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  return handle(async () => {
    const { file } = await params;
    if (!/^[a-zA-Z0-9_-]+\.(?:webp|jpg|jpeg|png|gif)$/.test(file)) throw new HttpError(404, 'Não encontrado.');
    const url = `/api/media/${file}`;
    if (!await isPublicMedia(url) && !await getAdminSession()) throw new HttpError(404, 'Não encontrado.');
    let bytes: Uint8Array;
    let mime = 'image/webp';
    if (/^insta-\d{2}\.jpg$/.test(file)) {
      try { bytes = new Uint8Array(await readFile(path.join(process.cwd(), 'data', 'legacy-media', file))); mime = 'image/jpeg'; }
      catch { throw new HttpError(404, 'Não encontrado.'); }
    } else {
      const { data, error } = await getSupabase().storage.from(MEDIA_BUCKET).download(file);
      if (error || !data) throw new HttpError(404, 'Não encontrado.');
      bytes = new Uint8Array(await data.arrayBuffer());
      mime = ({ jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp' } as Record<string,string>)[file.split('.').pop()!] || mime;
    }
    return new Response(bytes as BodyInit, { headers: { 'Content-Type': mime, 'Content-Length': String(bytes.length), 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' } });
  });
}
