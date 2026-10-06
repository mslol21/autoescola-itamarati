import { NextResponse } from 'next/server';

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

    // In a production server, this could dispatch an email or trigger a webhook.
    // For this self-contained platform, we record and validate the lead.
    console.log(`[NOVO CONTATO RECEBIDO] Nome: ${name} | Tel: ${phone} | E-mail: ${email} | Interesse: ${service} | Msg: ${message}`);

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
