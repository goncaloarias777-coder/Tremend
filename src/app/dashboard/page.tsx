'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Store, Package, Settings, BarChart3, LogOut, ArrowUpRight, DollarSign, Users, ShoppingCart, Menu, X, Globe } from 'lucide-react'
import { toast } from 'sonner'

export default function DashboardPage() {
  const [store, setStore] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchStore = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // Buscamos usando owner_id que es la clave correcta de la tabla stores
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('owner_id', user.id)
        .single()

      if (error || !data) {
        // Si no tiene tienda creada, lo mandamos a crear una
        router.push('/crear-tienda')
      } else {
        setStore(data)
        setLoading(false)
      }
    }
    fetchStore()
  }, [router, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Sesión cerrada')
    router.push('/login')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <p className="animate-pulse text-sm">Cargando tu panel...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col md:flex-row text-slate-100">
      
      {/* Botón de Menú Mobile */}
      <div className="md:hidden flex items-center justify-between bg-slate-800 border-b border-slate-700 p-4 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-600 text-white rounded-lg">
            <Store className="w-5 h-5" />
          </div>
          <span className="font-bold text-sm truncate max-w-[150px]">{store?.name || 'Mi Tienda'}</span>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-700/50 cursor-pointer"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar de Navegación */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-800 border-r border-slate-700 p-6 flex flex-col justify-between transition-transform duration-200 ease-in-out
        md:translate-x-0 md:static
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div>
          <div className="hidden md:flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-indigo-600 text-white rounded-xl">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-sm truncate max-w-[140px]">{store?.name}</h2>
              <span className="text-[10px] text-indigo-400 font-medium">Panel de Control</span>
            </div>
          </div>

          <nav className="space-y-1 mt-12 md:mt-0">
            <Link href="/dashboard" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium bg-indigo-600 text-white shadow-sm">
              <BarChart3 className="w-4 h-4" /> Resumen
            </Link>
            <Link href="/dashboard/productos" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-700/50 hover:text-white transition">
              <Package className="w-4 h-4" /> Productos
            </Link>
            <Link href="/dashboard/ajustes" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-700/50 hover:text-white transition">
              <Settings className="w-4 h-4" /> Configuración
            </Link>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-700/60 space-y-3">
          {store?.slug && (
            <a 
              href={`/${store.slug}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full px-3.5 py-2.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-xl text-xs font-semibold text-indigo-300 transition"
            >
              <span className="flex items-center gap-2"><Globe className="w-4 h-4" /> Ver mi Tienda</span> 
              <ArrowUpRight className="w-4 h-4" />
            </a>
          )}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3.5 py-2.5 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Overlay para cerrar sidebar en mobile */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-xs"
        />
      )}

      {/* Contenido Principal */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 bg-slate-800/60 border border-slate-700/80 p-6 rounded-2xl shadow-lg">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white">Panel de Control</h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">Aquí está el resumen del rendimiento de tu negocio hoy.</p>
            </div>
            <div className="flex items-center gap-3">
              {store?.slug && (
                <a 
                  href={`/${store.slug}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30"
                >
                  <Globe className="w-4 h-4" /> Ver Tienda
                </a>
              )}
              <Link 
                href="/dashboard/ajustes" 
                className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md shadow-amber-400/20"
              >
                Configurar
              </Link>
            </div>
          </div>

          {/* Tarjetas de Métricas Responsivas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-slate-800 border border-slate-700/80 p-5 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400">Ventas de hoy</span>
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-white">$0.00</h3>
            </div>

            <div className="bg-slate-800 border border-slate-700/80 p-5 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400">Visitas</span>
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-white">0</h3>
            </div>

            <div className="bg-slate-800 border border-slate-700/80 p-5 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400">Pedidos pendientes</span>
                <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
                  <ShoppingCart className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-white">0</h3>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
