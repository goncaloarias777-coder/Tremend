import { ShoppingCart, Search, Menu, Instagram, Facebook } from 'lucide-react';
import Link from 'next/link';

export default function TiendaPublicaPage({ params }: { params: { tienda: string } }) {
  // Aquí conectaremos Supabase usando params.tienda (el slug) para traer los datos reales
  const storeName = params.tienda.replace(/-/g, ' ').toUpperCase();
  
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header de la Tienda */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Menu className="w-6 h-6 text-slate-600 sm:hidden cursor-pointer" />
              <h1 className="text-2xl font-black text-slate-900 tracking-tighter">{storeName}</h1>
            </div>
            <div className="hidden sm:flex items-center bg-slate-100 rounded-full px-4 py-2 w-1/3 border border-slate-200">
              <Search className="w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Buscar productos..." className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full outline-none text-slate-700" />
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-slate-600 hover:text-slate-900 transition-colors">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-blue-600 rounded-full shadow-sm">0</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-blue-600 text-white py-20 px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Nueva Colección</h2>
        <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">Descubre nuestros productos exclusivos. Calidad garantizada al mejor precio.</p>
        <button className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-slate-50 transition-colors shadow-lg">Ver Catálogo</button>
      </div>

      {/* Grilla de Productos */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-8">
          <h3 className="text-2xl font-bold text-slate-900">Productos Destacados</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="h-64 bg-slate-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-300 to-slate-100 group-hover:scale-105 transition-transform duration-500"></div>
              </div>
              <div className="p-5">
                <p className="text-sm text-slate-500 mb-1 font-medium">Categoría</p>
                <h4 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">Producto Increíble {item}</h4>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xl font-black text-slate-900">$2,999</span>
                  <button className="bg-slate-900 text-white p-2.5 rounded-xl hover:bg-slate-800 transition-colors shadow-md">
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer de la Tienda */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-xl font-black text-slate-900 mb-4">{storeName}</h2>
          <div className="flex justify-center gap-4 mb-6">
            <Instagram className="w-6 h-6 text-slate-400 cursor-pointer hover:text-pink-500 transition-colors" />
            <Facebook className="w-6 h-6 text-slate-400 cursor-pointer hover:text-blue-600 transition-colors" />
          </div>
          <p className="text-slate-500 text-sm">© 2026 {storeName}. Todos los derechos reservados.</p>
          <div className="mt-4 inline-flex items-center gap-2 text-xs text-slate-400 font-medium px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
            <span>Powered by</span>
            <span className="font-bold text-slate-700">Tremend</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
