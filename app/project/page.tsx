// app/project/page.tsx
import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import ProjectsClient from './ProjectsClient';
import { Suspense } from 'react';

const PROJECTS_PER_PAGE = 6;

/**
 * 1. ميتاداتا متطورة لضمان أرشفة مشاريع الشركة بشكل ممتاز في جوجل
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'مشاريعنا وإنجازاتنا | أبار جروب لحفر الآبار',
    description: 'شاهد سجل إنجازات أبار جروب في حفر الآبار الجوفية، محطات الطاقة الشمسية، وتوريد الطلمبات. مشاريع ناجحة في كافة محافظات مصر بجودة عالمية.',
    keywords: [
      'مشاريع أبار جروب', 'إنجازات حفر الآبار', 'محطات طاقة شمسية في مصر', 
      'تجارب ضخ ناجحة', 'صيانة آبار جوفية بمصر', 'سابقة أعمال أبار جروب'
    ],
    alternates: { canonical: 'https://www.abaargroup.com/project' },
    openGraph: {
      title: 'سابقة أعمال أبار جروب - ريادة في حلول المياه والطاقة',
      description: 'استكشف كبرى المشروعات التي نفذتها أبار جروب في قطاع المياه والزراعة والطاقة المتجددة.',
      url: 'https://www.abaargroup.com/project',
      siteName: 'أبار جروب',
      images: [
        {
          url: '/image/projects-hero-seo.jpg', // تأكد من وجود صورة بهذا الاسم
          width: 1200,
          height: 630,
          alt: 'مشاريع أبار جروب حفر آبار وطاقة شمسية',
        },
      ],
      locale: 'ar_EG',
      type: 'website',
    },
  };
}

export default async function ProjectsPage() {
  // 2. جلب البيانات من السيرفر لضمان سرعة التحميل الأولية (SSR)
  const { data: initialProjects, error } = await supabase
    .from("projects")
    .select("*")
    .range(0, PROJECTS_PER_PAGE - 1)
    .order("id", { ascending: false });

  if (error) {
    console.error("Error fetching initial projects:", error);
  }

  /**
   * 3. البيانات المهيكلة (Structured Data) لجوجل
   * تخبر جوجل أن هذه الصفحة تحتوي على "معرض أعمال" (Portfolio) أو قائمة مشاريع ناجحة
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "مشاريع أبار جروب",
    "description": "قائمة المشاريع المنفذة بواسطة أبار جروب في مجالات الطاقة والمياه.",
    "url": "https://www.abaargroup.com/project",
    "publisher": {
      "@type": "Organization",
      "name": "أبار جروب",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.abaargroup.com/f.png"
      }
    }
  };

  return (
    <>
      {/* سكريبت السيو لنتائج البحث */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main className="min-h-screen bg-slate-50 overflow-hidden">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-600"></div>
          </div>
        }>
          {/* تمرير البيانات للمكون العميل مع حل مشكلة الـ TypeScript */}
          <ProjectsClient initialProjects={initialProjects || []} />
        </Suspense>
      </main>
    </>
  );
}