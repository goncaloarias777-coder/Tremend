'use client';
import { Plus, Package, Edit, Trash2 } from 'lucide-react';

export default function ProductosTiendaPage() {
  return (
    <div className="max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mis Productos</h1>
          <p className="text-slate-500">Gestiona el inventario, precios y detalles de lo que vendes.</p>
        </div>
        <button className="bg-yellow-400 text-slate-900 px-5 py-2.5 rounded-xl font-bold hover:bg-yellow-500 transition-colors flex items-center gap-2 shadow-sm">
          <Plus className="w-5 h-5" /> Nuevo Producto
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                <th className="p-4 font-medium">Producto</th>
                <th className="p-4 font-medium">Precio</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium">Estado</th>
                <th className="p-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Ejemplo de producto vacío / placeholder */}
              <tr>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Ejemplo de Zapatillas</p>
                      <p className="text-xs text-slate-500">Calzado</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 font-semibold text-slate-700">$45.000</td>
                <td className="p-4 text-slate-600">12 unid.</td>
                <td className="p-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Activo</span>
                </td>
                <td className="p-4 flex justify-end gap-2">
                  <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Edit className="w-4 h-4" /></button>
                  <button className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
