// app/store/page.tsx
import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import MainStoreClient from './MainStoreClient';
import { Suspense } from 'react';

/**
 * 1. ميتاداتا احترافية للسيو (SEO)
 * تضمن ظهور متجر أبار جروب بشكل جذاب عند البحث عن معدات الآبار
 */
export const metadata: Metadata = {
  title: 'متجر أبار جروب | معدات ومواسير وحلول الطاقة الشمسية',
  description: 'اكتشف أكبر تشكيلة من طلمبات الأعماق، مواسير الآبار UPVC، وألواح الطاقة الشمسية في مصر. جودة عالمية وضمان حقيقي من أبار جروب.',
  keywords: ['متجر أبار جروب', 'طلمبات أعماق شاكتي', 'مواسير آبار بلاستيك', 'إنفرتر طاقة شمسية', 'معدات حفر الآبار'],
  alternates: { canonical: 'https://www.abaargroup.com/store' },
  openGraph: {
    title: 'متجر أبار جروب - الحلول المتكاملة للمياه والطاقة',
    description: 'نوفر لك كافة مستلزمات حفر وصيانة الآبار بأفضل الأسعار وأعلى جودة.',
    url: 'https://www.abaargroup.com/store',
    siteName: 'أبار جروب',
    images: [
      {
        url: '/image/store-hero-seo.jpg', // تأكد من توفر الصورة في مجلد public
        width: 1200,
        height: 630,
        alt: 'متجر أبار جروب للمعدات',
      },
    ],
    locale: 'ar_EG',
    type: 'website',
  },
};

export default async function Page() {
  // 2. جلب بيانات الأقسام من السيرفر (SSR) لسرعة التحميل وفهم جوجل للمحتوى
  const { data: initialCategories, error } = await supabase
    .from('categories_du')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error("Error fetching store categories:", error);
  }

  /**
   * 3. البيانات المهيكلة (JSON-LD)
   * تخبر جوجل أن هذه صفحة متجر (Store) لعرض المنتجات في نتائج البحث
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "متجر أبار جروب",
    "description": "متجر متخصص في معدات حفر الآبار وأنظمة الطاقة الشمسية",
    "url": "https://www.abaargroup.com/store",
    "image": "https://www.abaargroup.com/image/store-og.jpg",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Giza",
      "addressCountry": "EG"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 font-black text-sky-600 animate-pulse text-2xl">
          جاري تهيئة المتجر...
        </div>
      }>
        {/* تمرير البيانات للمكون العميل مع حل مشكلة الـ TypeScript */}
        <MainStoreClient initialCategories={initialCategories || []} />
      </Suspense>
    </>
  );
}