import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { ShoppingCart, Search, Menu, Instagram, Facebook, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default async function TiendaPublicaPage({ params }: { params: { tienda: string } }) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
  );

  // Buscar la tienda por el slug
  const { data: store, error } = await supabase
    .from('stores')
    .select('*')
    .eq('slug', params.tienda)
    .single();

  if (error || !store) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <AlertCircle className="w-16 h-16 text-slate-300 mb-4" />
        <h1 className="text-2xl font-bold text-slate-700">Tienda no encontrada</h1>
        <p className="text-slate-500 mt-2">La URL /{params.tienda} no existe o fue eliminada.</p>
        <Link href="/" className="mt-6 text-blue-600 hover:underline">Volver a Tremend</Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50 font-sans" style={{ '--color-brand': store.theme_color } as React.CSSProperties}>
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Menu className="w-6 h-6 text-slate-600 sm:hidden cursor-pointer" />
              <h1 className="text-2xl font-black text-slate-900 tracking-tighter" style={{ color: store.theme_color }}>{store.store_name}</h1>
            </div>
            <div className="hidden sm:flex items-center bg-slate-100 rounded-full px-4 py-2 w-1/3 border border-slate-200">
              <Search className="w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Buscar productos..." className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full outline-none text-slate-700" />
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-slate-600 hover:text-slate-900 transition-colors">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white transform translate-x-1/4 -translate-y-1/4 rounded-full shadow-sm" style={{ backgroundColor: store.theme_color }}>0</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="text-white py-20 px-4 text-center" style={{ backgroundColor: store.theme_color }}>
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">{store.store_name}</h2>
        <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">{store.description || 'Bienvenido a nuestra tienda oficial.'}</p>
      </div>

      {/* Grilla temporal (En el futuro se leerán de la tabla productos) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-2xl font-bold text-slate-900 mb-8">Nuestros Productos</h3>
        <p className="text-slate-500 text-center py-10">Aún no hay productos subidos en esta tienda.</p>
      </main>

      <footer className="bg-white border-t border-slate-200 mt-12 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-xl font-black text-slate-900 mb-4">{store.store_name}</h2>
          <p className="text-slate-500 text-sm">© 2026 {store.store_name}. Todos los derechos reservados.</p>
          <div className="mt-4 inline-flex items-center gap-2 text-xs text-slate-400 font-medium px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
            <span>Powered by</span><span className="font-bold text-slate-700">Tremend</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
