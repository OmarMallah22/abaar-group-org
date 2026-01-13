// app/service/[serviceSlug]/page.tsx
import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ServiceDetailClient from './ServiceDetailClient';

interface Props {
  params: { serviceSlug: string };
}

/**
 * 1. دالة جلب بيانات الخدمة من السيرفر
 * تدعم فك تشفير الـ Slug العربي لضمان الوصول للخدمة بدقة
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
 * 2. توليد الميتا داتا الديناميكية (SEO)
 * تضمن ظهور الخدمة بشكل احترافي في نتائج بحث جوجل
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getService(params.serviceSlug);

  if (!service) return { title: 'الخدمة غير موجودة | أبار جروب' };

  return {
    title: `${service.seo_title || service.title} | أبار جروب`,
    description: service.meta_description || service.description?.substring(0, 160),
    alternates: { canonical: `https://www.abaargroup.com/service/${params.serviceSlug}` },
    openGraph: {
      title: service.title,
      description: service.meta_description || "",
      url: `https://www.abaargroup.com/service/${params.serviceSlug}`,
      type: 'article',
      images: [
        {
          url: service.image_url,
          width: 1200,
          height: 630,
          alt: service.title,
        },
      ],
    },
  };
}

export default async function Page({ params }: Props) {
  const service = await getService(params.serviceSlug);

  if (!service) notFound();

  /**
   * 3. البيانات المهيكلة (JSON-LD)
   * تساعد جوجل على تصنيف الصفحة كخدمة مهنية (Professional Service)
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": service.meta_description || service.description,
    "provider": {
      "@type": "Organization",
      "name": "أبار جروب",
      "url": "https://www.abaargroup.com"
    },
    "image": service.image_url,
    "areaServed": "EG"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* تمرير البيانات للمكون العميل مع ضمان توافق الأنواع */}
      <ServiceDetailClient initialService={service} />
    </>
  );
}