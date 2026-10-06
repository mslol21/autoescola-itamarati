import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Usuário e senha são obrigatórios.' },
        { status: 400 }
      );
    }

    const isValid = db.verifyAdminPassword(password);
    if (!isValid || username.trim().toLowerCase() !== 'admin') {
      return NextResponse.json(
        { error: 'Credenciais inválidas. Verifique seu usuário e senha.' },
        { status: 401 }
      );
    }

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
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro interno ao realizar login.' },
      { status: 500 }
    );
  }
}
