import './globals.css';
import type { Metadata } from 'next';
import { Suspense } from 'react'; 
import { Noto_Naskh_Arabic } from 'next/font/google';
import Header from '@/components/header'; 
import Footer from '@/components/footer'; 
import { CartProvider } from '@/app/context/CartContext';
import ShoppingCart from '@/components/shoppingcart';

const notoNaskh = Noto_Naskh_Arabic({ 
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-noto', 
});

export const metadata: Metadata = {
  title: 'أبار جروب | خدمات حفر وصيانة الآبار',
  description: 'شركة رائدة في مجال حفر وصيانة آبار المياه وتوريد الطلمبات في مصر.',
  // إعدادات الأيقونات لضمان الظهور في المتصفح ونتائج البحث
  icons: {
    icon: [
      { url: 'image/f.png', sizes: '32x32' },
      { url: 'image/icon.png', sizes: '192x192' },
    ],
    shortcut: 'image/favicon.ico',
    apple: 'image/apple-icon.png',
  },
  // الربط مع أدوات مشرفي المواقع لجوجل
  other: {
    "google-site-verification": "كود_التحقق_الخاص_بك", 
  },
  openGraph: {
    title: 'أبار جروب | خدمات حفر وصيانة الآبار',
    description: 'حلول متكاملة لحفر الآبار والطاقة الشمسية في مصر.',
    url: 'https://abaargroup.org',
    siteName: 'أبار جروب',
    images: [
      {
        url: '/og-image.jpg', 
        width: 1200,
        height: 630,
      },
    ],
    locale: 'ar_EG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'أبار جروب',
    description: 'خدمات حفر وصيانة الآبار في مصر.',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${notoNaskh.className} bg-background text-foreground min-h-screen flex flex-col`}>
        <CartProvider>
          <Header />
          <main className="flex-grow">
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-sky-600"></div>
              </div>
            }>
              {children}
            </Suspense>
          </main>
          <Footer />
          <ShoppingCart />
        </CartProvider>
      </body>
    </html>
  );
}