// app/project/page.tsx
import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import ProjectsClient from './ProjectsClient';
import { Suspense } from 'react';

const PROJECTS_PER_PAGE = 6;

/**
 * 1. ميتاداتا متطورة (SEO A+) لعام 2026
 * تم ضبط الطول المثالي للعناوين والوصف لضمان أعلى نسبة نقر في نتائج البحث.
 */
export async function generateMetadata(): Promise<Metadata> {
  const title = 'سابقة أعمال أبار جروب | حفر وصيانة الآبار وتوريد الطاقة الشمسية';
  const description = 'استكشف سجل إنجازات أبار جروب في حفر وصيانة آبار المياه الجوفية، توريد طلمبات الأعماق، وتركيب محطات الطاقة الشمسية للمزارع والمشاريع الكبرى في مصر.';

  return {
    title: title,
    description: description,
    keywords: [
      'مشاريع أبار جروب', 
      'إنجازات حفر الآبار في مصر', 
      'توريد طلمبات مياه', 
      'صيانة آبار جوفية', 
      'محطات طاقة شمسية للمزارع', 
      'سابقة أعمال هندسية'
    ],
    // توحيد النطاق إلى .org لتعزيز الأرشفة الرسمية ومنع التشتت
    alternates: { 
      canonical: 'https://abaargroup.org/project' 
    },
    openGraph: {
      title: 'سابقة أعمال أبار جروب - ريادة في حلول المياه والطاقة',
      description: description,
      url: 'https://abaargroup.org/project',
      siteName: 'أبار جروب لحفر الآبار',
      images: [
        {
          url: '/image/projects-hero-seo.jpg',
          width: 1200,
          height: 630,
          alt: 'معرض مشاريع أبار جروب الناجحة في مصر',
        },
      ],
      locale: 'ar_EG',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: ['/image/projects-hero-seo.jpg'],
    },
  };
}

export default async function ProjectsPage() {
  // 2. جلب البيانات من السيرفر (SSR) لضمان ظهور المشاريع فوراً لعناكب البحث
  const { data: initialProjects, error } = await supabase
    .from("projects")
    .select("*")
    .range(0, PROJECTS_PER_PAGE - 1)
    .order("id", { ascending: false });

  if (error) {
    console.error("Error fetching initial projects:", error);
  }

  /**
   * 3. البيانات المهيكلة (JSON-LD)
   * تخبر جوجل أن هذه الصفحة هي "مجموعة أعمال" (CollectionPage) مما يحسن الظهور في الـ Knowledge Panel
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "سجل مشاريع أبار جروب للهندسة والمقاولات",
    "description": "قائمة المشاريع المنفذة بواسطة أبار جروب في مجالات توريد وحفر وصيانة الآبار والطاقة المتجددة.",
    "url": "https://abaargroup.org/project",
    "publisher": {
      "@type": "Organization",
      "name": "أبار جروب",
      "logo": {
        "@type": "ImageObject",
        "url": "https://abaargroup.org/image/icon.png"
      }
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": initialProjects?.map((p, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": p.title,
        "url": `https://abaargroup.org/project/${p.slug}`
      }))
    }
  };

  return (
    <>
      {/* حقن سكريبت السيو في رأس الصفحة */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main className="min-h-screen bg-slate-50 overflow-hidden">
        <Suspense fallback={
          <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
            <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mb-4"></div>
            <p className="font-black text-sky-900 animate-pulse text-xl">جاري تحميل سجل الإنجازات...</p>
          </div>
        }>
          {/* تمرير البيانات للمكون العميل */}
          <ProjectsClient initialProjects={initialProjects || []} />
        </Suspense>
      </main>
    </>
  );
}