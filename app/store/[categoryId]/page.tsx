// app/store/[categoryId]/page.tsx
import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import SubcategoriesClient from './SubcategoriesClient';
import { notFound } from 'next/navigation';

interface Props {
  params: { categoryId: string };
}

/**
 * 1. توليد ميتاداتا ديناميكية بناءً على اسم القسم
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: category } = await supabase
    .from('categories_du')
    .select('name')
    .eq('id', params.categoryId)
    .single();

  if (!category) return { title: 'القسم غير موجود | أبار جروب' };

  return {
    title: `أقسام ${category.name} | متجر أبار جروب`,
    description: `تصفح كافة الأقسام الفرعية والمنتجات التابعة لـ ${category.name}. حلول متميزة لحفر الآبار والطاقة الشمسية.`,
    alternates: { canonical: `https://www.abaargroup.com/store/${params.categoryId}` },
    openGraph: {
      title: `تسوق منتجات ${category.name} - أبار جروب`,
      description: `تشكيلة واسعة من المعدات والمستلزمات الخاصة بـ ${category.name}.`,
      url: `https://www.abaargroup.com/store/${params.categoryId}`,
      type: 'website',
    },
  };
}

export default async function Page({ params }: Props) {
  // 2. جلب البيانات من السيرفر (SSR)
  const [catResponse, subsResponse] = await Promise.all([
    supabase.from('categories_du').select('name').eq('id', params.categoryId).single(),
    supabase.from('subcategories_du').select('*').eq('category_id', params.categoryId)
  ]);

  if (catResponse.error || !catResponse.data) {
    notFound();
  }

  /**
   * 3. البيانات المهيكلة (JSON-LD)
   * تساعد جوجل على فهم التسلسل الهرمي للمتجر (BreadcrumbList)
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": "https://www.abaargroup.com" },
      { "@type": "ListItem", "position": 2, "name": "المتجر", "item": "https://www.abaargroup.com/store" },
      { "@type": "ListItem", "position": 3, "name": catResponse.data.name, "item": `https://www.abaargroup.com/store/${params.categoryId}` }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* تمرير البيانات للمكون العميل مع حل مشكلة الـ Interface */}
      <SubcategoriesClient 
        initialCategory={catResponse.data} 
        initialSubs={subsResponse.data || []} 
        categoryId={params.categoryId}
      />
    </>
  );
}