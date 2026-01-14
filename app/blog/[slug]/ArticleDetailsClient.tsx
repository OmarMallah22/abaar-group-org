"use client";

import React, { useMemo, useEffect, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { supabase } from '@/lib/supabase';
import ReactMarkdown from "react-markdown"; 
import remarkGfm from "remark-gfm";
import { 
  ArrowLeft, Calendar, Facebook, Copy, Share2, 
  Clock, Tag, Home, ChevronLeft, Bookmark, List, 
  ChevronRight, ArrowUpRight, User
} from "lucide-react"; 
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from 'framer-motion';

// --- الواجهات (Interfaces) ---
interface Article {
  id: number; 
  slug: string; 
  title: string;
  category: string; 
  image: string;
  content: string; 
  created_at: string;
  seo_title?: string; 
  meta_description?: string;
  updated_at?: string;
}

interface RelatedArticle {
  id: number; 
  slug: string; 
  title: string;
  image: string; 
  category: string; 
  created_at: string;
}

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

const markdownComponents = {
  h2: ({node, ...props}: any) => {
    const id = props.children?.toString().replace(/\s+/g, '-').toLowerCase();
    return <h2 id={id} {...props} className="text-xl md:text-3xl font-black text-slate-800 mt-10 md:mt-16 mb-6 md:mb-8 border-r-4 md:border-r-8 border-emerald-500 pr-4 md:pr-6 scroll-mt-24" />;
  },
  h3: ({...props}) => <h3 className="text-lg md:text-2xl font-bold text-sky-700 mt-8 md:mt-12 mb-4 md:mb-6" {...props} />,
  ul: ({...props}) => <ul {...props} className="my-6 md:my-8 space-y-3 md:space-y-4 list-disc list-inside pr-2 md:pr-4 text-slate-700 leading-relaxed text-sm md:text-base" />,
  ol: ({...props}) => <ol {...props} className="my-6 md:my-8 space-y-3 md:space-y-4 list-decimal list-inside pr-2 md:pr-4 text-slate-700 leading-relaxed text-sm md:text-base" />,
  p: ({...props}) => <p {...props} className="my-6 md:my-8 leading-relaxed md:leading-[2.3] text-base md:text-lg text-slate-700 text-justify font-medium" />,
  blockquote: ({...props}) => <blockquote className="border-r-4 border-emerald-500 bg-emerald-50/50 p-5 md:p-8 my-8 md:my-10 rounded-xl md:rounded-2xl italic text-slate-800 text-sm md:text-base" {...props} />,
  img: ({src, alt}: any) => (
    <span className="block relative w-full aspect-video my-8 md:my-12 shadow-xl rounded-2xl md:rounded-[2.5rem] overflow-hidden border-4 md:border-8 border-white bg-slate-100">
      <Image src={src} alt={alt || 'توضيح فني'} fill sizes="(max-width: 768px) 100vw, 1200px" className="object-cover" />
    </span>
  ),
};

export default function ArticleDetailsClient({ initialArticle }: { initialArticle: Article }) {
  const [currentUrl, setCurrentUrl] = useState("");
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    setCurrentUrl(window.location.href);
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(progress);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: relatedArticles, isLoading: relatedLoading } = useSWR(
    ["related", initialArticle.id],
    () => fetchRelatedArticles(initialArticle.id),
    { revalidateOnFocus: false }
  );

  const tableOfContents = useMemo(() => {
    const headings = initialArticle.content.match(/^##\s+(.*)$/gm);
    return headings?.map(h => h.replace('## ', '')) || [];
  }, [initialArticle.content]);

  const formattedDate = useMemo(() => {
    return new Date(initialArticle.created_at).toLocaleDateString('ar-EG', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  }, [initialArticle.created_at]);

  const shareData = {
    title: initialArticle.title,
    url: currentUrl
  };

  const copyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    toast.success("تم نسخ الرابط");
  };

  // بيانات Schema لتعزيز السيو
  const articleSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": initialArticle.title,
    "image": initialArticle.image,
    "datePublished": initialArticle.created_at,
    "author": { "@type": "Organization", "name": "أبار جروب" },
    "description": initialArticle.meta_description
  }), [initialArticle]);

  return (
    <main className="bg-[#f8fafc] min-h-screen pb-20 font-arabic text-right overflow-x-hidden" dir="rtl">
      <Toaster position="bottom-center" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      
      {/* مؤشر القراءة */}
      <div className="fixed top-0 left-0 w-full h-1 z-[110] bg-transparent">
        <div className="h-full bg-emerald-500 transition-all duration-100" style={{ width: `${readingProgress}%` }} />
      </div>

      {/* Hero Header */}
      <div className="relative h-[50vh] md:h-[70vh] w-full overflow-hidden bg-slate-950">
        <Image 
          src={initialArticle.image} 
          alt={initialArticle.title} 
          fill 
          priority 
          className="object-cover opacity-40" 
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f8fafc] via-transparent to-transparent" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center max-w-5xl mx-auto px-4 text-center z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500 text-white text-[10px] md:text-xs font-black rounded-full mb-6 shadow-xl"
          >
            <Bookmark size={14} /> {initialArticle.category}
          </motion.div>

          <h1 className="text-2xl md:text-5xl lg:text-7xl font-black text-white leading-tight drop-shadow-2xl px-2">
            {initialArticle.title}
          </h1>

          <div className="hidden md:flex items-center justify-center gap-6 mt-10 text-white font-bold bg-black/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 text-sm"><Calendar size={18} className="text-emerald-400" /> {formattedDate}</div>
            <div className="flex items-center gap-2 text-sm"><Clock size={18} className="text-emerald-400" /> 5 دقائق قراءة</div>
            <div className="flex items-center gap-2 text-sm"><User size={18} className="text-emerald-400" /> أبار جروب</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Breadcrumbs - Responsive Adjustment */}
        <nav aria-label="Breadcrumb" className="relative z-30 flex items-center gap-2 text-[10px] md:text-sm font-bold text-slate-400 py-3 md:py-5 px-4 md:px-8 bg-white/95 backdrop-blur-md rounded-2xl md:rounded-3xl md:-translate-y-1/2 border border-slate-100 shadow-xl w-full md:w-fit mx-auto lg:mx-0 mt-4 md:mt-0">
          <Link href="/" className="hover:text-sky-600 transition-colors"><Home size={16}/></Link>
          <ChevronLeft size={14} className="text-slate-300" />
          <Link href="/blog" className="hover:text-sky-600 transition-colors">المقالات</Link>
          <ChevronLeft size={14} className="text-slate-300" />
          <span className="text-emerald-600 truncate">{initialArticle.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 mt-8">
          
          {/* محتوى المقال */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl md:rounded-[3.5rem] shadow-xl p-5 md:p-12 lg:p-20 border border-slate-50">
              <div className="mb-8 md:mb-12 pb-8 md:pb-12 border-b border-slate-100">
                 <p className="text-base md:text-xl text-slate-600 leading-relaxed font-bold italic">
                    في هذا المقال، يستعرض خبراء <strong>أبار جروب</strong> دليلاً شاملاً حول {initialArticle.title}.
                 </p>
              </div>

              <article className="prose prose-slate max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {initialArticle.content}
                </ReactMarkdown>
              </article>

              {/* Share Buttons */}
              <div className="mt-16 md:mt-24 pt-10 border-t border-slate-100">
                <div className="text-center">
                  <h3 className="text-lg md:text-2xl font-black text-slate-800 mb-8 flex items-center justify-center gap-2">
                    <Share2 size={24} className="text-emerald-500" /> شارك المقال
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button 
                      onClick={() => window.open(`https://facebook.com/sharer/sharer.php?u=${currentUrl}`, '_blank')}
                      className="flex items-center justify-center gap-3 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all"
                    >
                      <Facebook size={18} /> فيسبوك
                    </button>
                    <button 
                      onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(initialArticle.title + ' ' + currentUrl)}`, '_blank')}
                      className="flex items-center justify-center gap-3 py-4 bg-emerald-500 text-white rounded-2xl font-black text-sm hover:bg-emerald-600 transition-all"
                    >
                      <Share2 size={18} /> واتساب
                    </button>
                    <button 
                      onClick={copyLink}
                      className="flex items-center justify-center gap-3 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-all"
                    >
                      <Copy size={18} /> نسخ الرابط
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side Content */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Table of Contents */}
            {tableOfContents.length > 0 && (
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-slate-50 lg:sticky lg:top-24">
                <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-50 pb-4">
                  <List size={20} className="text-sky-600" /> محتويات المقال
                </h3>
                <ul className="space-y-4">
                  {tableOfContents.map((heading, idx) => (
                    <li key={idx}>
                      <a 
                        href={`#${heading.replace(/\s+/g, '-').toLowerCase()}`}
                        className="text-slate-600 hover:text-sky-600 font-bold text-xs md:text-sm flex items-center gap-2 transition-all"
                      >
                        <ChevronRight size={14} className="text-emerald-500" />
                        {heading}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA Sidebar */}
            <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
               <h4 className="text-xl font-black mb-4">هل تحتاج لمساعدة فنية؟</h4>
               <p className="text-slate-400 mb-8 text-sm leading-relaxed">فريق أبار جروب متاح دائماً لتقديم الاستشارات المتخصصة في حفر وصيانة آبار المياه.</p>
               <Link href="/contact" className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-4 rounded-xl font-black transition-all w-full justify-center text-sm">
                 تواصل معنا الآن <ArrowUpRight size={18} />
               </Link>
            </div>
          </aside>
        </div>

        {/* Related Articles */}
        {relatedArticles && relatedArticles.length > 0 && (
          <section className="mt-20 md:mt-32">
            <div className="flex items-center gap-4 mb-10 md:mb-16 px-2">
              <h2 className="text-xl md:text-4xl font-black text-slate-800 shrink-0">مقالات <span className="text-sky-600">ذات صلة</span></h2>
              <div className="h-0.5 flex-1 bg-slate-100 rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
              {relatedArticles.map((ra) => (
                <Link key={ra.id} href={`/blog/${ra.slug}`} className="group bg-white rounded-3xl overflow-hidden border border-slate-50 shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="relative h-48 md:h-56">
                    <Image src={ra.image} alt={ra.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md mb-3 inline-block">
                      {ra.category}
                    </span>
                    <h4 className="font-black text-slate-800 text-sm md:text-base mb-4 line-clamp-2 leading-relaxed group-hover:text-sky-600 transition-colors">
                      {ra.title}
                    </h4>
                    <div className="flex items-center justify-between text-sky-600 font-black text-xs pt-4 border-t border-slate-50">
                      <span>اقرأ المزيد</span>
                      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

ArticleDetailsClient.displayName = "ArticleDetailsClient";