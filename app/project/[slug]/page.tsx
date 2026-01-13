// app/project/[slug]/page.tsx
import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ProjectDetailClient from './ProjectDetailClient';

interface Props {
  params: { slug: string };
}

/**
 * 1. دالة جلب البيانات من السيرفر
 * تدعم فك تشفير الـ Slug العربي لضمان الوصول للمشروع بدقة
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
 * 2. توليد الميتا داتا الديناميكية (SEO)
 * تضمن ظهور مشروعك بصورة احترافية في نتائج البحث ومنصات التواصل
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject(params.slug);

  if (!project) return { title: 'المشروع غير موجود | أبار جروب' };

  return {
    title: `${project.title} | أبار جروب لحفر الآبار`,
    description: project.description?.substring(0, 160) || "تفاصيل مشروع تنفيذ بئر مياه أو محطة طاقة شمسية بواسطة أبار جروب.",
    alternates: { canonical: `https://www.abaargroup.com/project/${params.slug}` },
    openGraph: {
      title: project.title,
      description: project.description || "",
      url: `https://www.abaargroup.com/project/${params.slug}`,
      type: 'article',
      images: [
        {
          url: project.image,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description || "",
      images: [project.image],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const project = await getProject(params.slug);

  if (!project) notFound();

  /**
   * 3. البيانات المهيكلة (JSON-LD)
   * تساعد جوجل على تصنيف الصفحة كـ "عمل إبداعي/مشروع منفذ" (CreativeWork)
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "image": project.image,
    "description": project.description,
    "locationCreated": {
      "@type": "Place",
      "name": project.location
    },
    "author": {
      "@type": "Organization",
      "name": "أبار جروب",
      "url": "https://www.abaargroup.com"
    },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* تمرير البيانات للمكون العميل مع ضمان توافق الأنواع */}
      <ProjectDetailClient project={project} />
    </>
  );
}