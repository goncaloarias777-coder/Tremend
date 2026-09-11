import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  const host = request.headers.get('host') || 'tremend-hifb.vercel.app';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const redirectUri = `${protocol}://${host}/api/mp/callback`;

  if (error || !code) {
    return NextResponse.redirect(`${protocol}://${host}/dashboard/ajustes?mp_error=auth_failed`);
  }

  try {
    const tokenRes = await fetch('https://api.mercadopago.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.MERCADOPAGO_CLIENT_ID,
        client_secret: process.env.MERCADOPAGO_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('Error token MP:', tokenData);
      return NextResponse.redirect(`${protocol}://${host}/dashboard/ajustes?mp_error=token_failed`);
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('stores')
        .update({
          mercadopago_access_token: tokenData.access_token,
          mercadopago_user_id: String(tokenData.user_id || ''),
        })
        .eq('owner_id', user.id);
    }

    return NextResponse.redirect(`${protocol}://${host}/dashboard/exito?mp=connected`);
  } catch (err) {
    console.error('Excepcion en MP callback:', err);
    return NextResponse.redirect(`${protocol}://${host}/dashboard/ajustes?mp_error=exception`);
  }
}
