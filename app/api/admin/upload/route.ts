import { NextResponse } from 'next/server';
import { isUserAdmin } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB

export async function POST(request: Request) {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado.' },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Formato de arquivo inválido (${file.type}). Use JPG, PNG, WebP ou GIF.` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'O arquivo excede o limite máximo permitido de 8MB.' },
        { status: 400 }
      );
    }

    const uploadsDir = path.join(process.cwd(), 'data', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Check the real file signature, not only the MIME type sent by the browser
    const sig = buffer.subarray(0, 12);
    const isJpeg = sig[0] === 0xff && sig[1] === 0xd8 && sig[2] === 0xff;
    const isPng = sig.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    const isGif = sig.subarray(0, 4).toString('latin1') === 'GIF8';
    const isWebp = sig.subarray(0, 4).toString('latin1') === 'RIFF' && sig.subarray(8, 12).toString('latin1') === 'WEBP';
    const ext = isJpeg ? '.jpg' : isPng ? '.png' : isGif ? '.gif' : isWebp ? '.webp' : null;
    if (!ext) {
      return NextResponse.json(
        { error: 'O arquivo não é uma imagem válida. Use JPG, PNG, WebP ou GIF.' },
        { status: 400 }
      );
    }

    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
    const baseName = path.basename(originalName, path.extname(originalName)).slice(0, 60) || 'imagem';
    const fileName = `${baseName}-${Date.now()}${ext}`;
    const filePath = path.join(uploadsDir, fileName);

    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({
      success: true,
      url: `/api/media/${fileName}`,
      fileName,
      size: file.size,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Erro ao processar o upload do arquivo.' },
      { status: 500 }
    );
  }
}
