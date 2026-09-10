'use client';
import { useState } from 'react';
import { ShoppingCart, Search, Menu, Package, X, Plus, Minus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Storefront({ store, productos }: { store: any, productos: any[] }) {
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  const addToCart = (producto: any) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === producto.id);
      if (exists) {
        toast.success('Agregaste otro al carrito');
        return prev.map(item => item.id === producto.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      toast.success('Agregado al carrito');
      return [...prev, { ...producto, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(item => item.id !== id));
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoadingCheckout(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart, storeId: store.id })
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else toast.error(data.error || 'Error al procesar el pago');
    } catch {
      toast.error('Error de conexión');
    } finally {
      setLoadingCheckout(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans" style={{ '--color-brand': store.theme_color } as React.CSSProperties}>
      
      {/* Sidebar del Carrito */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><ShoppingCart className="w-6 h-6"/> Tu Carrito</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="text-center text-slate-500 mt-20">Tu carrito está vacío</div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                      {item.image_url ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" /> : <Package className="w-8 h-8 m-6 text-slate-300" />}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 line-clamp-1">{item.name}</h4>
                        <p className="text-slate-500 text-sm">${item.price}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center bg-slate-100 rounded-lg">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-slate-200 rounded-l-lg"><Minus className="w-4 h-4"/></button>
                          <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-slate-200 rounded-r-lg"><Plus className="w-4 h-4"/></button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm font-medium hover:underline">Quitar</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-slate-100 bg-slate-50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-slate-500 font-medium">Total a pagar:</span>
                  <span className="text-2xl font-black text-slate-900">${cartTotal.toFixed(2)}</span>
                </div>
                <button onClick={handleCheckout} disabled={loadingCheckout} className="w-full text-white py-4 rounded-xl font-bold flex justify-center items-center shadow-lg hover:opacity-90 transition-opacity" style={{ backgroundColor: store.theme_color }}>
                  {loadingCheckout ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Pagar con Mercado Pago'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header Público con Logo */}
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Menu className="w-6 h-6 text-slate-600 sm:hidden cursor-pointer" />
              {/* RENDERIZADO DEL LOGO O TEXTO */}
              {store.logo_url ? (
                <img src={store.logo_url} alt={store.store_name} className="h-10 w-auto object-contain" />
              ) : (
                <h1 className="text-2xl font-black tracking-tighter" style={{ color: store.theme_color }}>{store.store_name}</h1>
              )}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-slate-600 hover:text-slate-900 transition-colors">
                <ShoppingCart className="w-6 h-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white transform translate-x-1/4 -translate-y-1/4 rounded-full" style={{ backgroundColor: store.theme_color }}>
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Banner */}
      <div className="text-white py-20 px-4 text-center" style={{ backgroundColor: store.theme_color }}>
        {store.logo_url && <img src={store.logo_url} alt="Logo" className="w-24 h-24 mx-auto mb-6 rounded-full object-cover border-4 border-white shadow-lg bg-white" />}
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">{store.store_name}</h2>
        <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">{store.description || 'Explora nuestro catálogo exclusivo.'}</p>
      </div>

      {/* Grilla de Productos */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-2xl font-bold text-slate-900 mb-8">Catálogo</h3>
        
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
                    <button onClick={() => addToCart(prod)} className="text-white p-2.5 rounded-xl shadow-md transition-opacity hover:opacity-90" style={{ backgroundColor: store.theme_color }}>
                      <Plus className="w-5 h-5" />
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
