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
  // تم زيادة الطول ليشمل الكلمات المفتاحية: حفر، صيانة، طلمبات، طاقة شمسية
  title: 'أبار جروب | حفر وصيانة آبار مياه، توريد طلمبات، وطاقة شمسية في مصر',
  // الوصف المثالي (بين 120-160 حرفاً) لزيادة كثافة المحتوى
  description: 'شركة أبار جروب الرائدة في حفر وصيانة آبار المياه، توريد وتركيب طلمبات الأعماق الغاطسة، وتصميم أنظمة الطاقة الشمسية المبتكرة في مصر بأعلى جودة وأفضل الأسعار.',
  // إضافة الكلمات المفتاحية (تساعد بعض المحركات)
  keywords: 'حفر آبار مياه، صيانة آبار، توريد طلمبات مياه، طاقة شمسية مصر، أبار جروب، حفر وتوريد',

  icons: {
    icon: [
      { url: '/image/f.png', sizes: '32x32' },
      { url: '/image/icon.png', sizes: '192x192' },
    ],
    shortcut: '/image/favicon.ico',
    apple: '/image/apple-icon.png',
  },

  // إضافة الرابط الأصلي (Canonical URL) لتقوية الأرشفة
  alternates: {
    canonical: 'https://abaargroup.org',
  },

  openGraph: {
    title: 'أبار جروب | خدمات حفر الآبار وأنظمة الطاقة الشمسية في مصر',
    description: 'نحن متخصصون في حفر وصيانة آبار المياه وتوريد طلمبات الأعماق وتركيب محطات الطاقة الشمسية.',
    url: 'https://abaargroup.org',
    siteName: 'أبار جروب',
    images: [
      {
        url: '/og-image.jpg', 
        width: 1200,
        height: 630,
        alt: 'أبار جروب لحفر الآبار والطاقة الشمسية',
      },
    ],
    locale: 'ar_EG',
    type: 'website',
  },
};
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "أبار جروب",
      "url": "https://abaargroup.org",
      "logo": "https://abaargroup.org/image/icon.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+201XXXXXXXXX",
        "contactType": "customer service"
      }
    })
  }}
/>
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