import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ServiceDetailClient from './ServiceDetailClient';

interface Props {
  params: { serviceSlug: string };
}

/**
 * 1. دالة جلب بيانات الخدمة من السيرفر
 * تدعم فك تشفير الـ Slug العربي لضمان الوصول للخدمة بدقة عالية
 */
async function getService(slug: string) {
  const decodedSlug = decodeURIComponent(slug);
  const { data } = await supabase
    .from('services')
    .select('*')
    .eq('slug', decodedSlug)
    .single();
  return data;
}

/**
 * 2. توليد الميتا داتا الديناميكية (Dynamic SEO)
 * تم تحديث الروابط لتتوافق مع النطاق الرسمي abaargroup.org لضمان قوة الأرشفة
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getService(params.serviceSlug);

  if (!service) return { title: 'الخدمة غير موجودة | أبار جروب' };

  // تحسين العنوان والوصف ليكون غنياً بالكلمات المفتاحية (حفر، صيانة، توريد)
  const title = `${service.seo_title || service.title} | أبار جروب لحفر وصيانة الآبار`;
  const description = service.meta_description || service.description?.substring(0, 160);

  return {
    title: title,
    description: description,
    // تحديث الرابط الأصلي إلى .org لضمان اتساق الـ Canonical Tag
    alternates: { 
      canonical: `https://abaargroup.org/service/${params.serviceSlug}` 
    },
    openGraph: {
      title: title,
      description: description,
      url: `https://abaargroup.org/service/${params.serviceSlug}`,
      type: 'article',
      siteName: 'أبار جروب',
      images: [
        {
          url: service.image_url,
          width: 1200,
          height: 630,
          alt: `خدمة ${service.title} من أبار جروب`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [service.image_url],
    },
  };
}

export default async function Page({ params }: Props) {
  const service = await getService(params.serviceSlug);

  if (!service) notFound();

  /**
   * 3. البيانات المهيكلة المتقدمة (JSON-LD)
   * تم تحسينها لتعريف جوجل بالخدمة المحددة ومزود الخدمة الرسمي
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": service.meta_description || service.description?.substring(0, 160),
    "provider": {
      "@type": "Organization",
      "name": "أبار جروب",
      "url": "https://abaargroup.org",
      "logo": "https://abaargroup.org/image/icon.png"
    },
    "image": service.image_url,
    "areaServed": "EG",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "خدمات حفر وتوريد الآبار",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": service.title
          }
        }
      ]
    }
  };

  return (
    <>
      {/* حقن البيانات المهيكلة الخاصة بجوجل */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* تمرير البيانات للمكون العميل لعرض التفاصيل بصرياً */}
      <ServiceDetailClient initialService={service} />
    </>
  );
}