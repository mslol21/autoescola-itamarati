import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
const scrypt = promisify(scryptCallback);
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const hash = await scrypt(password, salt, 64) as Buffer;
  return `scrypt$${salt}$${hash.toString('hex')}`;
}
export async function verifyPassword(password: string, encoded: string): Promise<boolean> {
  const match = /^scrypt\$([a-f0-9]{32})\$([a-f0-9]{128})$/.exec(encoded);
  if (!match || password.length > 128) return false;
  const actual = await scrypt(password, match[1], 64) as Buffer;
  return timingSafeEqual(actual, Buffer.from(match[2], 'hex'));
}
