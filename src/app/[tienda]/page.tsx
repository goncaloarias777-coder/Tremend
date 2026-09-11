import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { AlertCircle } from 'lucide-react';
import Storefront from './Storefront';

export default async function TiendaPublicaPage({ params }: { params: Promise<{ tienda: string }> }) {
  const { tienda } = await params;
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
  );

  const { data: store, error: storeError } = await supabase.from('stores').select('*').eq('slug', tienda).single();

  if (storeError || !store) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <AlertCircle className="w-16 h-16 text-slate-300 mb-4" />
        <h1 className="text-2xl font-bold text-slate-700">Tienda no encontrada</h1>
      </div>
    );
  }

  // Validar si la suscripción del dueño está suspendida
  if (store.subscription_status === 'suspended') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4 animate-bounce" />
        <h1 className="text-3xl font-bold mb-2">Tienda Temporalmente Suspendida</h1>
        <p className="text-slate-400 max-w-md">Esta tienda se encuentra fuera de línea por falta de pago de la suscripción mensual de su creador.</p>
      </div>
    );
  }

  const { data: productos } = await supabase.from('products').select('*').eq('store_id', store.id).order('created_at', { ascending: false });
  
  return <Storefront store={store} productos={productos || []} />;
}
