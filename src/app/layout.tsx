import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tremend | Crea tu tienda online en minutos',
  description: 'Diseña tu tienda, sube tus productos y cobra con Mercado Pago automáticamente.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={inter.className}>
        {children}
        {/* Componente de notificaciones globales (Sonner) */}
        <Toaster richColors position="top-center" closeButton />
      </body>
    </html>
  );
}
