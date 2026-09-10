'use client';
import { useState, useEffect } from 'react';
import { ShieldAlert, Store, ShoppingBag, TrendingUp, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function SuperAdminPage() {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [metrics, setMetrics] = useState({ tiendas: 0, productos: 0, mrr: 0 });
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '123456') { // PIN de acceso por defecto del admin
      setIsAuthenticated(true);
      fetchMetrics();
    } else {
      alert('PIN Incorrecto');
    }
  };

  const fetchMetrics = async () => {
    setLoading(true);
    // Leer métricas públicas desde Supabase
    const { count: tiendasCount } = await supabase.from('stores').select('*', { count: 'exact', head: true });
    const { count: prodCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
    
    setMetrics({
      tiendas: tiendasCount || 0,
      productos: prodCount || 0,
      mrr: (tiendasCount || 0) * 15 // Simulación: $15 USD por tienda activa mensual
    });
    setLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-slate-800 p-8 rounded-2xl max-w-sm w-full border border-slate-700 shadow-2xl">
          <div className="flex justify-center mb-6 text-red-500"><ShieldAlert className="w-12 h-12" /></div>
          <h1 className="text-xl font-bold text-white text-center mb-6">Acceso Super Admin</h1>
          <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} className="w-full bg-slate-900 border border-slate-600 text-white px-4 py-3 rounded-xl mb-4 text-center tracking-[0.5em] focus:ring-2 focus:ring-red-500 outline-none" placeholder="PIN" maxLength={6} />
          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors">Ingresar</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="text-red-500" /> Tremend Global Admin
            </h1>
            <p className="text-slate-500">Métricas en tiempo real (Base de Datos Viva)</p>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="text-slate-500 hover:text-slate-900 font-medium">Salir</button>
        </header>

        {loading ? (
          <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-red-500" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">Tiendas Creadas</p>
                <p className="text-3xl font-bold text-slate-900">{metrics.tiendas}</p>
              </div>
              <div className="text-blue-500 bg-slate-50 p-4 rounded-xl"><Store className="w-8 h-8"/></div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">Productos Totales</p>
                <p className="text-3xl font-bold text-slate-900">{metrics.productos}</p>
              </div>
              <div className="text-purple-500 bg-slate-50 p-4 rounded-xl"><ShoppingBag className="w-8 h-8"/></div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">MRR Mensual</p>
                <p className="text-3xl font-bold text-slate-900">${metrics.mrr}</p>
              </div>
              <div className="text-green-500 bg-slate-50 p-4 rounded-xl"><TrendingUp className="w-8 h-8"/></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
