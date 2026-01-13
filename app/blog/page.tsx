// app/blog/page.tsx
import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import ArticlesClient from './ArticlesClient'; 
import { Suspense } from 'react';

// 1. ميتاداتا ديناميكية ومتقدمة للسيو
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'مقالات أبار جروب | دليل حفر الآبار والطاقة الشمسية في مصر',
    description: 'دليلك الشامل لتقنيات حفر وصيانة آبار المياه الجوفية، تكلفة الحفر، تراخيص الآبار، وأفضل حلول الطاقة الشمسية للمزارع في مصر.',
    keywords: [
      'حفر آبار مياه', 'ترخيص بئر مياه في مصر', 'طلمبات غاطسة', 
      'أسعار حفر الآبار 2025', 'طاقة شمسية للآبار', 'صيانة آبار جوفية',
      'طلمبات شاكتي الهندية', 'طلمبات فيرات'
    ],
    alternates: { canonical: 'https://www.abaargroup.com/blog' },
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
      title: 'مركز المعرفة - أبار جروب لحفر الآبار',
      description: 'اكتشف أحدث المقالات والدراسات الفنية حول عالم الآبار والطاقة الشمسية في مصر.',
      url: 'https://www.abaargroup.com/blog',
      siteName: 'أبار جروب',
      images: [
        {
          url: '/image/blog-hero-seo.jpg',
          width: 1200,
          height: 630,
          alt: 'مدونة أبار جروب لحفر الآبار',
        },
      ],
      locale: 'ar_EG',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'مدونة أبار جروب',
      description: 'دليلك الفني لحفر الآبار والطاقة الشمسية.',
      images: ['/image/blog-hero-seo.jpg'],
    },
  };
}

export default async function BlogPage() {
  // 2. جلب البيانات من السيرفر (SSR) لضمان ظهور المقالات في الـ HTML الأولي
  const { data: initialArticles, count, error } = await supabase
    .from("articles")
    .select("id, slug, title, category, image, meta_description, created_at, seo_title", { count: "exact" })
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .range(0, 11); // جلب أول 12 مقالاً لملء الصفحة بشكل جيد

  if (error) {
    console.error("Error fetching initial articles:", error);
  }

  return (
    <>
      {/* 3. إضافة البيانات المهيكلة (Structured Data) لجوجل */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "مدونة أبار جروب",
            "description": "دليل تقني حول حفر الآبار والطاقة الشمسية في مصر",
            "url": "https://www.abaargroup.com/blog",
            "publisher": {
              "@type": "Organization",
              "name": "أبار جروب",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.abaargroup.com/f.png"
              }
            }
          })
        }}
      />
      
      <Suspense fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
          <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mb-4"></div>
          <p className="font-black text-sky-600 animate-pulse text-2xl">جاري تهيئة مركز المعرفة...</p>
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