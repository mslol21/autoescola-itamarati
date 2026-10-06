import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isUserAdmin } from '@/lib/auth';

export async function POST(request: Request) {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Senha atual e nova senha são obrigatórias.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'A nova senha deve ter no mínimo 6 caracteres.' },
        { status: 400 }
      );
    }

    if (!db.verifyAdminPassword(currentPassword)) {
      return NextResponse.json(
        { error: 'A senha atual informada está incorreta.' },
        { status: 400 }
      );
    }

    const success = db.changeAdminPassword(newPassword);
    if (!success) {
      return NextResponse.json(
        { error: 'Falha ao salvar a nova senha no banco de dados.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Senha administrativa atualizada com sucesso!',
    });
  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json(
      { error: 'Erro interno ao alterar senha.' },
      { status: 500 }
    );
  }
}
