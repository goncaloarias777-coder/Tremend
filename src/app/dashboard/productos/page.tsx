'use client';
import { useState, useEffect } from 'react';
import { Plus, Package, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import Link from 'next/link';

export default function ProductosTiendaPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [productos, setProductos] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [nuevoProducto, setNuevoProducto] = useState({ name: '', price: '', stock: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: store } = await supabase.from('stores').select('id').eq('owner_id', user.id).single();
    if (store) {
      setStoreId(store.id);
      const { data: prods } = await supabase.from('products').select('*').eq('store_id', store.id).order('created_at', { ascending: false });
      if (prods) setProductos(prods);
    }
    setLoading(false);
  };

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeId) return toast.error('Debes crear una tienda primero');
    setIsSubmitting(true);

    let finalImageUrl = null;
    
    // Subir la imagen al storage si el usuario seleccionó una
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `prod-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('tiendas')
        .upload(fileName, imageFile);

      if (uploadError) {
        toast.error('Error al subir la imagen del producto');
        setIsSubmitting(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage.from('tiendas').getPublicUrl(fileName);
      finalImageUrl = publicUrl;
    }

    const { data, error } = await supabase.from('products').insert({
      store_id: storeId,
      name: nuevoProducto.name,
      price: parseFloat(nuevoProducto.price),
      stock: parseInt(nuevoProducto.stock),
      image_url: finalImageUrl
    }).select().single();

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Producto agregado');
      setProductos([data, ...productos]);
      setShowForm(false);
      setNuevoProducto({ name: '', price: '', stock: '' });
      setImageFile(null);
    }
    setIsSubmitting(false);
  };

  const handleBorrar = async (id: string, imageUrl: string) => {
    if (!confirm('¿Seguro que deseas borrar este producto?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) return toast.error('Error al borrar');
    toast.success('Producto eliminado');
    setProductos(productos.filter(p => p.id !== id));
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-slate-400 w-8 h-8" /></div>;

  if (!storeId) return (
    <div className="text-center p-10 bg-white rounded-2xl border border-slate-200 shadow-sm">
      <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-slate-900 mb-2">Aún no tienes una tienda</h2>
      <Link href="/crear-tienda" className="bg-yellow-400 text-slate-900 px-6 py-3 rounded-xl font-bold">Crear Tienda Ahora</Link>
    </div>
  );

  return (
    <div className="max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mis Productos</h1>
          <p className="text-slate-500">Gestiona el inventario y catálogo.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center gap-2">
          <Plus className="w-5 h-5" /> {showForm ? 'Cancelar' : 'Nuevo Producto'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
          <form onSubmit={handleCrear} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre del producto</label>
              <input type="text" required value={nuevoProducto.name} onChange={e => setNuevoProducto({...nuevoProducto, name: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-yellow-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Precio ($)</label>
              <input type="number" step="0.01" required value={nuevoProducto.price} onChange={e => setNuevoProducto({...nuevoProducto, price: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-yellow-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Stock disponible</label>
              <input type="number" required value={nuevoProducto.stock} onChange={e => setNuevoProducto({...nuevoProducto, stock: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-yellow-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Foto del producto</label>
              <input type="file" accept="image/*" onChange={e => { if (e.target.files) setImageFile(e.target.files[0]) }} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100 cursor-pointer" />
            </div>
            <div className="md:col-span-2 pt-2">
              <button type="submit" disabled={isSubmitting} className="bg-yellow-400 text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 flex justify-center items-center gap-2">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Guardar Producto'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {productos.length === 0 ? (
          <div className="text-center p-10 text-slate-500">No hay productos. Agrega el primero.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                  <th className="p-4 font-medium">Producto</th>
                  <th className="p-4 font-medium">Precio</th>
                  <th className="p-4 font-medium">Stock</th>
                  <th className="p-4 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {productos.map((prod) => (
                  <tr key={prod.id}>
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 overflow-hidden shrink-0">
                        {prod.image_url ? <img src={prod.image_url} alt="img" className="w-full h-full object-cover" /> : <Package className="w-6 h-6" />}
                      </div>
                      <span className="font-bold text-slate-900 line-clamp-1">{prod.name}</span>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">${prod.price}</td>
                    <td className="p-4 text-slate-600">{prod.stock}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleBorrar(prod.id, prod.image_url)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 className="w-5 h-5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
