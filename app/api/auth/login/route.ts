import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateToken, AUTH_COOKIE_NAME } from '@/lib/auth';

// In-memory rate limiter for login attempts to prevent brute force attacks
const MAX_ATTEMPTS = 5;
const LOCKOUT_PERIOD_MS = 15 * 60 * 1000; // 15 minutes

interface AttemptRecord {
  count: number;
  lastAttempt: number;
}

const loginAttempts = new Map<string, AttemptRecord>();

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

function cleanExpiredAttempts() {
  const now = Date.now();
  loginAttempts.forEach((record, ip) => {
    if (now - record.lastAttempt > LOCKOUT_PERIOD_MS) {
      loginAttempts.delete(ip);
    }
  });
}

export async function POST(request: Request) {
  try {
    cleanExpiredAttempts();
    const clientIp = getClientIp(request);
    const attempt = loginAttempts.get(clientIp);
    const now = Date.now();

    if (attempt && attempt.count >= MAX_ATTEMPTS) {
      const remainingMs = LOCKOUT_PERIOD_MS - (now - attempt.lastAttempt);
      if (remainingMs > 0) {
        const remainingMinutes = Math.ceil(remainingMs / 60000);
        return NextResponse.json(
          {
            error: `Muitas tentativas incorretas. Por segurança, tente novamente em ${remainingMinutes} minuto(s).`,
          },
          { status: 429 }
        );
      } else {
        loginAttempts.delete(clientIp);
      }
    }

    const body = await request.json();
    const { username, password } = body;

    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Usuário e senha são obrigatórios.' },
        { status: 400 }
      );
    }

    const trimmedUser = username.trim().toLowerCase();
    const isValid = db.verifyAdminPassword(password.trim());

    if (!isValid || trimmedUser !== 'admin') {
      // Record failed attempt
      const currentCount = (attempt ? attempt.count : 0) + 1;
      loginAttempts.set(clientIp, { count: currentCount, lastAttempt: now });

      const attemptsLeft = Math.max(0, MAX_ATTEMPTS - currentCount);
      const warning =
        attemptsLeft > 0
          ? `Credenciais inválidas. (${attemptsLeft} tentativa(s) restante(s))`
          : 'Muitas tentativas incorretas. Acesso temporariamente bloqueado por 15 minutos.';

      return NextResponse.json({ error: warning }, { status: 401 });
    }

    // Reset attempts on successful login
    loginAttempts.delete(clientIp);

    const token = generateToken({
      username: 'admin',
      role: 'admin',
      createdAt: Date.now(),
    });

    const response = NextResponse.json({
      success: true,
      message: 'Autenticado com sucesso.',
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro interno ao processar a solicitação.' },
      { status: 500 }
    );
  }
}
