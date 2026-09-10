'use client';
import { Store, LogOut, Settings, BarChart3, Edit3, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    // Aquí irá la lógica real de Supabase auth.signOut()
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Menú Mini-Panel */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-white font-bold text-xl flex items-center gap-2">
            <Store className="text-yellow-400" /> Mi Tienda
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 bg-slate-800 text-white px-4 py-3 rounded-xl transition-colors">
            <BarChart3 className="w-5 h-5" /> Resumen
          </Link>
          <Link href="/dashboard/productos" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 hover:text-white rounded-xl transition-colors">
            <ShoppingBag className="w-5 h-5" /> Productos
          </Link>
          <Link href="/dashboard/ajustes" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 hover:text-white rounded-xl transition-colors">
            <Settings className="w-5 h-5" /> Configuración
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-slate-800 hover:text-red-300 rounded-xl transition-colors">
            <LogOut className="w-5 h-5" /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Hola, Creador</h1>
            <p className="text-slate-500">Aquí está el rendimiento de tu negocio hoy.</p>
          </div>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 px-5 py-2.5 rounded-full font-bold flex items-center gap-2 shadow-sm transition-colors">
            <Edit3 className="w-4 h-4" /> Editar Tienda
          </button>
        </header>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {['Ventas de hoy', 'Visitas', 'Pedidos pendientes'].map((title, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-slate-500 text-sm font-medium mb-2">{title}</h3>
              <p className="text-3xl font-bold text-slate-900">{i === 0 ? '$0.00' : '0'}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
