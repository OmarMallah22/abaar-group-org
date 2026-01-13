// app/product/[id]/page.tsx
import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import ProductContent from './ProductContent';
import { notFound } from 'next/navigation';

interface Props {
  params: { id: string };
}

/**
 * 1. جلب بيانات المنتج من السيرفر (SSR)
 */
async function getProduct(id: string) {
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  return product;
}

/**
 * 2. توليد الميتا داتا الديناميكية (SEO A+)
 * تم تحسين العناوين لتشمل الكلمات المفتاحية: توريد، آبار، طلمبات، صيانة
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.id);

  if (!product) return { title: 'المنتج غير موجود | أبار جروب' };

  // صياغة العنوان المثالي (50-60 حرفاً)
  const title = `${product.name} | توريد ومستلزمات آبار المياه | أبار جروب`;
  // تنظيف الوصف من رموز الماركدوان وضبط الطول
  const description = product.Description?.substring(0, 160).replace(/[#*]/g, '') || "اكتشف أفضل طلمبات ومستلزمات آبار المياه في مصر مع أبار جروب.";

  return {
    title: title,
    description: description,
    keywords: [
      product.name, 
      'توريد طلمبات مياه', 
      'مستلزمات آبار', 
      'أبار جروب', 
      'صيانة آبار مصر',
      'قطع غيار طلمبات أعماق'
    ],
    // توحيد النطاق إلى .org لتقوية الأرشفة
    alternates: { 
      canonical: `https://abaargroup.org/product/${params.id}` 
    },
    openGraph: {
      title: title,
      description: description,
      url: `https://abaargroup.org/product/${params.id}`,
      siteName: 'أبار جروب لخدمات الآبار',
      type: 'website',
      images: [
        {
          url: product.image || '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `منتج ${product.name} من شركة أبار جروب`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [product.image || '/og-image.jpg'],
    },
  };
}

export default async function Page({ params }: Props) {
  const product = await getProduct(params.id);

  if (!product) notFound();

  /**
   * 3. البيانات المهيكلة (Product Schema - JSON-LD)
   * هذه الخطوة تضمن ظهور المنتج بـ "نجوم التقييم" والسعر في نتائج بحث جوجل
   */
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.image,
    "description": product.Description?.substring(0, 160),
    "brand": {
      "@type": "Brand",
      "name": product.brand || "أبار جروب"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://abaargroup.org/product/${product.id}`,
      "priceCurrency": "EGP",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "أبار جروب لحفر وصيانة الآبار"
      }
    }
  };

  return (
    <>
      {/* حقن الـ Schema في الـ HTML الأولي لضمان الأرشفة السريعة */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* تمرير البيانات للمكون العميل */}
      <ProductContent product={product} params={params} />
    </>
  );
}