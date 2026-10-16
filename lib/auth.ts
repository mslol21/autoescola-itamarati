import { cookies } from 'next/headers';
import crypto from 'crypto';

const AUTH_COOKIE_NAME = 'itam_admin_session';
const SECRET_KEY = process.env.ADMIN_SESSION_SECRET;
function sessionSecret(): string {
  if (!SECRET_KEY || SECRET_KEY.length < 32) throw new Error('ADMIN_SESSION_SECRET_NOT_CONFIGURED');
  return SECRET_KEY;
}

export interface SessionData {
  username: string;
  role: string;
  createdAt: number;
}

export function generateToken(data: SessionData): string {
  const payload = JSON.stringify(data);
  const signature = crypto
    .createHmac('sha256', sessionSecret())
    .update(payload)
    .digest('hex');
  return Buffer.from(`${payload}.${signature}`).toString('base64');
}

export function verifyToken(token: string): SessionData | null {
  try {
    const raw = Buffer.from(token, 'base64').toString('utf-8');
    const [payload, signature] = raw.split('.');
    if (!payload || !signature) return null;

    const expectedSig = crypto
      .createHmac('sha256', sessionSecret())
      .update(payload)
      .digest('hex');

    if (signature.length !== expectedSig.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return null;
    }

    const data = JSON.parse(payload) as SessionData;
    // Session valid for 7 days
    const maxAge = 7 * 24 * 60 * 60 * 1000;
    if (data.role !== 'admin' || !Number.isFinite(data.createdAt) || data.createdAt > Date.now() || Date.now() - data.createdAt > maxAge) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<SessionData | null> {
  const cookieStore = cookies();
  const cookie = cookieStore.get(AUTH_COOKIE_NAME);
  if (!cookie?.value) return null;
  return verifyToken(cookie.value);
}

export async function isUserAdmin(): Promise<boolean> {
  const session = await getAdminSession();
  return session !== null;
}

export { AUTH_COOKIE_NAME };
