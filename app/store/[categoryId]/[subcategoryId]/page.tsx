// app/store/[categoryId]/[subcategoryId]/page.tsx
import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import ProductsClient from './ProductsClient';
import { notFound } from 'next/navigation';

interface Props {
  params: { categoryId: string; subcategoryId: string };
}

/**
 * 1. توليد ميتاداتا ديناميكية ذكية
 * تجعل القسم يظهر في جوجل بعنوان المنتج والفئة بشكل احترافي
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: sub } = await supabase
    .from('subcategories_du')
    .select('name, category:category_id (name)')
    .eq('id', params.subcategoryId)
    .single();

  if (!sub) return { title: 'المنتجات | أبار جروب' };

  const subName = sub.name;
  const catName = (sub.category as any)?.name || "";

  return {
    title: `${subName} - ${catName} | متجر أبار جروب`,
    description: `تصفح تشكيلة واسعة من ${subName} ضمن فئة ${catName}. معدات أصلية بضمان أبار جروب وحلول الطاقة الشمسية.`,
    alternates: { canonical: `https://www.abaargroup.com/store/${params.categoryId}/${params.subcategoryId}` },
    openGraph: {
      title: `${subName} بمواصفات عالمية`,
      description: `أفضل أسعار وماركات ${subName} في مصر والوطن العربي.`,
      type: 'website',
    },
  };
}

export default async function Page({ params }: Props) {
  // 2. جلب البيانات من السيرفر (SSR) لضمان السرعة القصوى
  const [subRes, prodRes, brandRes] = await Promise.all([
    supabase
      .from('subcategories_du')
      .select('name, category:category_id (id, name)')
      .eq('id', params.subcategoryId)
      .single(),
    supabase.from('products').select('*').eq('subcategory_id', params.subcategoryId),
    supabase.from('brands').select('name').eq('subcategory_id', params.subcategoryId)
  ]);

  if (!subRes.data) notFound();

  const subInfo = {
    name: subRes.data.name,
    parent_id: (subRes.data.category as any)?.id,
    parent_name: (subRes.data.category as any)?.name
  };

  /**
   * 3. البيانات المهيكلة (JSON-LD)
   * تظهر المنتجات كقائمة (ItemList) في نتائج بحث جوجل
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `منتجات ${subInfo.name}`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": prodRes.data?.slice(0, 10).map((p, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "url": `https://www.abaargroup.com/product/${p.id}`,
        "name": p.name
      }))
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductsClient 
        initialProducts={prodRes.data || []} 
        initialBrands={brandRes.data || []} 
        subcategoryInfo={subInfo}
        params={params}
      />
    </>
  );
}