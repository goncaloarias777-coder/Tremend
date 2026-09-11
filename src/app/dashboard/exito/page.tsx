'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Globe, Package, ArrowRight, BarChart3 } from 'lucide-react'

export default function TiendaListaPage() {
  const [store, setStore] = useState<any>(null)
  const [loading, setLoading] = useState(true)
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

      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('owner_id', user.id)
        .single()

      if (error || !data) {
        router.push('/crear-tienda')
      } else {
        setStore(data)
        setLoading(false)
      }
    }
    fetchStore()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <p className="animate-pulse text-sm">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">¡Tu tienda está lista!</h1>
        <p className="text-slate-400 text-xs sm:text-sm mb-6">
          Has configurado exitosamente <strong className="text-white">{store?.name}</strong>. Ya está activa para recibir visitas y cobros.
        </p>

        {store?.slug && (
          <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-4 mb-6 text-left">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Enlace público de tu tienda:</span>
            <div className="flex items-center justify-between gap-2 bg-slate-800 px-3 py-2.5 rounded-xl border border-slate-700">
              <span className="text-xs text-indigo-300 truncate font-mono">tremend-hifb.vercel.app/{store.slug}</span>
              <a 
                href={`/${store.slug}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" /> Visitar
              </a>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Link 
            href="/dashboard/productos" 
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-lg shadow-indigo-600/30 cursor-pointer"
          >
            <Package className="w-4 h-4" /> Agregar tus primeros productos <ArrowRight className="w-4 h-4" />
          </Link>

          <Link 
            href="/dashboard" 
            className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <BarChart3 className="w-4 h-4" /> Ir al Panel de Control
          </Link>
        </div>
      </div>
    </div>
  )
}
