'use client'
import { useState } from 'react'
import { ShoppingBag, Store as StoreIcon, Check, Plus, Minus, X } from 'lucide-react'
import { toast } from 'sonner'

export default function Storefront({ store, productos }: { store: any, productos: any[] }) {
  const [carrito, setCarrito] = useState<any[]>([])
  const [isOpenCart, setIsOpenCart] = useState(false)
  const [loadingCheckout, setLoadingCheckout] = useState(false)

  const agregarAlCarrito = (producto: any) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.id === producto.id)
      if (existe) {
        return prev.map(item => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item)
      }
      return [...prev, { ...producto, cantidad: 1 }]
    })
    toast.success('Producto agregado al carrito')
  }

  const cambiarCantidad = (id: string, delta: number) => {
    setCarrito(prev => prev.map(item => {
      if (item.id === id) {
        const nuevaCantidad = item.cantidad + delta
        return nuevaCantidad > 0 ? { ...item, cantidad: nuevaCantidad } : null
      }
      return item
    }).filter(Boolean))
  }

  const totalCarrito = carrito.reduce((acc, item) => acc + (item.price * item.cantidad), 0)

  const procederAlPago = async () => {
    if (carrito.length === 0) return
    setLoadingCheckout(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: carrito, store_id: store.id })
      })
      const data = await res.json()
      if (data.init_point) {
        window.location.href = data.init_point
      } else {
        toast.error('Error al generar el pago con Mercado Pago')
      }
    } catch (err) {
      toast.error('Ocurrió un error de conexión')
    } finally {
      setLoadingCheckout(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      {/* Header de la Tienda */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {store.logo_url ? (
              <img src={store.logo_url} alt={store.name} className="w-10 h-10 rounded-xl object-cover border border-slate-200" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                {store.name.charAt(0)}
              </div>
            )}
            <h1 className="text-base sm:text-lg font-bold truncate max-w-[180px] sm:max-w-xs">{store.name}</h1>
          </div>

          <button 
            onClick={() => setIsOpenCart(true)}
            className="relative bg-slate-900 text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Carrito</span>
            {carrito.length > 0 && (
              <span className="bg-indigo-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {carrito.reduce((a, c) => a + c.cantidad, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Catálogo de Productos */}
      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-10">
        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Nuestros Productos</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Explora el catálogo oficial de {store.name}</p>
        </div>

        {productos.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
            <StoreIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">Aún no hay productos publicados en esta tienda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {productos.map(prod => (
              <div key={prod.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
                <div>
                  {prod.image_url ? (
                    <img src={prod.image_url} alt={prod.name} className="w-full h-44 sm:h-48 object-cover" />
                  ) : (
                    <div className="w-full h-44 sm:h-48 bg-slate-100 flex items-center justify-center text-slate-400 text-xs">Sin imagen</div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1 line-clamp-1">{prod.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">{prod.description}</p>
                    <span className="text-base sm:text-lg font-extrabold text-indigo-600">${prod.price}</span>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <button 
                    onClick={() => agregarAlCarrito(prod)}
                    className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-medium py-2.5 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Agregar al Carrito
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal del Carrito Lateral */}
      {isOpenCart && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl p-4 sm:p-6 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-indigo-600" /> Tu Carrito de Compras
              </h3>
              <button onClick={() => setIsOpenCart(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {carrito.length === 0 ? (
                <p className="text-center text-slate-400 py-12 text-sm">Tu carrito está vacío.</p>
              ) : (
                carrito.map(item => (
                  <div key={item.id} className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-800 text-xs sm:text-sm truncate">{item.name}</h4>
                      <p className="text-xs font-bold text-indigo-600">${item.price * item.cantidad}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 py-1">
                      <button onClick={() => cambiarCantidad(item.id, -1)} className="text-slate-500 hover:text-black">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{item.cantidad}</span>
                      <button onClick={() => cambiarCantidad(item.id, 1)} className="text-slate-500 hover:text-black">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {carrito.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-slate-600">Total a pagar:</span>
                  <span className="text-lg font-extrabold text-slate-900">${totalCarrito}</span>
                </div>
                <button
                  onClick={procederAlPago}
                  disabled={loadingCheckout}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 cursor-pointer disabled:opacity-50"
                >
                  {loadingCheckout ? 'Redirigiendo a MP...' : 'Pagar con Mercado Pago'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
