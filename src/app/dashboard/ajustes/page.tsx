'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Store, Save, ArrowLeft, ExternalLink, Globe } from 'lucide-react'
import { toast } from 'sonner'

export default function AjustesTiendaPage() {
  const [store, setStore] = useState<any>(null)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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
        .eq('user_id', user.id)
        .single()

      if (error || !data) {
        router.push('/crear-tienda')
      } else {
        setStore(data)
        setName(data.name || '')
        setSlug(data.slug || '')
        setLogoUrl(data.logo_url || '')
      }
      setLoading(false)
    }
    fetchStore()
  }, [router, supabase])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const { error } = await supabase
      .from('stores')
      .update({ name, slug, logo_url: logoUrl })
      .eq('id', store.id)

    if (error) {
      toast.error('Error al actualizar la tienda: ' + error.message)
    } else {
      toast.success('¡Tienda actualizada con éxito!')
      router.refresh()
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <p className="animate-pulse text-sm">Cargando ajustes...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Cabecera con botón de retorno y enlace a la tienda */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition">
            <ArrowLeft className="w-4 h-4" /> Volver al Dashboard
          </Link>

          {slug && (
            <a 
              href={`/${slug}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shadow-lg shadow-indigo-600/30"
            >
              <Globe className="w-4 h-4" /> Visitar mi Tienda en Vivo <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-700/60">
            <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-xl">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Configuración de la Tienda</h1>
              <p className="text-xs text-slate-400">Personaliza los datos públicos de tu negocio</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Nombre de la Tienda</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Enlace único (Slug)</label>
              <input 
                type="text" 
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Tu tienda estará en: tremend-hifb.vercel.app/{slug}</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">URL del Logotipo</label>
              <input 
                type="url" 
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://ejemplo.com/tu-logo.png"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button 
              type="submit" 
              disabled={saving}
              className="w-full mt-4 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-md shadow-amber-400/20 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {saving ? 'Guardando cambios...' : 'Guardar Cambios'}
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}
