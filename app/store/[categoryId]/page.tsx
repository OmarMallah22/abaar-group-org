// app/store/[categoryId]/page.tsx
import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import SubcategoriesClient from './SubcategoriesClient';
import { notFound } from 'next/navigation';

interface Props {
  params: { categoryId: string };
}

/**
 * 1. توليد ميتاداتا ديناميكية ومطورة للسيو (SEO A+)
 * تم تحسين العناوين لتشمل كلمات مفتاحية قوية: توريد، حفر، صيانة، آبار.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: category } = await supabase
    .from('categories_du')
    .select('name')
    .eq('id', params.categoryId)
    .single();

  if (!category) return { title: 'القسم غير موجود | أبار جروب' };

  // صياغة العنوان المثالي (حوالي 60 حرفاً) لنتائج البحث
  const title = `توريد مستلزمات ${category.name} | حفر وصيانة آبار مياه | أبار جروب`;
  const description = `تصفح كافة الأقسام الفرعية والمعدات التابعة لـ ${category.name}. نوفر أفضل حلول حفر الآبار وصيانة الطلمبات والطاقة الشمسية في مصر بأعلى جودة.`;

  return {
    title: title,
    description: description,
    // توحيد النطاق إلى .org لتقوية أرشفة المتجر ومنع تشتت الروابط
    alternates: { 
      canonical: `https://abaargroup.org/store/${params.categoryId}` 
    },
    openGraph: {
      title: `تسوق معدات ${category.name} - أبار جروب لتوريد الآبار`,
      description: description,
      url: `https://abaargroup.org/store/${params.categoryId}`,
      siteName: 'أبار جروب لخدمات الآبار',
      type: 'website',
      images: [
        {
          url: '/image/store-hero-seo.jpg',
          width: 1200,
          height: 630,
          alt: `أقسام منتجات ${category.name} من أبار جروب`,
        },
      ],
      locale: 'ar_EG',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: ['/image/store-hero-seo.jpg'],
    },
  };
}

export default async function Page({ params }: Props) {
  // 2. جلب البيانات من السيرفر (SSR) لضمان القراءة الفورية من عناكب البحث
  const [catResponse, subsResponse] = await Promise.all([
    supabase.from('categories_du').select('name').eq('id', params.categoryId).single(),
    supabase.from('subcategories_du').select('*').eq('category_id', params.categoryId).order('name', { ascending: true })
  ]);

  if (catResponse.error || !catResponse.data) {
    notFound();
  }

  /**
   * 3. البيانات المهيكلة المتقدمة (BreadcrumbList)
   * تساعد جوجل على فهم التسلسل الهرمي للمتجر وعرض مسار التنقل في نتائج البحث
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { 
        "@type": "ListItem", 
        "position": 1, 
        "name": "الرئيسية", 
        "item": "https://abaargroup.org" 
      },
      { 
        "@type": "ListItem", 
        "position": 2, 
        "name": "المتجر", 
        "item": "https://abaargroup.org/store" 
      },
      { 
        "@type": "ListItem", 
        "position": 3, 
        "name": catResponse.data.name, 
        "item": `https://abaargroup.org/store/${params.categoryId}` 
      }
    ]
  };

  return (
    <>
      {/* حقن البيانات المهيكلة في رأس الصفحة */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* تمرير البيانات للمكون العميل مع ضمان توافق الأنواع */}
      <SubcategoriesClient 
        initialCategory={catResponse.data} 
        initialSubs={subsResponse.data || []} 
        categoryId={params.categoryId}
      />
    </>
  );
}