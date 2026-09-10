'use client';
import { useState } from 'react';
import { Save, Palette, Lock, ShieldCheck } from 'lucide-react';

export default function AjustesTiendaPage() {
  const [pin, setPin] = useState('');

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Configuración de la Tienda</h1>
        <p className="text-slate-500">Administra los detalles públicos y tu seguridad personal.</p>
      </div>

      {/* Sección Seguridad (PIN del Dueño) */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Lock className="text-yellow-500 w-5 h-5" /> Seguridad de Retiros
        </h2>
        <p className="text-sm text-slate-500 mb-6">Genera un PIN único para autorizar cambios críticos y gestionar Mercado Pago.</p>
        
        <div className="max-w-xs">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Nuevo PIN de Seguridad</label>
          <div className="relative">
            <input 
              type="password" 
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-center tracking-[1em] font-mono text-xl"
              placeholder="••••••"
            />
          </div>
        </div>
        <button className="mt-5 bg-slate-900 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-sm">
          <ShieldCheck className="w-4 h-4" /> Guardar PIN
        </button>
      </div>

      {/* Sección Apariencia */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Palette className="text-blue-500 w-5 h-5" /> Datos Públicos
        </h2>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Nombre visible de la tienda</label>
            <input type="text" className="w-full max-w-md px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" defaultValue="Mi Súper Tienda" />
          </div>
          <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-sm">
            <Save className="w-4 h-4" /> Actualizar Datos
          </button>
        </div>
      </div>
    </div>
  );
}
