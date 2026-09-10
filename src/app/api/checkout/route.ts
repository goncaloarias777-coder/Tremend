import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { items, storeId } = await request.json();
    
    // Conectar a Supabase para buscar las credenciales de la tienda
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    // Obtener el Access Token de Mercado Pago del dueño de esta tienda
    const { data: store } = await supabase
      .from('stores')
      .select('mp_access_token, slug')
      .eq('id', storeId)
      .single();
      
    if (!store || !store.mp_access_token) {
      return NextResponse.json({ error: 'La tienda no tiene Mercado Pago vinculado' }, { status: 400 });
    }

    // Armar los items para Mercado Pago
    const preferenceItems = items.map((item: any) => ({
      title: item.name,
      unit_price: Number(item.price),
      quantity: item.quantity,
      currency_id: 'ARS'
    }));

    // URL de retorno exitoso/fallido a la tienda
    const storeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${store.slug}`;

    // Crear la preferencia directo contra la API de MP usando el token de la tienda
    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${store.mp_access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: preferenceItems,
        back_urls: {
          success: storeUrl,
          failure: storeUrl,
          pending: storeUrl
        },
        auto_return: 'approved'
      })
    });

    const mpResult = await mpResponse.json();

    if (mpResult.id) {
      // Devolver el init_point (La URL de pago de MP)
      return NextResponse.json({ url: mpResult.init_point });
    } else {
      console.error(mpResult);
      return NextResponse.json({ error: 'Fallo al contactar con Mercado Pago' }, { status: 400 });
    }

  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
