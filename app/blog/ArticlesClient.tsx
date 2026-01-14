"use client";

import React, { Suspense, useMemo, useState } from "react";
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
  Tag,
  PenTool,
  Clock,
  Loader2
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// --- 1. الأنواع (Interfaces) ---
export interface Article {
  id: number;
  slug: string;
  title: string;
  category: string;
  image: string;
  created_at: string;
  seo_title: string | null;
  meta_description: string | null;
}

interface ArticlesClientProps {
  initialArticles: Article[];
  totalArticlesCount: number;
}

// --- 2. مكون الهيكل المؤقت (Skeleton Loader) - لتحسين سرعة الاستجابة المدركة ---
const ArticleSkeleton = () => (
  <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 p-4 space-y-4 animate-pulse">
    <div className="aspect-[16/11] bg-slate-200 rounded-[1.5rem]" />
    <div className="space-y-3 px-2">
      <div className="h-4 bg-slate-200 rounded w-1/3" />
      <div className="h-6 bg-slate-200 rounded w-full" />
      <div className="h-4 bg-slate-200 rounded w-2/3" />
    </div>
  </div>
);

// --- 3. مكون الترقيم المحسن (Pagination) ---
const PaginationComponent = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  isLoading 
}: { currentPage: number; totalPages: number; onPageChange: (p: number) => void; isLoading: boolean }) => {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="تنقل الصفحات" className="flex items-center gap-1.5 md:gap-2 bg-white p-2 rounded-2xl shadow-xl border border-slate-50">
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl hover:bg-sky-50 text-sky-600 disabled:opacity-20 transition-all shrink-0"
      >
        <ChevronLeft size={20} />
      </button>
      
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[200px] md:max-w-none">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`w-10 h-10 md:w-12 md:h-12 rounded-xl font-black text-sm transition-all shrink-0 ${
              currentPage === num 
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100" 
              : "text-slate-400 hover:bg-sky-50"
            }`}
          >
            {num}
          </button>
        ))}
      </div>

      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl hover:bg-sky-50 text-sky-600 disabled:opacity-20 transition-all shrink-0"
      >
        <ChevronRight size={20} />
      </button>
    </nav>
  );
};

// --- 4. مكون كرت المقال المحسن (Article Card) ---
const ArticleCard = React.memo(({ article, priorityLoad = false }: { article: Article; priorityLoad?: boolean }) => {
  const date = new Date(article.created_at).toLocaleDateString("ar-EG", {
      year: 'numeric', month: 'short', day: 'numeric'
  });

  return (
    <article className="group bg-white rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-slate-100 transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/10 flex flex-col h-full">
      <div className="relative aspect-[16/11] overflow-hidden">
        <Image
          src={article.image || "/image/placeholder.jpg"}
          alt={article.seo_title || article.title}
          fill
          priority={priorityLoad}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/95 backdrop-blur-sm text-white text-[10px] font-black rounded-full shadow-lg">
            <Tag size={10} /> {article.category}
          </span>
        </div>
      </div>

      <div className="p-6 md:p-8 flex flex-col flex-grow">
        <div className="flex items-center gap-4 text-slate-400 text-[10px] md:text-xs mb-4 font-bold">
          <span className="flex items-center gap-1"><Calendar size={14} className="text-sky-500" /> {date}</span>
          <span className="flex items-center gap-1"><PenTool size={14} className="text-emerald-500" /> أبار جروب</span>
        </div>
        
        <h3 className="text-lg md:text-xl font-black text-slate-800 mb-3 line-clamp-2 group-hover:text-sky-600 transition-colors leading-relaxed">
          {article.title}
        </h3>
        
        <p className="text-slate-500 text-xs md:text-sm mb-6 line-clamp-2 leading-relaxed font-bold">
           {article.meta_description || "دليلك الفني الشامل لحفر وصيانة آبار المياه في مصر."}
        </p>
        
        <Link
          href={`/blog/${article.slug}`}
          className="mt-auto inline-flex items-center justify-between w-full p-4 rounded-2xl bg-slate-50 group-hover:bg-emerald-50 transition-all duration-300"
        >
          <span className="text-sky-700 group-hover:text-emerald-700 font-black text-xs md:text-sm">تفاصيل المقال</span>
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-all">
            <ArrowLeft className="h-4 w-4" />
          </div>
        </Link>
      </div>
    </article>
  );
});
ArticleCard.displayName = "ArticleCard";
// --- 5. وظيفة جلب البيانات ---
const fetchArticles = async (page: number, limit: number) => {
  const from = (page - 1) * limit;
  const { data, count, error } = await supabase
    .from("articles")
    .select("id, slug, title, category, image, meta_description, created_at, seo_title", { count: "exact" })
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .range(from, from + limit - 1);

  if (error) throw error;
  return { articles: data as Article[], total: count || 0 };
};

// --- 6. المكون الرئيسي ArticlesClient ---
const ArticlesClient = ({ initialArticles, totalArticlesCount }: ArticlesClientProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const articlesPerPage = 6;
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const { data, error, isLoading } = useSWR(
    ["articles", currentPage],
    () => fetchArticles(currentPage, articlesPerPage),
    { 
      fallbackData: currentPage === 1 ? { articles: initialArticles, total: totalArticlesCount } : undefined,
      keepPreviousData: true,
      revalidateOnFocus: false
    }
  );

  const totalPages = Math.ceil((data?.total ?? totalArticlesCount) / articlesPerPage);

  const handlePageChange = (newPage: number) => {
    router.push(`/blog?page=${newPage}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="bg-slate-50 min-h-screen font-arabic pb-20 overflow-x-hidden" dir="rtl">
      
      {/* Hero Section المحسن */}
      <section className="relative h-[45vh] md:h-[65vh] flex items-center justify-center overflow-hidden bg-sky-950">
        <video 
          autoPlay muted loop playsInline 
          poster="/image/hero-poster.jpg"
          className="absolute inset-0 z-0 w-full h-full object-cover opacity-40 pointer-events-none"
        >
          <source src="/image/project.m4v" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-sky-900/60 via-transparent to-slate-50 z-[1]" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <span className="inline-block px-4 py-1.5 bg-emerald-500 text-white text-[10px] md:text-xs font-black rounded-full mb-4 tracking-widest shadow-lg">
            مركز المعرفة الفنية
          </span>
          <h1 className="text-3xl md:text-6xl lg:text-7xl font-black text-white drop-shadow-2xl leading-tight">
            مدونة <span className="text-emerald-400">حفر وصيانة</span> الآبار
          </h1>
          <p className="mt-4 md:mt-6 text-sky-50 text-sm md:text-xl lg:text-2xl font-bold opacity-95 leading-relaxed">
            دليلك الهندسي لتقنيات <strong>حفر آبار المياه</strong> وحلول <strong>الطاقة الشمسية</strong>.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 -translate-y-10 md:-translate-y-16 relative z-20">
        
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[10px] md:text-sm font-bold bg-white/90 backdrop-blur-md w-fit px-5 md:px-8 py-3 md:py-4 rounded-2xl md:rounded-3xl shadow-xl border border-white mb-8 md:mb-12">
          <Link href="/" className="text-slate-400 hover:text-sky-600 flex items-center gap-1 transition-colors shrink-0">
            <Home size={14} /> الرئيسية
          </Link>
          <ChevronRight size={12} className="text-slate-300 rotate-180 shrink-0" />
          <span className="text-emerald-600 truncate">مقالات أبار جروب الفنية</span>
        </nav>

        {error ? (
          <div className="p-10 md:p-16 text-center bg-white rounded-3xl shadow-xl text-red-500 font-bold border-2 border-dashed border-red-100">
              حدث خطأ في الاتصال، يرجى تحديث الصفحة.
          </div>
        ) : (
          <div className="space-y-12 md:space-y-20">
            {/* Grid Layout المحسن */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
              {isLoading && !data 
                ? Array.from({ length: 6 }).map((_, i) => <ArticleSkeleton key={i} />)
                : (data?.articles ?? []).map((item, index) => (
                    <ArticleCard key={item.id} article={item} priorityLoad={index < 3} />
                  ))
              }
            </div>

            {/* Empty State */}
            {!isLoading && data?.articles?.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl shadow-inner border border-slate-50">
                <BookOpen size={60} className="mx-auto text-slate-100 mb-6" />
                <p className="text-xl text-slate-400 font-black">لا توجد مقالات منشورة حالياً.</p>
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center" dir="ltr">
                <PaginationComponent 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onPageChange={handlePageChange} 
                  isLoading={isLoading} 
                />
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default function ArticlesPageWrapper({ initialArticles, totalArticlesCount }: ArticlesClientProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <Loader2 className="w-10 h-10 text-sky-600 animate-spin mb-4" />
        <p className="font-black text-sky-900 text-center">جاري تحميل الموسوعة الفنية...</p>
      </div>
    }>
      <ArticlesClient initialArticles={initialArticles} totalArticlesCount={totalArticlesCount} />
    </Suspense>
  );
}