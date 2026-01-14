'use client';

import React, { useMemo, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  MapPin, Calendar, User, ArrowRight, ShieldCheck, 
  Settings, Wrench, Droplets, Share2, Facebook, 
  Copy, Home, ChevronLeft, Bookmark, Activity, Sun
} from 'lucide-react';
import StartAction from '@/components/StartAction';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from "react-hot-toast";

/**
 * الواجهة البرمجية للمشروع
 */
interface Project {
  id: number;
  title: string;
  image: string;
  slug: string;
  client: string;
  location: string;
  year: string;
  scope: string;
}

export default function ProjectDetailClient({ project }: { project: Project }) {
  const router = useRouter();
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

  // تنظيف النص وحذف جملة "وصف قصير للمعاينة" مع تنظيف الماركدوان
  const cleanDescription = useMemo(() => {
    return project.scope
      ? project.scope
          .replace(/وصف قصير للمعاينة[:：]?\s*/g, '')
          .replace(/(\#+|\*|\-|\_|\`|\[|\]|\(|\)|\>)/g, '')
          .trim()
      : "لا تتوفر تفاصيل إضافية لهذا المشروع حالياً.";
  }, [project.scope]);

  // بناء بيانات Schema للمشروع (SEO A+)
  const projectSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": cleanDescription.substring(0, 160),
    "image": project.image,
    "author": { "@type": "Organization", "name": "أبار جروب" },
    "locationCreated": { "@type": "Place", "name": project.location },
    "datePublished": project.year,
    "provider": { "@type": "Organization", "name": "أبار جروب", "url": "https://abaargroup.org" }
  }), [project, cleanDescription]);

  const copyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    toast.success("تم نسخ الرابط");
  };

  return (
    <main className="min-h-screen bg-[#fcfcfd] font-arabic text-right relative overflow-x-hidden" dir="rtl">
      <Toaster position="bottom-center" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }} />
      
      {/* مؤشر القراءة العلوي */}
      <div className="fixed top-0 left-0 w-full h-1 z-[110] bg-slate-100">
        <div className="h-full bg-emerald-500 transition-all duration-100" style={{ width: `${readingProgress}%` }} />
      </div>

      {/* 1. Hero Header */}
      <section className="relative h-[50vh] md:h-[65vh] w-full overflow-hidden bg-[#0c2461]">
        <Image 
          src={project.image} 
          alt={project.title} 
          fill 
          className="object-cover opacity-40 scale-105" 
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#fcfcfd] via-[#0c2461]/60 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 md:px-6 text-center z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 md:px-6 md:py-2 bg-emerald-500 text-white text-[10px] md:text-xs font-black rounded-full mb-4 md:mb-6 shadow-xl uppercase tracking-widest">
              <ShieldCheck size={14} /> سجل الإنجازات المعتمد
            </span>
            <h1 className="text-2xl md:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-2xl max-w-5xl px-2">
              {project.title}
            </h1>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-20">
        {/* 2. Breadcrumbs - تحسين التجاوب */}
        <nav aria-label="Breadcrumb" className="relative z-30 flex items-center gap-2 text-[10px] md:text-sm font-bold text-slate-400 py-3 md:py-5 px-4 md:px-8 bg-white/95 backdrop-blur-md rounded-2xl md:rounded-3xl border border-slate-100 shadow-xl w-full md:w-fit mx-auto lg:mx-0 mt-[-2rem] md:mt-[-2.5rem]">
          <Link href="/" className="hover:text-sky-600 transition-colors"><Home size={16}/></Link>
          <ChevronLeft size={14} className="text-slate-300" />
          <Link href="/project" className="hover:text-sky-600 transition-colors">المشاريع</Link>
          <ChevronLeft size={14} className="text-slate-300" />
          <span className="text-sky-600 truncate max-w-[120px] md:max-w-none">{project.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 mt-8 md:mt-12">
          
          {/* العمود الرئيسي */}
          <div className="lg:col-span-8 space-y-8 md:space-y-12">
            
            {/* الصورة الرئيسية */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full aspect-video bg-white rounded-2xl md:rounded-[3rem] overflow-hidden border-4 md:border-8 border-white shadow-2xl group"
            >
              <Image 
                src={project.image} 
                alt={project.title} 
                fill 
                className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                sizes="(max-width: 1024px) 100vw, 800px"
              />
              <div className="absolute top-4 right-4 md:top-8 md:right-8 bg-white/90 backdrop-blur-sm p-3 md:p-4 rounded-xl md:rounded-2xl shadow-lg">
                 <Activity className="text-sky-600 animate-pulse" size={20} />
              </div>
            </motion.div>

            {/* تفاصيل المشروع النصية */}
            <article className="bg-white rounded-2xl md:rounded-[3rem] p-6 md:p-12 lg:p-16 shadow-xl border border-slate-50">
              <h2 className="text-xl md:text-3xl font-black text-[#0c2461] mb-6 md:mb-8 border-r-4 md:border-r-8 border-emerald-500 pr-4 md:pr-6">التقرير الفني</h2>
              <div className="text-slate-600 text-base md:text-lg lg:text-xl leading-relaxed md:leading-[2.2] space-y-6 md:space-y-8 text-justify font-medium">
                <p>
                  يمثل هذا المشروع أحد إنجازات <strong>أبار جروب</strong> في مجال <strong>حفر وصيانة الآبار</strong> الجوفية. تم العمل على المشروع وفقاً لأعلى المعايير الهندسية لضمان استدامة تدفق المياه.
                </p>
                <p>{cleanDescription}</p>
                <p>
                  خلال مراحل التنفيذ، حرصنا على <strong>توريد طلمبات المياه</strong> الأصلية وتجهيز البئر بكافة المستلزمات بنظام <strong>الطاقة الشمسية</strong>.
                </p>
              </div>

              {/* مشاركة المشروع */}
              <div className="mt-12 md:mt-20 pt-8 md:pt-10 border-t border-slate-100">
                 <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <span className="font-black text-slate-800 text-sm md:text-base flex items-center gap-2">
                       <Share2 size={18} className="text-sky-500" /> شارك الإنجاز:
                    </span>
                    <div className="flex gap-3 md:gap-4">
                       <button onClick={() => window.open(`https://facebook.com/sharer/sharer.php?u=${currentUrl}`, '_blank')} className="p-3 md:p-4 bg-[#1877F2] text-white rounded-xl md:rounded-2xl hover:scale-105 transition-all shadow-lg shadow-blue-100" aria-label="Share on Facebook"><Facebook size={20}/></button>
                       <button onClick={copyLink} className="p-3 md:p-4 bg-slate-900 text-white rounded-xl md:rounded-2xl hover:scale-105 transition-all shadow-lg shadow-slate-200" aria-label="Copy Link"><Copy size={20}/></button>
                    </div>
                 </div>
              </div>
            </article>

            {/* سكشن المميزات الفنية */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
               {[
                 { icon: Wrench, color: "text-sky-600", hover: "hover:bg-sky-600", title: "صيانة دورية", desc: "نظام متابعة فني بعد التسليم." },
                 { icon: Sun, color: "text-emerald-600", hover: "hover:bg-emerald-600", title: "طاقة نظيفة", desc: "محطات طاقة شمسية مخصصة." },
                 { icon: Droplets, color: "text-amber-500", hover: "hover:bg-amber-500", title: "تدفق مستدام", desc: "تجارب ضخ معتمدة تقنياً." }
               ].map((item, i) => (
                 <div key={i} className={`bg-white p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-md border border-slate-50 text-center group ${item.hover} transition-all duration-500`}>
                    <item.icon size={28} className={`mx-auto mb-4 ${item.color} group-hover:text-white transition-colors`} />
                    <h4 className="font-black text-slate-900 group-hover:text-white mb-2 text-sm md:text-base">{item.title}</h4>
                    <p className="text-[11px] md:text-xs text-slate-400 group-hover:text-white/80 leading-relaxed">{item.desc}</p>
                 </div>
               ))}
            </div>
          </div>

          {/* العمود الجانبي */}
          <aside className="lg:col-span-4 space-y-6 md:space-y-8">
            <div className="bg-white rounded-2xl md:rounded-[3rem] p-6 md:p-10 shadow-2xl border border-slate-50 lg:sticky lg:top-24 overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-sky-50 rounded-bl-[80px] -z-0 opacity-50" />
              
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-8 border-b border-slate-100 pb-5 flex items-center gap-3 relative z-10">
                <Bookmark size={22} className="text-sky-600" /> بيانات المشروع
              </h3>
              
              <div className="space-y-6 md:space-y-10 relative z-10">
                <InfoRow icon={<User />} label="العميل" value={project.client} />
                <InfoRow icon={<MapPin />} label="الموقع" value={project.location} />
                <InfoRow icon={<Calendar />} label="السنة" value={project.year} />
                <InfoRow icon={<Settings />} label="الخدمة" value="حفر وتوريد" />
              </div>

              <div className="mt-10 md:mt-12 pt-8 md:pt-10 border-t border-slate-100 relative z-10 text-center">
                 <p className="text-slate-400 text-xs md:text-sm font-bold mb-6 leading-relaxed">تريد تنفيذ مشروع مماثل؟</p>
                 <Link 
                  href="/contact" 
                  className="w-full bg-[#0c2461] hover:bg-emerald-600 text-white py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-sm md:text-base flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95"
                 >
                   طلب استشارة <ArrowRight size={18} className="rotate-180" />
                 </Link>
              </div>
            </div>
          </aside>

        </div>
      </div>

      {/* النهاية */}
      <div className="mt-20 md:mt-32">
         <StartAction />
      </div>

      <div className="h-10 md:h-20" />
    </main>
  );
}

/**
 * مكون مساعدة لعرض صفوف المعلومات
 */
function InfoRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-start gap-4 md:gap-5 group">
      <div className="p-3 bg-slate-50 rounded-xl text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-all shadow-sm shrink-0">
        {React.cloneElement(icon as React.ReactElement, { size: 20 })}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-slate-400 font-bold mb-0.5 uppercase tracking-tighter">{label}</p>
        <p className="font-black text-slate-800 text-sm md:text-lg leading-tight break-words">{value}</p>
      </div>
    </div>
  );
}