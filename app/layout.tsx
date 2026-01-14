import './globals.css';
import type { Metadata } from 'next';
import { Suspense } from 'react'; 
import { Noto_Naskh_Arabic } from 'next/font/google';
import Script from 'next/script';
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
  title: 'أبار جروب | حفر وصيانة الآبار وحلول الطاقة الشمسية بمصر',
  description: 'شركة أبار جروب الرائدة في حفر وصيانة آبار المياه، توريد وتركيب طلمبات الأعماق الغاطسة، وتصميم أنظمة الطاقة الشمسية المبتكرة في مصر بأعلى جودة وأفضل الأسعار.',
  keywords: 'حفر آبار مياه، صيانة آبار، توريد طلمبات مياه، طاقة شمسية مصر، أبار جروب، حفر وتوريد',
  
  // ملاحظة: تم حذف قسم icons هنا لأنك وضعت الملفات في مجلد app بالأسماء الصحيحة
  // Next.js سيقوم بتوليد الروابط تلقائياً وبأفضل جودة للسيو.

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
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-5HVLKFRT');
          `}
        </Script>

        {/* Schema Markup - تم تعديل رابط اللوجو للمسار الجديد */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "أبار جروب",
              "url": "https://abaargroup.org",
              "logo": "https://abaargroup.org/icon.png", 
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
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">...Loading</div>}>
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