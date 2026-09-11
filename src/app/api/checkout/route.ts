import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, store_id } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'El carrito está vacío o no es válido' }, { status: 400 });
    }

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json({ error: 'Falta configurar MERCADOPAGO_ACCESS_TOKEN en las variables de entorno de Vercel' }, { status: 500 });
    }

    // Inicializar cliente de Mercado Pago v2/v3
    const client = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);

    // Mapear y asegurar que los tipos sean estrictamente correctos (números para precios y cantidades)
    const formattedItems = items.map((item: any) => ({
      id: String(item.id || 'prod_1'),
      title: String(item.name || 'Producto'),
      quantity: Number(item.cantidad || 1),
      unit_price: Number(item.price || 0),
      currency_id: 'ARS'
    }));

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tremend-hifb.vercel.app';

    // Crear la preferencia en Mercado Pago
    const result = await preference.create({
      body: {
        items: formattedItems,
        back_urls: {
          success: `${baseUrl}/pago/exito`,
          failure: `${baseUrl}/pago/fallo`,
          pending: `${baseUrl}/pago/pendiente`,
        },
        auto_return: 'approved',
        external_reference: String(store_id || '')
      }
    });

    const initPoint = result.init_point || (result as any).body?.init_point;

    if (!initPoint) {
      throw new Error('No se pudo generar el link de pago de Mercado Pago');
    }

    return NextResponse.json({ init_point: initPoint });

  } catch (error: any) {
    console.error('Error detallado en Mercado Pago Checkout:', error);
    return NextResponse.json({ 
      error: error.message || 'Error desconocido al procesar con Mercado Pago' 
    }, { status: 400 });
  }
}
