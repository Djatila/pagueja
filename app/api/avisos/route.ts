import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      return NextResponse.json({ error: "Webhook não configurado" }, { status: 500 });
    }

    // O Next.js roda no servidor (backend), então NÃO sofre bloqueio de CORS do navegador
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Erro no n8n" }, { status: res.status });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erro na API de avisos:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
