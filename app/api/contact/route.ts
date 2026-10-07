import { NextResponse } from 'next/server';
import { saveLeadToSupabase } from '@/lib/supabase-sync';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, service, message } = body;

    if (!name || (!phone && !email)) {
      return NextResponse.json(
        { error: 'Por favor, informe seu nome e pelo menos um canal de contato (telefone ou e-mail).' },
        { status: 400 }
      );
    }

    // Persist lead directly into Supabase contact_leads table
    await saveLeadToSupabase({ name, phone, email, service, message });
    console.log(`[NOVO CONTATO RECEBIDO] Nome: ${name} | Tel: ${phone} | E-mail: ${email} | Interesse: ${service}`);

    return NextResponse.json({
      success: true,
      message: 'Mensagem recebida com sucesso! Nossa equipe entrará em contato em breve.',
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    return NextResponse.json(
      { error: 'Erro ao enviar mensagem. Tente novamente ou use nosso WhatsApp.' },
      { status: 500 }
    );
  }
}
