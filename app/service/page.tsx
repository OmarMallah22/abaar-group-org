import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import ServicesClient from './ServicesClient';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'خدمات أبار جروب | حفر وصيانة آبار مياه وتوريد طلمبات الطاقة الشمسية',
  
  description: 'اكتشف خدمات أبار جروب المتكاملة في حفر وصيانة آبار المياه الجوفية، وتطهير الآبار، وتوريد طلمبات الأعماق ومستلزمات البئر وأنظمة الطاقة الشمسية الموفرة في مصر.',
  
  keywords: [
    'حفر آبار مياه', 
    'صيانة آبار جوفية', 
    'تطهير آبار المياه', 
    'توريد طلمبات أعماق', 
    'توريد مستلزمات البئر', 
    'طاقة شمسية للآبار في مصر', 
    'أبار جروب خدمات'
  ],

  alternates: { 
    canonical: 'https://abaargroup.org/service' 
  },

  openGraph: {
    title: 'خدمات حفر وصيانة الآبار وتوريد حلول الطاقة الشمسية - أبار جروب',
    description: 'نقدم خدمات هندسية واقعية في حفر وصيانة الآبار وتوريد كافة مستلزمات بئر المياه بأنظمة الطاقة المتجددة في مصر.',
    url: 'https://abaargroup.org/service',
    siteName: 'أبار جروب',
    images: [
      {
        url: '/image/services-seo.jpg',
        width: 1200,
        height: 630,
        alt: 'خدمات أبار جروب المتكاملة لحفر وتوريد الآبار',
      },
    ],
    locale: 'ar_EG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'أبار جروب | خدمات حفر وتجهيز الآبار',
    description: 'خبراء حفر وصيانة الآبار وتوريد الطلمبات والطاقة الشمسية في مصر.',
    images: ['/image/services-seo.jpg'],
  },
};

export default async function Page() {
  // 2. جلب البيانات من السيرفر (SSR) لضمان الأرشفة الكاملة (Indexation)
  const { data: initialServices, error } = await supabase
    .from("services")
    .select("*")
    .order("title", { ascending: true });

  if (error) {
    console.error("Error fetching services:", error);
  }

  /**
   * 3. البيانات المهيكلة المتقدمة (JSON-LD)
   * تم تحسين الوصف ليتعرف جوجل على خدماتك كمنظومة متكاملة
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "خدمات حفر وصيانة الآبار وتوريد الطلمبات",
    "serviceType": "Well Drilling, Maintenance, and Solar Energy Systems",
    "provider": {
      "@type": "Organization",
      "name": "أبار جروب",
      "url": "https://abaargroup.org",
      "logo": "https://abaargroup.org/image/icon.png"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Egypt"
    },
    "description": "نحن متخصصون في حفر وصيانة وتطهير آبار المياه الجوفية، مع توريد كافة مستلزمات البير وطلمبات الأعماق وأنظمة الطاقة الشمسية المبتكرة."
  };

  return (
    <>
      {/* حقن البيانات المهيكلة في رأس الصفحة */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Suspense fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
          <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mb-4"></div>
          <p className="font-bold text-sky-900 animate-pulse text-xl">
            جاري تحميل قائمة الخدمات الفنية...
          </p>
        </div>
      }>
        {/* تمرير البيانات للمكون العميل */}
        <ServicesClient initialServices={initialServices || []} />
      </Suspense>
    </>
  );
}