'use client';
import { useState, useEffect } from 'react';
import { Upload, Palette, Link as LinkIcon, Store, CreditCard, Save, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function CrearTiendaPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    store_name: '',
    slug: '',
    description: '',
    theme_color: '#2563eb'
  });

  // Obtener el ID del usuario al cargar
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    getUser();
  }, [supabase.auth]);

  const handleCrearTienda = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return toast.error('Error de sesión');
    
    // Validar slug (solo minúsculas y guiones)
    const slugValido = formData.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    if (slugValido !== formData.slug) {
      return toast.error('La URL solo puede contener letras minúsculas, números y guiones.');
    }

    setLoading(true);

    const { error } = await supabase
      .from('stores')
      .insert({
        owner_id: userId,
        store_name: formData.store_name,
        slug: slugValido,
        description: formData.description,
        theme_color: formData.theme_color
      });

    if (error) {
      toast.error(error.message.includes('unique') ? 'Esta URL ya está en uso. Elige otra.' : error.message);
      setLoading(false);
      return;
    }

    toast.success('¡Tienda creada con éxito!');
    router.push('/dashboard');
    router.refresh();
  };

  // URL real para Mercado Pago (Reemplazará tus variables de entorno)
  const mpAuthUrl = `https://auth.mercadopago.com/authorization?client_id=${process.env.NEXT_PUBLIC_MP_CLIENT_ID || 'TU_CLIENT_ID'}&response_type=code&platform_id=mp&redirect_uri=${process.env.NEXT_PUBLIC_APP_URL}/api/mp/callback`;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Store className="w-8 h-8 text-yellow-500" /> Configura tu Tienda
          </h1>
          <p className="text-slate-500 mt-2">Personaliza la apariencia y conecta tus métodos de pago antes de publicar.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="grid md:grid-cols-3">
            {/* Panel Izquierdo - Formulario */}
            <div className="md:col-span-2 p-8 border-r border-slate-200">
              <form id="tienda-form" onSubmit={handleCrearTienda} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre de la marca</label>
                    <input type="text" required value={formData.store_name} onChange={e => setFormData({...formData, store_name: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none" placeholder="Mi Negocio Inc." />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">URL de la tienda (Slug)</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 text-slate-500 text-sm">tremend.com/</span>
                      <input type="text" required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase()})} className="w-full px-4 py-3 border border-slate-200 rounded-r-xl focus:ring-2 focus:ring-yellow-400 outline-none" placeholder="mi-negocio" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Palette className="w-4 h-4" /> Color corporativo principal
                  </label>
                  <div className="flex items-center gap-4">
                    <input type="color" value={formData.theme_color} onChange={e => setFormData({...formData, theme_color: e.target.value})} className="h-12 w-24 p-1 rounded-lg border border-slate-200 cursor-pointer" />
                    <span className="text-sm text-slate-500 uppercase font-mono bg-slate-100 px-3 py-1 rounded-md">{formData.theme_color}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Descripción corta</label>
                  <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none resize-none" placeholder="¿De qué trata tu tienda?"></textarea>
                </div>
              </form>
            </div>

            {/* Panel Derecho - Integraciones y Guardado */}
            <div className="p-8 bg-slate-50 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><LinkIcon className="w-5 h-5"/> Integraciones</h3>
                <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-500 p-2 rounded-lg"><CreditCard className="text-white w-5 h-5"/></div>
                    <span className="font-bold text-slate-800">Mercado Pago</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">Recibe pagos directo en tu cuenta.</p>
                  <a href={mpAuthUrl} className="w-full flex items-center justify-center gap-2 bg-[#009EE3] hover:bg-[#0089C7] text-white font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm shadow-md">
                    Vincular cuenta
                  </a>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200">
                <button type="submit" form="tienda-form" disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Guardar Tienda</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
