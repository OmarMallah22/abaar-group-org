// app/service/page.tsx
import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import ServicesClient from './ServicesClient';
import { Suspense } from 'react';

/**
 * 1. ميتاداتا احترافية للسيو (SEO)
 * تضمن ظهور خدمات حفر الآبار والطاقة الشمسية بشكل ممتاز في نتائج البحث
 */
export const metadata: Metadata = {
  title: 'خدماتنا | أبار جروب لحفر الآبار والطاقة الشمسية في مصر',
  description: 'اكتشف خدمات أبار جروب المتكاملة: حفر وصيانة آبار المياه الجوفية، توريد طلمبات الأعماق، وتصميم محطات الطاقة الشمسية للمزارع بأعلى جودة.',
  keywords: ['حفر آبار مياه', 'صيانة آبار جوفية', 'طلمبات أعماق مصر', 'طاقة شمسية للآبار', 'أبار جروب خدمات'],
  alternates: { canonical: 'https://www.abaargroup.com/service' },
  openGraph: {
    title: 'حلول المياه والطاقة المتكاملة - أبار جروب',
    description: 'نقدم حلولاً هندسية متطورة لحفر الآبار وأنظمة الطاقة المتجددة في كافة أنحاء مصر.',
    url: 'https://www.abaargroup.com/service',
    siteName: 'أبار جروب',
    images: [
      {
        url: '/image/services-seo.jpg',
        width: 1200,
        height: 630,
        alt: 'خدمات أبار جروب لحفر الآبار',
      },
    ],
    locale: 'ar_EG',
    type: 'website',
  },
};

export default async function Page() {
  // 2. جلب البيانات من السيرفر (SSR) لضمان ظهورها في الـ HTML الأولي
  const { data: initialServices, error } = await supabase
    .from("services")
    .select("*")
    .order("title", { ascending: true });

  if (error) {
    console.error("Error fetching services:", error);
  }

  /**
   * 3. البيانات المهيكلة (JSON-LD) لجوجل
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Well Drilling and Solar Energy Solutions",
    "provider": {
      "@type": "Organization",
      "name": "أبار جروب",
      "url": "https://www.abaargroup.com"
    },
    "areaServed": "EG",
    "description": "خدمات حفر وصيانة الآبار وحلول الطاقة المتجددة"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-white font-black text-sky-600 animate-pulse text-2xl">
          جاري تجهيز قائمة الخدمات...
        </div>
      }>
        {/* تمرير البيانات للمكون العميل مع ضمان توافق الأنواع */}
        <ServicesClient initialServices={initialServices || []} />
      </Suspense>
    </>
  );
}