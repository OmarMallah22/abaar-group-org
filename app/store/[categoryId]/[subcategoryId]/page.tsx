// app/store/[categoryId]/[subcategoryId]/page.tsx
import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import ProductsClient from './ProductsClient';
import { notFound } from 'next/navigation';

interface Props {
  params: { categoryId: string; subcategoryId: string };
}

/**
 * 1. توليد ميتاداتا ديناميكية متطورة (SEO A+)
 * تم تحسين العناوين لتشمل كلمات مفتاحية قوية: توريد، حفر، صيانة، آبار.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: sub } = await supabase
    .from('subcategories_du')
    .select('name, category:category_id (name)')
    .eq('id', params.subcategoryId)
    .single();

  if (!sub) return { title: 'المنتجات الفنية | أبار جروب' };

  const subName = sub.name;
  const catName = (sub.category as any)?.name || "";

  // صياغة العنوان المثالي (حوالي 60 حرفاً) لنتائج البحث 2026
  const title = `توريد ${subName} - ${catName} | صيانة وحفر آبار مياه | أبار جروب`;
  const description = `اكتشف أفضل موديلات ${subName} الأصلية ضمن فئة ${catName} لتجهيز وصيانة آبار المياه الجوفية وأنظمة الطاقة الشمسية في مصر بأعلى جودة وضمان أبار جروب.`;

  return {
    title: title,
    description: description,
    // توحيد النطاق إلى .org لتقوية أرشفة المتجر ومنع تشتت الروابط
    alternates: { 
      canonical: `https://abaargroup.org/store/${params.categoryId}/${params.subcategoryId}` 
    },
    openGraph: {
      title: `${subName} بمواصفات هندسية عالمية - أبار جروب`,
      description: description,
      url: `https://abaargroup.org/store/${params.categoryId}/${params.subcategoryId}`,
      siteName: 'أبار جروب لخدمات الآبار',
      type: 'website',
      images: [
        {
          url: '/image/store-hero-seo.jpg',
          width: 1200,
          height: 630,
          alt: `كتالوج منتجات ${subName} من أبار جروب`,
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
  const [subRes, prodRes, brandRes] = await Promise.all([
    supabase
      .from('subcategories_du')
      .select('name, category:category_id (id, name)')
      .eq('id', params.subcategoryId)
      .single(),
    supabase
      .from('products')
      .select('*')
      .eq('subcategory_id', params.subcategoryId)
      .order('name', { ascending: true }),
    supabase
      .from('brands')
      .select('name')
      .eq('subcategory_id', params.subcategoryId)
  ]);

  if (!subRes.data) notFound();

  const subInfo = {
    name: subRes.data.name,
    parent_id: (subRes.data.category as any)?.id,
    parent_name: (subRes.data.category as any)?.name
  };

  /**
   * 3. البيانات المهيكلة المتقدمة (JSON-LD)
   * تظهر المنتجات كقائمة غنية (ItemList) في نتائج بحث جوجل مما يزيد نسبة النقر CTR
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `كتالوج توريد ${subInfo.name} - أبار جروب`,
    "description": `قائمة موديلات ${subInfo.name} المتاحة لتجهيز وصيانة آبار المياه في مصر.`,
    "url": `https://abaargroup.org/store/${params.categoryId}/${params.subcategoryId}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": prodRes.data?.length || 0,
      "itemListElement": prodRes.data?.map((p, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "url": `https://abaargroup.org/product/${p.id}`,
        "name": p.name,
        "image": p.image
      }))
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": "https://abaargroup.org" },
        { "@type": "ListItem", "position": 2, "name": "المتجر", "item": "https://abaargroup.org/store" },
        { "@type": "ListItem", "position": 3, "name": subInfo.parent_name, "item": `https://abaargroup.org/store/${params.categoryId}` },
        { "@type": "ListItem", "position": 4, "name": subInfo.name, "item": `https://abaargroup.org/store/${params.categoryId}/${params.subcategoryId}` }
      ]
    }
  };

  return (
    <>
      {/* حقن البيانات المهيكلة في رأس الصفحة */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* تمرير البيانات للمكون العميل مع ضمان توافق الأنواع */}
      <ProductsClient 
        initialProducts={prodRes.data || []} 
        initialBrands={brandRes.data || []} 
        subcategoryInfo={subInfo}
        params={params}
      />
    </>
  );
}