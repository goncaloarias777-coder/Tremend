import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-sm border border-slate-200">
        <Link href="/" className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-8 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver al inicio
        </Link>
        
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-yellow-100 p-3 rounded-xl"><Shield className="text-yellow-600 w-8 h-8" /></div>
          <h1 className="text-3xl font-black text-slate-900">Términos y Condiciones</h1>
        </div>
        
        <div className="space-y-8 text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Aceptación del servicio</h2>
            <p>Al registrarte en Tremend, aceptas nuestra política de uso. Proveemos la infraestructura tecnológica (SaaS) para que operes tu comercio electrónico de manera independiente.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Responsabilidad de la Tienda</h2>
            <p>Cada creador es 100% responsable del inventario, tiempos de entrega y políticas de devolución de los productos que ofrece. Tremend no interviene en disputas entre compradores y vendedores.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Procesamiento de Pagos</h2>
            <p>Las transacciones son procesadas mediante Mercado Pago. Tremend no retiene tu dinero en ningún momento. Las comisiones por venta son dictadas exclusivamente por las políticas de Mercado Pago vigentes.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Privacidad y Seguridad (PIN)</h2>
            <p>Tu PIN de seguridad es personal e intransferible. Es obligatorio para la confirmación de cambios sensibles en la vinculación de cuentas de cobro.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
