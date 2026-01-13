// app/blog/page.tsx
import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import ArticlesClient from './ArticlesClient'; 
import { Suspense } from 'react';

/**
 * 1. ميتاداتا متقدمة وديناميكية (SEO)
 * تم تحديث العنوان والوصف ليشمل الكلمات المفتاحية الناقصة وضبط الطول المثالي.
 */
export async function generateMetadata(): Promise<Metadata> {
  const title = 'مدونة أبار جروب | حفر وصيانة الآبار وتوريد الطاقة الشمسية في مصر';
  const description = 'دليلك الشامل لتقنيات حفر وصيانة آبار المياه الجوفية، توريد طلمبات الأعماق، وتصميم محطات الطاقة الشمسية للمزارع في مصر بأفضل تكلفة وأعلى جودة.';

  return {
    title: title,
    description: description,
    keywords: [
      'حفر آبار مياه', 'صيانة آبار جوفية', 'توريد طلمبات أعماق', 
      'أسعار حفر الآبار 2026', 'طاقة شمسية للآبار', 'تطهير آبار المياه',
      'طلمبات شاكتي', 'تراخيص الآبار في مصر', 'أبار جروب'
    ],
    // توحيد النطاق إلى .org لتقوية الأرشفة
    alternates: { canonical: 'https://abaargroup.org/blog' },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: 'مركز المعرفة الفني - أبار جروب لحفر الآبار وتوريد الطلمبات',
      description: description,
      url: 'https://abaargroup.org/blog',
      siteName: 'أبار جروب',
      images: [
        {
          url: '/image/blog-hero-seo.jpg',
          width: 1200,
          height: 630,
          alt: 'مدونة أبار جروب لحفر وصيانة الآبار',
        },
      ],
      locale: 'ar_EG',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: ['/image/blog-hero-seo.jpg'],
    },
  };
}

export default async function BlogPage() {
  // 2. جلب البيانات من السيرفر (SSR) لضمان الأرشفة الكاملة للمقالات (Indexation)
  // جلب أول 12 مقالاً لضمان وجود محتوى كافٍ (Content Density) في الصفحة الأولى
  const { data: initialArticles, count, error } = await supabase
    .from("articles")
    .select("id, slug, title, category, image, meta_description, created_at, seo_title", { count: "exact" })
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .range(0, 11); 

  if (error) {
    console.error("Error fetching initial articles:", error);
  }

  /**
   * 3. البيانات المهيكلة (Structured Data) لجوجل
   * تم تحسينها لتعريف "المدونة" و "الناشر" بشكل رسمي بالنطاق الجديد
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "مدونة أبار جروب الفنية",
    "description": "دليل متخصص حول حفر وصيانة الآبار وحلول الطاقة الشمسية في مصر",
    "url": "https://abaargroup.org/blog",
    "publisher": {
      "@type": "Organization",
      "name": "أبار جروب",
      "logo": {
        "@type": "ImageObject",
        "url": "https://abaargroup.org/image/icon.png"
      }
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
          <p className="font-black text-sky-900 animate-pulse text-2xl">جاري تحميل مركز المعرفة...</p>
        </div>
      }>
        <ArticlesClient 
          initialArticles={(initialArticles as any) || []} 
          totalArticlesCount={count || 0} 
        />
      </Suspense>
    </>
  );
}