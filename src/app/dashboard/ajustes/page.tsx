'use client';
import { useState, useEffect } from 'react';
import { Save, Palette, Lock, ShieldCheck, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function AjustesTiendaPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [store, setStore] = useState<any>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    cargarTienda();
  }, []);

  const cargarTienda = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('stores').select('*').eq('owner_id', user.id).single();
      if (data) setStore(data);
    }
    setLoading(false);
  };

  const handleActualizar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!store) return;
    setSaving(true);

    let finalLogoUrl = store.logo_url;

    // Si hay un archivo nuevo, lo subimos al Storage
    if (logoFile) {
      const fileExt = logoFile.name.split('.').pop();
      const fileName = `${store.id}-logo-${Math.random()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('tiendas')
        .upload(fileName, logoFile, { upsert: true });

      if (uploadError) {
        toast.error('Error al subir el logo');
        setSaving(false);
        return;
      }

      // Obtener la URL pública
      const { data: { publicUrl } } = supabase.storage.from('tiendas').getPublicUrl(fileName);
      finalLogoUrl = publicUrl;
    }

    const { error } = await supabase.from('stores').update({
      store_name: store.store_name,
      description: store.description,
      theme_color: store.theme_color,
      logo_url: finalLogoUrl
    }).eq('id', store.id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Tienda actualizada con éxito');
      setStore({ ...store, logo_url: finalLogoUrl });
      router.refresh();
    }
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-slate-400 w-8 h-8" /></div>;

  if (!store) return <div className="p-8 text-slate-500">No tienes una tienda creada. Ve a Configurar Tienda.</div>;

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Configuración de la Tienda</h1>
        <p className="text-slate-500">Administra los detalles públicos y tu seguridad personal.</p>
      </div>

      <form onSubmit={handleActualizar} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mb-8 space-y-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
          <Palette className="text-blue-500 w-5 h-5" /> Datos Públicos y Apariencia
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Nombre visible de la tienda</label>
            <input type="text" value={store.store_name} onChange={e => setStore({...store, store_name: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Color principal</label>
            <div className="flex items-center gap-4">
              <input type="color" value={store.theme_color} onChange={e => setStore({...store, theme_color: e.target.value})} className="h-12 w-24 p-1 rounded-lg border border-slate-200 cursor-pointer" />
              <span className="text-sm font-mono text-slate-500 uppercase">{store.theme_color}</span>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Descripción</label>
            <textarea value={store.description || ''} onChange={e => setStore({...store, description: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" rows={3}></textarea>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Logotipo de la Tienda</label>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-slate-50">
                {logoFile ? (
                  <img src={URL.createObjectURL(logoFile)} alt="Logo Preview" className="w-full h-full object-cover" />
                ) : store.logo_url ? (
                  <img src={store.logo_url} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="text-slate-300 w-8 h-8" />
                )}
              </div>
              <div>
                <input type="file" id="logo-upload" accept="image/*" className="hidden" onChange={e => { if (e.target.files && e.target.files[0]) setLogoFile(e.target.files[0]) }} />
                <label htmlFor="logo-upload" className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Subir nuevo logo
                </label>
                <p className="text-xs text-slate-500 mt-2">Recomendado: PNG o JPG cuadrado. Máx 2MB.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button type="submit" disabled={saving} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-sm">
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Guardar Cambios</>}
          </button>
        </div>
      </form>
    </div>
  );
}
