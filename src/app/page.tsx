import Link from 'next/link';
import { Store, Zap, Shield, CreditCard, ChevronRight, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-yellow-400 p-2 rounded-xl"><Zap className="w-6 h-6 text-slate-900" /></div>
          <span className="text-xl font-bold tracking-tight">Tremend</span>
        </div>
        <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
          <a href="#como-funciona" className="hover:text-slate-900 transition-colors">Cómo funciona</a>
          <a href="#beneficios" className="hover:text-slate-900 transition-colors">Beneficios</a>
          <a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold text-slate-700 hover:text-slate-900">Iniciar sesión</Link>
          <Link href="/registro" className="text-sm font-semibold bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-slate-800 transition-all shadow-md hover:shadow-lg">
            Crear mi tienda
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-slate-900 leading-tight">
          Tu negocio digital,<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600">listo en minutos.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Diseña tu tienda, sube tus productos y cobra con Mercado Pago automáticamente. Sin comisiones ocultas, sin código, control total.
        </p>
        <Link href="/registro" className="inline-flex items-center gap-2 bg-yellow-400 text-slate-900 font-bold text-lg px-8 py-4 rounded-full hover:bg-yellow-300 transition-all shadow-xl shadow-yellow-200">
          Comenzar ahora gratis <ChevronRight className="w-5 h-5" />
        </Link>
      </header>

      {/* Cómo Funciona */}
      <section id="como-funciona" className="bg-white py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Lanza tu tienda en 3 simples pasos</h2>
            <p className="text-slate-500">Diseñado con sentido común para que vendas desde el primer día.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { step: '1', title: 'Crea tu cuenta', desc: 'Regístrate en segundos y accede a tu panel de control.', icon: <Store className="w-6 h-6"/> },
              { step: '2', title: 'Personaliza tu diseño', desc: 'Sube tu logo, elige tus colores y dale vida a tu marca.', icon: <Zap className="w-6 h-6"/> },
              { step: '3', title: 'Conecta tus pagos', desc: 'Vincula Mercado Pago con un clic y empieza a recibir dinero.', icon: <CreditCard className="w-6 h-6"/> }
            ].map((s, i) => (
              <div key={i} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 relative">
                <div className="absolute -top-5 -left-5 w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-lg">{s.step}</div>
                <div className="text-yellow-500 mb-4">{s.icon}</div>
                <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-slate-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-10">Preguntas Frecuentes</h2>
        <div className="space-y-4">
          {[
            { q: '¿Necesito conocimientos técnicos?', a: 'No, nuestra plataforma es 100% intuitiva. Si sabes usar redes sociales, sabes usar Tremend.' },
            { q: '¿Cómo funciona la integración con Mercado Pago?', a: 'Solo haces clic en "Vincular", autorizas la aplicación y los pagos van directo a tu cuenta.' },
            { q: '¿Puedo usar mi propio dominio?', a: 'Sí, puedes conectar tu dominio personalizado o usar el subdominio gratuito que te damos.' }
          ].map((faq, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h4 className="font-bold text-lg mb-2 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> {faq.q}</h4>
              <p className="text-slate-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-sm border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 text-white mb-4">
              <Zap className="w-5 h-5 text-yellow-400" /> <span className="font-bold text-lg">Tremend</span>
            </div>
            <p>La infraestructura moderna para emprendedores digitales.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Producto</h4>
            <ul className="space-y-2"><li><Link href="#como-funciona" className="hover:text-white">Características</Link></li><li><Link href="#" className="hover:text-white">Precios</Link></li></ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2"><li><Link href="/terminos" className="hover:text-white">Términos y Condiciones</Link></li><li><Link href="/privacidad" className="hover:text-white">Privacidad</Link></li></ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 text-center border-t border-slate-800 pt-8">
          <p>&copy; 2026 Tremend SaaS. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
