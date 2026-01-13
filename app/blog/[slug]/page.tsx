// app/blog/[slug]/page.tsx
import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import ArticleDetailsClient from './ArticleDetailsClient';
import { notFound } from 'next/navigation';

interface Props {
  params: { slug: string };
}

/**
 * 1. دالة جلب بيانات المقال من السيرفر
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
 * 2. توليد الميتا داتا الديناميكية (SEO A+)
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticle(params.slug);

  if (!article) return { title: 'المقال غير موجود | أبار جروب' };

  // تحسين العنوان والوصف ليكون مثالياً لمحركات البحث
  const title = article.seo_title || `${article.title} | مدونة أبار جروب الفنية`;
  const description = article.meta_description || article.content.substring(0, 160).replace(/[#*]/g, '');

  return {
    title: title,
    description: description,
    // توحيد النطاق إلى .org لتقوية الأرشفة ومنع التشتت
    alternates: { 
      canonical: `https://abaargroup.org/blog/${params.slug}` 
    },
    robots: { 
        index: true, 
        follow: true,
        'max-image-preview': 'large' 
    },
    openGraph: {
      title: title,
      description: description,
      url: `https://abaargroup.org/blog/${params.slug}`,
      type: 'article',
      publishedTime: article.created_at,
      modifiedTime: article.updated_at,
      authors: ['فريق أبار جروب'],
      images: [
        { 
          url: article.image, 
          width: 1200, 
          height: 630, 
          alt: `دراسة فنية حول ${article.title}` 
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [article.image],
    },
  };
}

export default async function Page({ params }: Props) {
  const article = await getArticle(params.slug);

  if (!article) notFound();

  /**
   * 3. البيانات المهيكلة المتقدمة (JSON-LD) لرفع تقييم جوجل
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
    "description": article.meta_description,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://abaargroup.org/blog/${params.slug}`
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleDetailsClient initialArticle={article} />
    </>
  );
}