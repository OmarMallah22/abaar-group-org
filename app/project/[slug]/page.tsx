// app/project/[slug]/page.tsx
import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ProjectDetailClient from './ProjectDetailClient';

interface Props {
  params: { slug: string };
}

/**
 * 1. دالة جلب البيانات من السيرفر (SSR)
 * تدعم فك تشفير الـ Slug العربي لضمان أرشفة الروابط الصديقة للسيو
 */
async function getProject(slug: string) {
  const decodedSlug = decodeURIComponent(slug);
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", decodedSlug)
    .single();
  return data;
}

/**
 * 2. توليد الميتا داتا الديناميكية (SEO A+)
 * تم دمج الكلمات المفتاحية الأساسية: توريد، حفر، صيانة، آبار، طاقة شمسية
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject(params.slug);

  if (!project) return { title: 'المشروع غير موجود | أبار جروب' };

  // صياغة عنوان احترافي (60 حرفاً) لتعزيز الظهور في نتائج البحث
  const title = `${project.title} | توريد وحفر وصيانة الآبار | أبار جروب`;
  const description = project.scope?.substring(0, 160).replace(/[#*]/g, '') || "اكتشف تفاصيل تنفيذ مشاريع حفر الآبار وتوريد الطلمبات والطاقة الشمسية بواسطة أبار جروب.";

  return {
    title: title,
    description: description,
    keywords: [
      project.title, 
      'حفر آبار في مصر', 
      'صيانة آبار جوفية', 
      'توريد طلمبات أعماق', 
      'مشروع طاقة شمسية', 
      'أبار جروب للمقاولات'
    ],
    // توحيد النطاق إلى .org لتعزيز سلطة الصفحة ومنع تكرار المحتوى
    alternates: { 
      canonical: `https://abaargroup.org/project/${params.slug}` 
    },
    openGraph: {
      title: title,
      description: description,
      url: `https://abaargroup.org/project/${params.slug}`,
      siteName: 'أبار جروب لخدمات الآبار',
      type: 'article',
      images: [
        {
          url: project.image,
          width: 1200,
          height: 630,
          alt: `توثيق مشروع ${project.title} من أبار جروب`,
        },
      ],
      locale: 'ar_EG',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [project.image],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const project = await getProject(params.slug);

  if (!project) notFound();

  /**
   * 3. البيانات المهيكلة المتقدمة (JSON-LD)
   * تعريف المشروع كـ "CreativeWork" مع ربطه بالمنظمة لظهور نتائج بحث غنية
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "image": project.image,
    "description": project.scope?.substring(0, 200),
    "locationCreated": {
      "@type": "Place",
      "name": project.location
    },
    "author": {
      "@type": "Organization",
      "name": "أبار جروب لحفر الآبار",
      "url": "https://abaargroup.org"
    },
    "publisher": {
      "@type": "Organization",
      "name": "أبار جروب",
      "logo": {
        "@type": "ImageObject",
        "url": "https://abaargroup.org/image/icon.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://abaargroup.org/project/${params.slug}`
    }
  };

  return (
    <>
      {/* حقن سكريبت السيو في الـ HTML الأولي */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* تمرير البيانات للمكون العميل لإتمام العرض البصري */}
      <ProjectDetailClient project={project} />
    </>
  );
}