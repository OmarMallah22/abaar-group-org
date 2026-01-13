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
  ChevronRight, ArrowUpRight
} from "lucide-react"; 
import Image from "next/image";
import toast from "react-hot-toast";
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

/**
 * دالة جلب المقالات ذات الصلة - تم تحسين الاستعلام
 */
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

/**
 * مكونات الماركدوان المخصصة للسيو وتجربة القراءة
 * تم إضافة خاصية الـ ID للعناوين لدعم الفهرس (ToC)
 */
const markdownComponents = {
  h2: ({node, ...props}: any) => {
    const id = props.children?.toString().replace(/\s+/g, '-').toLowerCase();
    return <h2 id={id} {...props} className="text-2xl md:text-3xl font-black text-slate-800 mt-16 mb-8 border-r-8 border-emerald-500 pr-6 scroll-mt-28" />;
  },
  h3: ({...props}) => <h3 className="text-xl md:text-2xl font-bold text-sky-700 mt-12 mb-6" {...props} />,
  ul: ({...props}) => <ul {...props} className="my-8 space-y-4 list-disc list-inside pr-4 text-slate-700 leading-relaxed" />,
  ol: ({...props}) => <ol {...props} className="my-8 space-y-4 list-decimal list-inside pr-4 text-slate-700 leading-relaxed" />,
  p: ({...props}) => <p {...props} className="my-8 leading-[2.3] text-lg text-slate-700 text-justify font-medium" />,
  blockquote: ({...props}) => <blockquote className="border-r-4 border-emerald-500 bg-emerald-50/50 p-8 my-10 rounded-2xl italic text-slate-800" {...props} />,
  img: ({src, alt}: any) => (
    <span className="block relative w-full aspect-video my-12 shadow-2xl rounded-[2.5rem] overflow-hidden border-8 border-white bg-slate-100">
      <Image 
        src={src} 
        alt={alt || 'توضيح فني من أبار جروب'} 
        fill 
        sizes="(max-width: 1200px) 100vw, 1200px"
        className="object-cover" 
      />
    </span>
  ),
};

export default function ArticleDetailsClient({ initialArticle }: { initialArticle: Article }) {
  const [currentUrl, setCurrentUrl] = useState("");
  const [readingProgress, setReadingProgress] = useState(0);

  // تحديث الرابط ومؤشر القراءة
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

  // استخراج العناوين تلقائياً لعمل الفهرس
  const tableOfContents = useMemo(() => {
    const headings = initialArticle.content.match(/^##\s+(.*)$/gm);
    return headings?.map(h => h.replace('## ', '')) || [];
  }, [initialArticle.content]);

  const formattedDate = useMemo(() => {
    return new Date(initialArticle.created_at).toLocaleDateString('ar-EG', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  }, [initialArticle.created_at]);

  const copyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    toast.success("تم نسخ رابط المقال بنجاح", {
      style: { borderRadius: '15px', background: '#10b981', color: '#fff' }
    });
  };

  const shareWhatsApp = () => {
    const text = `${initialArticle.title}\n${currentUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <main className="bg-[#f8fafc] min-h-screen pb-24 font-arabic text-right relative" dir="rtl">
      
      {/* مؤشر القراءة العلوي */}
      <div className="fixed top-0 left-0 w-full h-1.5 z-[100] bg-slate-100">
        <div 
          className="h-full bg-emerald-500 transition-all duration-150 ease-out" 
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Hero Header مع تحسين LCP */}
      <div className="relative h-[65vh] md:h-[80vh] w-full overflow-hidden bg-slate-950">
        <Image 
          src={initialArticle.image} 
          alt={initialArticle.seo_title || initialArticle.title} 
          fill 
          className="object-cover opacity-50 scale-105"
          priority 
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f8fafc] via-sky-950/40 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center max-w-5xl mx-auto px-6 text-center z-10">
          <motion.span 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-white text-sm font-black rounded-full mb-8 shadow-2xl"
          >
            <Bookmark size={16} /> {initialArticle.category}
          </motion.span>

          <h1 className="text-4xl md:text-7xl font-black text-white leading-tight drop-shadow-2xl">
            {initialArticle.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-white font-bold bg-white/10 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/20">
            <div className="flex items-center gap-3"><Calendar size={20} className="text-emerald-400" /> {formattedDate}</div>
            <div className="h-4 w-px bg-white/20 hidden md:block" />
            <div className="flex items-center gap-3"><Clock size={20} className="text-emerald-400" /> تقريباً 5 دقائق قراءة</div>
            <div className="h-4 w-px bg-white/20 hidden md:block" />
            <div className="flex items-center gap-2"><Tag size={18} className="text-emerald-400" /> خبراء أبار جروب</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumbs - تم تحسين النطاق */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-3 text-sm font-bold text-slate-400 py-6 px-8 bg-white/90 backdrop-blur-md rounded-3xl -translate-y-1/2 border border-white shadow-xl w-fit mx-auto lg:mx-0 relative z-30">
          <Link href="/" className="hover:text-sky-600 transition-colors" aria-label="الرئيسية"><Home size={18}/></Link>
          <ChevronLeft size={16} className="text-slate-300 rotate-180" />
          <Link href="/blog" className="hover:text-sky-600 transition-colors">مركز المعرفة</Link>
          <ChevronLeft size={16} className="text-slate-300 rotate-180" />
          <span className="text-emerald-600 truncate max-w-[150px] md:max-w-[400px]">{initialArticle.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12 mt-4">
          
          {/* العمود الرئيسي للمقال */}
          <div className="lg:col-span-8 flex-1">
            <div className="bg-white rounded-[3.5rem] shadow-2xl p-8 md:p-20 border border-slate-100 relative overflow-hidden">
              {/* قسم مقدمة SEO */}
              <div className="mb-12 pb-12 border-b border-slate-100">
                 <p className="text-xl text-slate-600 leading-relaxed font-bold italic">
                   في هذا المقال، يستعرض خبراء <strong>أبار جروب</strong> دليلاً شاملاً حول {initialArticle.title} لضمان حصولكم على أفضل نتائج في <strong>حفر وصيانة الآبار</strong> وتوريد الطلمبات.
                 </p>
              </div>

              <article className="prose prose-xl prose-slate max-w-none prose-headings:font-black prose-a:text-sky-600">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {initialArticle.content}
                </ReactMarkdown>
              </article>

              {/* Share Section المطور */}
              <div className="mt-24 pt-16 border-t border-slate-100">
                <div className="flex flex-col items-center">
                  <h3 className="text-2xl font-black text-slate-800 mb-10 flex items-center gap-3">
                    <Share2 size={28} className="text-emerald-500" /> شارك المعرفة الفنية
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
                    <button 
                      onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`, '_blank')}
                      className="flex items-center justify-center gap-4 px-8 py-5 bg-[#1877F2] text-white rounded-[1.5rem] font-black hover:scale-105 transition-all shadow-xl shadow-blue-100"
                    >
                      <Facebook size={22} /> فيسبوك
                    </button>
                    <button 
                      onClick={shareWhatsApp}
                      className="flex items-center justify-center gap-4 px-8 py-5 bg-[#25D366] text-white rounded-[1.5rem] font-black hover:scale-105 transition-all shadow-xl shadow-green-100"
                    >
                      <Share2 size={22} /> واتساب
                    </button>
                    <button 
                      onClick={copyLink}
                      className="flex items-center justify-center gap-4 px-8 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black hover:scale-105 transition-all shadow-xl shadow-slate-200"
                    >
                      <Copy size={22} /> نسخ الرابط
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* الشريط الجانبي الذكي (Sticky Sidebar) */}
          <aside className="lg:w-1/3 space-y-8">
            
            {/* فهرس المقال - مهم جداً للـ SEO */}
            {tableOfContents.length > 0 && (
              <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-50 sticky top-28">
                <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3 border-b border-slate-100 pb-4">
                  <List size={22} className="text-sky-600" /> محتويات المقال
                </h3>
                <ul className="space-y-5">
                  {tableOfContents.map((heading, idx) => (
                    <li key={idx}>
                      <a 
                        href={`#${heading.replace(/\s+/g, '-').toLowerCase()}`}
                        className="text-slate-600 hover:text-sky-600 font-bold text-sm flex items-center gap-2 group transition-colors"
                      >
                        <ChevronRight size={14} className="text-emerald-500 group-hover:translate-x-1 transition-transform" />
                        {heading}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* بطاقة اتخاذ إجراء (CTA) جانبية */}
            <div className="bg-[#0c2461] p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all" />
               <h4 className="text-2xl font-black mb-4 relative z-10">هل لديك بئر يحتاج صيانة؟</h4>
               <p className="text-white/70 mb-8 text-sm leading-loose relative z-10">فريقنا الهندسي جاهز لفحص وتطهير الآبار بأحدث كاميرات التصوير التليفزيوني.</p>
               <Link href="/contact" className="inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-2xl font-black transition-all w-full justify-center">
                  اطلب استشارة مجانية <ArrowUpRight size={20} />
               </Link>
            </div>
          </aside>

        </div>

        {/* الكلمات المفتاحية في الأسفل */}
        <section className="mt-16 flex flex-wrap gap-3">
          {["حفر آبار مياه", "صيانة آبار جوفية", "طاقة شمسية", "توريد طلمبات"].map((tag, index) => (
            <span key={index} className="px-6 py-2.5 bg-white text-slate-600 border border-slate-100 rounded-full text-xs font-black shadow-sm hover:bg-sky-600 hover:text-white transition-all cursor-default">
              #{tag}
            </span>
          ))}
        </section>

        {/* المقالات ذات الصلة المحدثة */}
        {relatedArticles && relatedArticles.length > 0 && (
          <section className="mt-32">
            <div className="flex items-center gap-6 mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-slate-800">
                مقالات <span className="text-sky-600">ذات صلة</span> بالعالم الفني
              </h2>
              <div className="h-1 flex-1 bg-sky-100 rounded-full hidden md:block" />
            </div>
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-10 transition-opacity duration-500 ${relatedLoading ? 'opacity-50' : 'opacity-100'}`}>
              {relatedArticles.map((ra) => (
                <Link key={ra.id} href={`/blog/${ra.slug}`} className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="relative h-56 overflow-hidden">
                    <Image src={ra.image} alt={ra.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-5 right-5 bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg">
                      {ra.category}
                    </div>
                  </div>
                  <div className="p-8">
                    <h4 className="font-black text-slate-800 text-lg mb-6 line-clamp-2 leading-relaxed group-hover:text-sky-600 transition-colors">{ra.title}</h4>
                    <div className="flex items-center justify-between text-sky-600 font-black text-sm border-t border-slate-50 pt-4">
                      <span>استكشف التفاصيل</span>
                      <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-2" />
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