import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Esta ruta recibe la respuesta de Mercado Pago después de que el usuario autoriza tu app
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state'); // Aquí pasaremos el ID del usuario/tienda

  if (!code) {
    return NextResponse.redirect(new URL('/crear-tienda?error=no_code', request.url));
  }

  try {
    // 1. Intercambiar el "code" por el "access_token" real usando el Client ID y Secret tuyos
    const response = await fetch('https://api.mercadopago.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_secret: process.env.MERCADOPAGO_CLIENT_SECRET || '',
        client_id: process.env.MERCADOPAGO_CLIENT_ID || '',
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/mp/callback`
      })
    });

    const data = await response.json();

    if (data.access_token && state) {
      // 2. Guardar el access_token en la tienda del usuario en Supabase
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      await supabase
        .from('stores')
        .update({ mp_access_token: data.access_token })
        .eq('owner_id', state);
        
      return NextResponse.redirect(new URL('/dashboard?success=mp_connected', request.url));
    }

    return NextResponse.redirect(new URL('/dashboard?error=mp_failed', request.url));
  } catch (error) {
    return NextResponse.redirect(new URL('/dashboard?error=server_error', request.url));
  }
}
