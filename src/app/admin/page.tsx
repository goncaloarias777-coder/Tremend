'use client';
import { useState } from 'react';
import { ShieldAlert, Users, TrendingUp, AlertTriangle } from 'lucide-react';

export default function SuperAdminPage() {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simulador de validación de PIN (conectado luego al env)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '123456') setIsAuthenticated(true);
    else alert('PIN Incorrecto');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-slate-800 p-8 rounded-2xl max-w-sm w-full border border-slate-700 shadow-2xl">
          <div className="flex justify-center mb-6 text-red-500"><ShieldAlert className="w-12 h-12" /></div>
          <h1 className="text-xl font-bold text-white text-center mb-6">Acceso Super Admin</h1>
          <input 
            type="password" 
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full bg-slate-900 border border-slate-600 text-white px-4 py-3 rounded-xl mb-4 text-center tracking-[0.5em] focus:ring-2 focus:ring-red-500 outline-none"
            placeholder="PIN"
            maxLength={6}
          />
          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors">
            Ingresar
          </button>
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
            <p className="text-slate-500">Métricas de todo el SaaS (Producción)</p>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="text-slate-500 hover:text-slate-900 font-medium">Salir</button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Tiendas Activas', val: '12', icon: <Users/>, color: 'text-blue-500' },
            { label: 'MRR (Ingreso Mensual)', val: '$450', icon: <TrendingUp/>, color: 'text-green-500' },
            { label: 'Errores MP', val: '0', icon: <AlertTriangle/>, color: 'text-orange-500' },
            { label: 'Nuevos Registros (Hoy)', val: '3', icon: <Users/>, color: 'text-purple-500' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.val}</p>
              </div>
              <div className={`${stat.color} bg-slate-50 p-3 rounded-xl`}>{stat.icon}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
