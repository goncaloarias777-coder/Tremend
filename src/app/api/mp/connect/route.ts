import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const clientId = process.env.MERCADOPAGO_CLIENT_ID;
  
  if (!clientId) {
    return NextResponse.json({ error: 'Falta configurar MERCADOPAGO_CLIENT_ID en Vercel' }, { status: 500 });
  }

  const host = request.headers.get('host') || 'tremend-hifb.vercel.app';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const redirectUri = `${protocol}://${host}/api/mp/callback`;

  const mpAuthUrl = `https://auth.mercadopago.com/authorization?client_id=${clientId}&response_type=code&platform_id=mp&redirect_uri=${encodeURIComponent(redirectUri)}`;

  return NextResponse.redirect(mpAuthUrl);
}
