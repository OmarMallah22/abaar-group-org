"use client";

import React, { useMemo, useEffect, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { supabase } from '@/lib/supabase';
import ReactMarkdown from "react-markdown"; 
import remarkGfm from "remark-gfm";
import { 
  ArrowRight, Calendar, Facebook, Copy, Share2, 
  Clock, Tag, Home, ChevronLeft, Bookmark
} from "lucide-react"; 
import Image from "next/image";
import toast from "react-hot-toast";

// --- الواجهات ---
interface Article {
  id: number; slug: string; title: string;
  category: string; image: string;
  content: string; created_at: string;
  seo_title?: string; meta_description?: string;
  updated_at?: string;
}

interface RelatedArticle {
  id: number; slug: string; title: string;
  image: string; category: string; created_at: string;
}

// تحسين: تحديد الأعمدة المطلوبة للمقالات ذات الصلة
const fetchRelatedArticles = async (excludeId: number): Promise<RelatedArticle[]> => { 
  const { data } = await supabase
    .from("articles")
    .select("id, slug, title, image, category, created_at")
    .eq("status", "published")
    .neq("id", excludeId)
    .order('created_at', { ascending: false }) 
    .limit(3);
  return (data as RelatedArticle[]) || [];
};

// مكونات الماركدوان مع تحسين معالجة الصور والوصولية
const markdownComponents = {
  h2: ({...props}) => <h2 {...props} className="text-2xl md:text-3xl font-black text-slate-800 mt-16 mb-8 border-r-8 border-emerald-500 pr-6" />,
  h3: ({...props}) => <h3 {...props} className="text-xl md:text-2xl font-bold text-sky-700 mt-12 mb-6" />,
  ul: ({...props}) => <ul {...props} className="my-8 space-y-4 list-disc list-inside pr-4 text-slate-700 leading-relaxed" />,
  p: ({...props}) => <p {...props} className="my-8 leading-[2.3] text-lg text-slate-700 text-justify font-medium" />,
  img: ({src, alt}: any) => (
    <span className="block relative w-full aspect-video my-12 shadow-2xl rounded-[2.5rem] overflow-hidden border-8 border-white bg-slate-100">
      {src && (
        <Image 
          src={src} 
          alt={alt || 'توضيح المحتوى من أبار جروب'} 
          fill 
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="object-cover" 
        />
      )}
    </span>
  ),
};

export default function ArticleDetailsClient({ initialArticle }: { initialArticle: Article }) {
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const { data: relatedArticles, isLoading: relatedLoading } = useSWR(
    ["related", initialArticle.id],
    () => fetchRelatedArticles(initialArticle.id),
    { revalidateOnFocus: false }
  );

  const formattedDate = useMemo(() => {
    return new Date(initialArticle.created_at).toLocaleDateString('ar-EG', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  }, [initialArticle.created_at]);

  const copyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    toast.success("تم نسخ رابط المقال بنجاح", {
      style: { borderRadius: '15px', background: '#0ea5e9', color: '#fff' }
    });
  };

  const shareWhatsApp = () => {
    const text = `${initialArticle.title}\n${currentUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <main className="bg-[#f8fafc] min-h-screen pb-24 font-arabic text-right" dir="rtl">
      
      {/* Hero Header مع تحسين Priority */}
      <div className="relative h-[65vh] md:h-[75vh] w-full overflow-hidden bg-slate-950">
        <Image 
          src={initialArticle.image} 
          alt={initialArticle.seo_title || initialArticle.title} 
          fill 
          className="object-cover opacity-50 scale-105"
          priority // تحسين الـ LCP
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f8fafc] via-sky-950/40 to-transparent" />
        
        <div className="absolute inset-0  flex flex-col items-center justify-center max-w-5xl mx-auto px-6 text-center">
            <span className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-white text-sm font-black rounded-full mb-8 shadow-2xl animate-pulse mt-20">
  <Bookmark size={16} /> {initialArticle.category}
</span>

            <h1 className="text-4xl md:text-7xl font-black text-white leading-[1.2] drop-shadow-2xl">
                {initialArticle.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-white font-bold bg-white/10 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/20">
                <div className="flex items-center gap-3"><Calendar size={20} className="text-emerald-400" /> {formattedDate}</div>
                <div className="h-4 w-px bg-white/20 hidden md:block" />
                <div className="flex items-center gap-3"><Clock size={20} className="text-emerald-400" /> 6 دقائق قراءة</div>
            </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-3 text-sm font-bold text-slate-400 py-6 px-8 bg-white/90 backdrop-blur-md rounded-3xl -translate-y-1/2 border border-white shadow-xl w-fit mx-auto md:mx-0">
            <Link href="/" className="hover:text-sky-600 transition-colors" aria-label="الرئيسية"><Home size={18}/></Link>
            <ChevronLeft size={16} className="text-slate-300 rotate-180" />
            <Link href="/blog" className="hover:text-sky-600 transition-colors">مركز المعرفة</Link>
            <ChevronLeft size={16} className="text-slate-300 rotate-180" />
            <span className="text-emerald-600 truncate max-w-[150px] md:max-w-[300px]">{initialArticle.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12 mt-4">
            <div className="flex-1">
                <div className="bg-white rounded-[3.5rem] shadow-2xl p-8 md:p-20 border border-slate-100 relative overflow-hidden">
                    <article className="prose prose-xl prose-slate max-w-none prose-headings:font-black prose-a:text-sky-600">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                            {initialArticle.content}
                        </ReactMarkdown>
                    </article>

                    {/* Share Section مع تحسين Accessibility */}
                    <div className="mt-24 pt-16 border-t border-slate-100">
                        <div className="flex flex-col items-center">
                            <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
                                <Share2 size={24} className="text-emerald-500" /> شارك المعرفة مع غيرك
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
                                <button 
                                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`, '_blank')}
                                  aria-label="مشاركة على فيسبوك"
                                  className="flex items-center justify-center gap-4 px-8 py-5 bg-[#1877F2] text-white rounded-[1.5rem] font-black hover:scale-105 transition-all shadow-xl shadow-blue-200"
                                >
                                    <Facebook size={22} /> فيسبوك
                                </button>
                                <button 
                                  onClick={shareWhatsApp}
                                  aria-label="مشاركة على واتساب"
                                  className="flex items-center justify-center gap-4 px-8 py-5 bg-[#25D366] text-white rounded-[1.5rem] font-black hover:scale-105 transition-all shadow-xl shadow-green-200"
                                >
                                    <Share2 size={22} /> واتساب
                                </button>
                                <button 
                                  onClick={copyLink}
                                  aria-label="نسخ رابط المقال"
                                  className="flex items-center justify-center gap-4 px-8 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black hover:scale-105 transition-all shadow-xl shadow-slate-300"
                                >
                                    <Copy size={22} /> نسخ الرابط
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tags Section */}
                <section className="mt-12 flex flex-wrap gap-2">
                    {["حفر آبار مياه", "طاقة شمسية للآبار", "صيانة طلمبات", "تراخيص الآبار"].map((tag, index) => (
                        <span key={index} className="px-5 py-2 bg-sky-50 text-sky-700 border border-sky-100 rounded-full text-xs font-bold hover:bg-sky-600 hover:text-white transition-all cursor-default">
                            #{tag}
                        </span>
                    ))}
                </section>

                {/* Related Articles مع تحسين Loading State */}
                {relatedArticles && relatedArticles.length > 0 && (
                <section className="mt-24">
                    <div className="flex items-center gap-6 mb-12">
                        <h2 className="text-3xl font-black text-slate-800">مقالات <span className="text-sky-600">ذات صلة</span></h2>
                        <div className="h-1 flex-1 bg-sky-100 rounded-full" />
                    </div>
                    <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-opacity duration-500 ${relatedLoading ? 'opacity-50' : 'opacity-100'}`}>
                    {relatedArticles.map((ra) => (
                        <Link key={ra.id} href={`/blog/${ra.slug}`} className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                            <div className="relative h-48 overflow-hidden">
                                <Image src={ra.image} alt={ra.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute top-4 right-4 bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full">
                                    {ra.category}
                                </div>
                            </div>
                            <div className="p-6">
                                <h4 className="font-black text-slate-800 text-sm mb-4 line-clamp-2 leading-relaxed group-hover:text-sky-600 transition-colors">{ra.title}</h4>
                                <div className="flex items-center justify-between text-sky-600 font-black text-[10px]">
                                    <span>استكشف المقال</span>
                                    <ArrowRight size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                    </div>
                </section>
                )}
            </div>
        </div>
      </div>
    </main>
  );
}