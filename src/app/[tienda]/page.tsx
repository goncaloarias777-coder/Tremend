import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { ShoppingCart, Search, Menu, Instagram, Facebook, AlertCircle, Package } from 'lucide-react';
import Link from 'next/link';

export default async function TiendaPublicaPage({ params }: { params: { tienda: string } }) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
  );

  // Buscar la tienda por el slug
  const { data: store, error: storeError } = await supabase.from('stores').select('*').eq('slug', params.tienda).single();

  if (storeError || !store) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <AlertCircle className="w-16 h-16 text-slate-300 mb-4" />
        <h1 className="text-2xl font-bold text-slate-700">Tienda no encontrada</h1>
        <p className="text-slate-500 mt-2">La URL no existe o fue eliminada.</p>
      </div>
    );
  }

  // Buscar los productos de esta tienda
  const { data: productos } = await supabase.from('products').select('*').eq('store_id', store.id).order('created_at', { ascending: false });
  
  return (
    <div className="min-h-screen bg-slate-50 font-sans" style={{ '--color-brand': store.theme_color } as React.CSSProperties}>
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Menu className="w-6 h-6 text-slate-600 sm:hidden cursor-pointer" />
              <h1 className="text-2xl font-black tracking-tighter" style={{ color: store.theme_color }}>{store.store_name}</h1>
            </div>
            <div className="hidden sm:flex items-center bg-slate-100 rounded-full px-4 py-2 w-1/3 border border-slate-200">
              <Search className="w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Buscar productos..." className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full outline-none text-slate-700" />
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-slate-600 hover:text-slate-900 transition-colors">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white transform translate-x-1/4 -translate-y-1/4 rounded-full" style={{ backgroundColor: store.theme_color }}>0</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="text-white py-20 px-4 text-center" style={{ backgroundColor: store.theme_color }}>
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">{store.store_name}</h2>
        <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">{store.description || 'Explora nuestro catálogo exclusivo.'}</p>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-2xl font-bold text-slate-900 mb-8">Nuestros Productos</h3>
        
        {!productos || productos.length === 0 ? (
          <p className="text-slate-500 text-center py-10">Aún no hay productos disponibles.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {productos.map((prod) => (
              <div key={prod.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
                <div className="h-64 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                  {prod.image_url ? (
                    <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <Package className="w-12 h-12 text-slate-300" />
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h4 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">{prod.name}</h4>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="text-xl font-black text-slate-900">${prod.price}</span>
                    <button className="text-white p-2.5 rounded-xl shadow-md transition-opacity hover:opacity-90" style={{ backgroundColor: store.theme_color }}>
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
