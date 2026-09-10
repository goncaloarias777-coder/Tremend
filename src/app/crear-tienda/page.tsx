'use client';
import { useState } from 'react';
import { Upload, Palette, Link as LinkIcon, Store, CreditCard, Save } from 'lucide-react';
import Link from 'next/link';

export default function CrearTiendaPage() {
  const [color, setColor] = useState('#2563eb');
  
  // URL de Autorización de Mercado Pago (Debe usar tu Client ID real de la app)
  // const mpAuthUrl = `https://auth.mercadopago.com/authorization?client_id=${process.env.NEXT_PUBLIC_MP_CLIENT_ID}&response_type=code&platform_id=mp&redirect_uri=${process.env.NEXT_PUBLIC_APP_URL}/api/mp/callback`;

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
              <form className="space-y-6">
                
                {/* Nombre y URL */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre de la marca</label>
                    <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none" placeholder="Mi Negocio Inc." />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">URL de la tienda (Slug)</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 text-slate-500 text-sm">tremend.com/</span>
                      <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-r-xl focus:ring-2 focus:ring-yellow-400 outline-none" placeholder="mi-negocio" />
                    </div>
                  </div>
                </div>

                {/* Subida de Logo */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Logotipo de la tienda</label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 text-slate-400 mb-2" />
                      <p className="text-sm text-slate-500"><span className="font-semibold">Haz clic para examinar</span> o arrastra tu imagen</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" />
                  </label>
                </div>

                {/* Color principal */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Palette className="w-4 h-4" /> Color corporativo principal
                  </label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="color" 
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="h-12 w-24 p-1 rounded-lg border border-slate-200 cursor-pointer" 
                    />
                    <span className="text-sm text-slate-500 uppercase font-mono bg-slate-100 px-3 py-1 rounded-md">{color}</span>
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Descripción corta</label>
                  <textarea rows={3} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none resize-none" placeholder="¿De qué trata tu tienda?"></textarea>
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
                  <p className="text-xs text-slate-500 mb-4">Recibe pagos directo en tu cuenta. Necesario para activar la tienda.</p>
                  
                  {/* Botón Real de MP - Usar tu URL de autorización */}
                  <a href="#" className="w-full flex items-center justify-center gap-2 bg-[#009EE3] hover:bg-[#0089C7] text-white font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm shadow-md">
                    Vincular cuenta <ChevronRight className="w-4 h-4"/>
                  </a>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200">
                <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg">
                  <Save className="w-5 h-5" /> Crear Tienda y Continuar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
