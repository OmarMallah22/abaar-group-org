// app/blog/[slug]/page.tsx
import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import ArticleDetailsClient from './ArticleDetailsClient';
import { notFound } from 'next/navigation';

interface Props {
  params: { slug: string };
}

/**
 * 1. دالة جلب البيانات من السيرفر
 * تدعم فك تشفير الـ Slug العربي بشكل صحيح
 */
async function getArticle(slug: string) {
  const decodedSlug = decodeURIComponent(slug);
  const { data } = await supabase
    .from("articles")
    .select("id, slug, title, category, image, content, created_at, updated_at, seo_title, meta_description")
    .eq("slug", decodedSlug)
    .eq("status", "published")
    .single();
  return data;
}

/**
 * 2. توليد الميتا داتا الديناميكية (SEO)
 * تضمن ظهور العنوان والوصف والصورة في محركات البحث ومواقع التواصل
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticle(params.slug);

  if (!article) return { title: 'المقال غير موجود | أبار جروب' };

  return {
    title: article.seo_title || article.title,
    description: article.meta_description || "تعرف على أحدث تقنيات حفر الآبار وصيانتها وحلول الطاقة الشمسية مع أبار جروب.",
    alternates: { canonical: `https://www.abaargroup.com/blog/${params.slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      title: article.title,
      description: article.meta_description || "",
      url: `https://www.abaargroup.com/blog/${params.slug}`,
      type: 'article',
      publishedTime: article.created_at,
      modifiedTime: article.updated_at,
      images: [{ url: article.image, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.meta_description || "",
      images: [article.image],
    },
  };
}

export default async function Page({ params }: Props) {
  const article = await getArticle(params.slug);

  if (!article) notFound();

  /**
   * 3. البيانات المهيكلة (JSON-LD)
   * تساعد جوجل على فهم أن الصفحة مقال (BlogPosting) لعرضها في نتائج البحث المتقدمة
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "image": article.image,
    "datePublished": article.created_at,
    "dateModified": article.updated_at || article.created_at,
    "author": { 
      "@type": "Organization", 
      "name": "أبار جروب",
      "url": "https://www.abaargroup.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "أبار جروب",
      "logo": { "@type": "ImageObject", "url": "https://www.abaargroup.com/f.png" }
    },
    "description": article.meta_description,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.abaargroup.com/blog/${params.slug}`
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* تمرير البيانات للمكون العميل مع حل مشكلة الـ Interface */}
      <ArticleDetailsClient initialArticle={article} />
    </>
  );
}