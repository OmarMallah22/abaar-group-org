// app/store/page.tsx
import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import MainStoreClient from './MainStoreClient';
import { Suspense } from 'react';

/**
 * 1. ميتاداتا احترافية ومطورة للسيو (SEO A+)
 * تم ضبط الطول المثالي (Title 60 حرفاً، Description 158 حرفاً) لتغطية الكلمات المفتاحية الناقصة.
 */
export const metadata: Metadata = {
  // العنوان: تم دمج كلمات (متجر، توريد، صيانة، حفر، آبار)
  title: 'متجر أبار جروب | توريد مستلزمات حفر وصيانة الآبار والطاقة الشمسية',
  
  // الوصف: صياغة واقعية تزيد كثافة النص وتجذب عناكب البحث
  description: 'متجر أبار جروب: الوجهة الأولى لتوريد طلمبات المياه، مواسير الآبار، ومستلزمات الطاقة الشمسية في مصر. نقدم حلولاً واقعية لصيانة الآبار وتجهيز المزارع بأعلى جودة.',
  
  keywords: [
    'متجر أبار جروب', 
    'توريد طلمبات أعماق', 
    'مواسير آبار بلاستيك حديد', 
    'صيانة آبار جوفية', 
    'معدات حفر الآبار في مصر',
    'أسعار مستلزمات الآبار 2026'
  ],

  // توحيد النطاق إلى .org لتقوية سلطة الموقع (Page Authority)
  alternates: { 
    canonical: 'https://abaargroup.org/store' 
  },

  openGraph: {
    title: 'متجر أبار جروب - الحلول المتكاملة لتوريد وتجهيز الآبار',
    description: 'نوفر لك كافة مستلزمات حفر وصيانة الآبار الجوفية وأنظمة الطاقة الشمسية بأفضل الأسعار في مصر.',
    url: 'https://abaargroup.org/store',
    siteName: 'أبار جروب',
    images: [
      {
        url: '/image/store-hero-seo.jpg',
        width: 1200,
        height: 630,
        alt: 'متجر أبار جروب لتوريد معدات الآبار',
      },
    ],
    locale: 'ar_EG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'متجر أبار جروب | توريد مستلزمات الآبار',
    description: 'خبراء حفر وصيانة الآبار وتوريد حلول الطاقة الشمسية في مصر.',
    images: ['/image/store-hero-seo.jpg'],
  },
};

export default async function Page() {
  // 2. جلب بيانات الأقسام من السيرفر (SSR) لضمان الأرشفة الفورية للمحتوى
  const { data: initialCategories, error } = await supabase
    .from('categories_du')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error("Error fetching store categories:", error);
  }

  /**
   * 3. البيانات المهيكلة (JSON-LD) المتقدمة
   * تعريف "المتجر" (Store) بشكل رسمي بالنطاق الجديد لظهور نتائج بحث غنية
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "متجر أبار جروب لتوريد معدات الآبار",
    "description": "متجر متخصص في توريد طلمبات المياه، مواسير الآبار، وأنظمة الطاقة الشمسية في مصر.",
    "url": "https://abaargroup.org/store",
    "image": "https://abaargroup.org/image/icon.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "التجمع الثالث",
      "addressLocality": "Cairo",
      "addressCountry": "EG"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "معدات ومستلزمات الآبار",
      "itemListElement": initialCategories?.map((cat, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": cat.name
      }))
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Suspense fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
          <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mb-4"></div>
          <p className="font-black text-sky-900 animate-pulse text-2xl">جاري تحميل المتجر الحديث...</p>
        </div>
      }>
        {/* تمرير البيانات للمكون العميل */}
        <MainStoreClient initialCategories={initialCategories || []} />
      </Suspense>
    </>
  );
}