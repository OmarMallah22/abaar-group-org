// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Suspense } from 'react'; 
import { Noto_Naskh_Arabic } from 'next/font/google';
import Script from 'next/script'; // استيراد مكون Script من Next.js
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
  // العنوان الآن بطول 55 حرفاً (مثالي للسيو)
  title: 'أبار جروب | حفر وصيانة الآبار وحلول الطاقة الشمسية بمصر',
  description: 'شركة أبار جروب الرائدة في حفر وصيانة آبار المياه، توريد وتركيب طلمبات الأعماق الغاطسة، وتصميم أنظمة الطاقة الشمسية المبتكرة في مصر بأعلى جودة وأفضل الأسعار.',
  keywords: 'حفر آبار مياه، صيانة آبار، توريد طلمبات مياه، طاقة شمسية مصر، أبار جروب، حفر وتوريد',

  icons: {
    icon: [
      { url: '/image/f.png', sizes: '32x32' },
      { url: '/image/icon.png', sizes: '192x192' },
    ],
    shortcut: '/image/favicon.ico',
    apple: '/image/apple-icon.png',
  },

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* 1. حقن كود Google Tag Manager في الـ <head> */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-5HVLKFRT');
          `}
        </Script>

        {/* البيانات المهيكلة (Schema) */}
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
                "telephone": "+201211110240",
                "contactType": "customer service"
              }
            })
          }}
        />
      </head>
      <body className={`${notoNaskh.className} bg-background text-foreground min-h-screen flex flex-col`}>
        {/* 2. حقن كود Noscript مباشرة بعد فتح الـ <body> */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-5HVLKFRT"
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>

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