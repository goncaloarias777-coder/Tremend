import Link from 'next/link'
import { Store, Zap, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header Responsivo */}
      <header className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between border-b border-slate-200/60">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-400 text-slate-900 rounded-xl font-bold shadow-sm">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <span className="text-xl font-black tracking-tight">Tremend</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/login" className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 px-2 py-1">
            Iniciar sesión
          </Link>
          <Link href="/registro" className="bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold px-3.5 py-2.5 rounded-xl shadow-md transition">
            Crear tienda
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 pt-12 sm:pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold mb-6">
          <Store className="w-3.5 h-3.5" /> Tu propio SaaS de Ecommerce
        </div>
        <h1 className="text-3xl sm:text-6xl font-black tracking-tight text-slate-900 leading-[1.1] mb-6">
          Tu negocio digital, <span className="text-amber-500">listo en minutos.</span>
        </h1>
        <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
          Diseña tu tienda, sube tus productos y cobra con Mercado Pago automáticamente. Sin comisiones ocultas, sin código, control total.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/registro" className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-8 py-4 rounded-2xl shadow-lg shadow-amber-400/20 transition flex items-center justify-center gap-2 text-base">
            Comenzar ahora gratis <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-5xl mx-auto px-4 py-12 border-t border-slate-200/60">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Ultra Rápido</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Tus clientes navegan sin demoras gracias a tecnología de punta en la nube.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Cobros Directos</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Integra tu Mercado Pago por OAuth y recibe el 100% de tus ventas al instante.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Control Total</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Panel privado para administrar productos, stock y diseño en tiempo real.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-slate-400 border-t border-slate-200/60 mt-12">
        &copy; 2026 Tremend. Todos los derechos reservados.
      </footer>
    </div>
  )
}
