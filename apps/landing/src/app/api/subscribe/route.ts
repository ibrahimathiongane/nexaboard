import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const backendUrl =
      process.env.INTERNAL_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'https://nexaboard-production.up.railway.app';

    const clientIp = request.headers.get('x-forwarded-for') || '';
    const userAgent = request.headers.get('user-agent') || '';

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (clientIp) {
      headers['x-forwarded-for'] = clientIp;
    }
    if (userAgent) {
      headers['user-agent'] = userAgent;
    }

    const res = await fetch(`${backendUrl}/api/v1/beta/subscribe`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => null);

    return NextResponse.json(data, { status: res.status });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Erreur de communication avec le serveur',
      },
      { status: 500 },
    );
  }
}
