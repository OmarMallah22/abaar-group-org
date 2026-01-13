"use client";

import React, { Suspense, useMemo } from "react";
import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Home,
  BookOpen,
  Calendar,
  Tag
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// --- 1. الأنواع (Interfaces) ---
// تم جعل الحقول الثقيلة اختيارية (?) لتتوافق مع استعلام الـ select المحسن
export interface Article {
  id: number;
  slug: string;
  title: string;
  category: string;
  image: string;
  created_at: string;
  seo_title: string | null;
  meta_description: string | null;
  // حقول اختيارية لأننا لا نجلبها في صفحة القائمة لتوفير حجم البيانات
  content?: string; 
  updated_at?: string;
  key_phrase?: string | null;
  status?: string;
}

interface ArticlesClientProps {
  initialArticles: Article[];
  totalArticlesCount: number;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

// --- 2. مكون الترقيم الكامل ---
const PaginationComponent = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  isLoading 
}: PaginationProps) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-lg border border-slate-100">
            <button 
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-sky-50 text-sky-600 disabled:opacity-20 transition-all"
            >
                <ChevronLeft size={24} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                    key={num}
                    onClick={() => onPageChange(num)}
                    className={`w-12 h-12 rounded-xl font-black transition-all ${
                        currentPage === num 
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200" 
                        : "text-slate-400 hover:bg-sky-50"
                    }`}
                >
                    {num}
                </button>
            ))}

            <button 
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-sky-50 text-sky-600 disabled:opacity-20 transition-all"
            >
                <ChevronRight size={24} />
            </button>
        </div>
    );
};

// --- 3. مكون كرت المقال ---
const ArticleCard: React.FC<{ article: Article; priorityLoad?: boolean }> =
  React.memo(({ article, priorityLoad = false }) => {
    const date = new Date(article.created_at).toLocaleDateString("ar-EG", {
        year: 'numeric', month: 'short', day: 'numeric'
    });

    return (
      <article className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(8,112,184,0.15)]">
        <div className="relative aspect-[16/11] overflow-hidden">
          <Image
            src={article.image || "/image/placeholder.jpg"}
            alt={article.seo_title || article.title}
            fill
            priority={priorityLoad}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-5 right-5 z-10">
            <span className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500/90 backdrop-blur-md text-white text-xs font-bold rounded-full shadow-lg">
              <Tag size={12} />
              {article.category}
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-sky-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        <div className="p-8 flex flex-col text-right">
          <div className="flex items-center gap-3 text-slate-400 text-xs mb-4 font-bold">
            <span className="flex items-center gap-1"><Calendar size={14} className="text-sky-500" /> {date}</span>
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-4 line-clamp-2 group-hover:text-sky-600 transition-colors leading-relaxed">
            {article.title}
          </h3>
          
          <Link
            href={`/blog/${article.slug}`}
            className="mt-auto inline-flex items-center justify-between w-full p-4 rounded-2xl bg-slate-50 group-hover:bg-emerald-50 transition-all duration-300"
          >
            <span className="text-sky-700 group-hover:text-emerald-700 font-black text-sm">اقرأ المزيد</span>
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-all">
              <ArrowLeft className="h-4 w-4" />
            </div>
          </Link>
        </div>
      </article>
    );
  });
ArticleCard.displayName = "ArticleCard";

// --- 4. مكون الـ Hero ---
const BlogHero = () => (
  <section className="relative h-[50vh] md:h-[65vh] flex items-center justify-center overflow-hidden bg-sky-950">
    <video autoPlay muted loop playsInline className="absolute inset-0 z-0 w-full h-full object-cover opacity-50">
      <source src="/image/project.m4v" type="video/mp4" />
    </video>
    <div className="absolute inset-0 bg-gradient-to-b from-sky-900/60 via-transparent to-slate-50" />
    <div className="relative z-10 text-center px-4">
      <span className="inline-block px-6 py-2 bg-emerald-500 text-white text-sm font-black rounded-full mb-6 tracking-widest animate-bounce">
        مدونة أبار جروب
      </span>
      <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl">
        مركز <span className="text-emerald-400">المعرفة</span>
      </h1>
      <p className="mt-6 text-sky-50 text-lg md:text-xl max-w-2xl mx-auto font-medium opacity-90">
        مقالات تعليمية وأخبار حصرية حول تقنيات حفر وصيانة الآبار
      </p>
    </div>
  </section>
);

// --- 5. وظيفة جلب البيانات (الأعمدة المحددة) ---
const fetchArticles = async (page: number, limit: number) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, count, error } = await supabase
    .from("articles")
    .select("id, slug, title, category, image, meta_description, created_at, seo_title", { count: "exact" })
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    articles: data as Article[],
    total: count || 0,
  };
};

// --- 6. المكون الرئيسي ArticlesClient ---
const ArticlesClient = ({ initialArticles, totalArticlesCount }: ArticlesClientProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const articlesPerPage = 6;
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const { data, error, isLoading } = useSWR(
    ["articles", currentPage, articlesPerPage],
    () => fetchArticles(currentPage, articlesPerPage),
    { 
      fallbackData: currentPage === 1 
        ? { articles: initialArticles, total: totalArticlesCount } 
        : undefined,
      keepPreviousData: true 
    }
  );

  const totalItems = data?.total ?? totalArticlesCount;
  const totalPages = Math.ceil(totalItems / articlesPerPage);

  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "مركز المعرفة - أبار جروب",
    "description": "دليلك الشامل لتقنيات حفر وصيانة آبار المياه الجوفية في مصر.",
    "url": "https://www.abaargroup.com/blog",
    "isPartOf": {
      "@type": "Blog",
      "@id": "https://www.abaargroup.com/blog"
    },
    "publisher": {
      "@type": "Organization",
      "name": "أبار جروب",
      "logo": { "@type": "ImageObject", "url": "https://www.abaargroup.com/logo.png" }
    },
    "itemListElement": (data?.articles ?? initialArticles).map((article, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://www.abaargroup.com/blog/${article.slug}`,
      "name": article.title
    }))
  }), [data, initialArticles]);

  return (
    <main className="bg-slate-50 min-h-screen font-arabic pb-24" dir="rtl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <BlogHero />

      <div className="max-w-7xl mx-auto px-6 -translate-y-16 relative z-20">
        <nav className="flex items-center gap-3 text-sm font-bold bg-white/80 backdrop-blur-md w-fit px-8 py-4 rounded-3xl shadow-xl border border-white mb-12">
          <Link href="/" className="text-slate-400 hover:text-sky-600 flex items-center gap-2 transition-colors">
            <Home size={16} /> الرئيسية
          </Link>
          <ChevronRight size={14} className="text-slate-300 rotate-180" />
          <span className="text-emerald-600">مركز المعرفة</span>
        </nav>

        {error ? (
          <div className="p-16 text-center bg-white rounded-[3rem] shadow-xl text-red-500 font-bold border-2 border-dashed border-red-100">
             حدث خطأ أثناء تحميل المقالات.
          </div>
        ) : (
          <>
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 transition-all duration-700 ${isLoading ? "opacity-40 blur-sm" : "opacity-100"}`}>
              {(data?.articles ?? initialArticles).map((item, index) => (
                <ArticleCard key={item.id} article={item} priorityLoad={index < 3} />
              ))}
            </div>

            {!isLoading && (data?.articles?.length === 0) && (
              <div className="text-center py-40 bg-white rounded-[3rem] shadow-inner">
                <BookOpen size={80} className="mx-auto text-slate-200 mb-8" />
                <p className="text-2xl text-slate-400 font-black">لا توجد مقالات لعرضها حالياً.</p>
              </div>
            )}

            <div className="flex justify-center mt-20" dir="ltr">
                <PaginationComponent 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={(p: number) => {
                        router.push(`/blog?page=${p}`, { scroll: false });
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} 
                    isLoading={isLoading} 
                />
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default function ArticlesPageWrapper({ initialArticles, totalArticlesCount }: ArticlesClientProps) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 font-black text-sky-600 animate-pulse">جاري تهيئة المحتوى...</div>}>
      <ArticlesClient initialArticles={initialArticles} totalArticlesCount={totalArticlesCount} />
    </Suspense>
  );
}