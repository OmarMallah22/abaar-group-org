'use client';

import React, { useMemo, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  MapPin, Calendar, User, ArrowRight, ShieldCheck, 
  Settings, Wrench, Droplets, Share2, Facebook, 
  Copy, Home, ChevronLeft, Bookmark, Activity,Sun
} from 'lucide-react';
import StartAction from '@/components/StartAction';
import { motion, AnimatePresence } from 'framer-motion';
import toast from "react-hot-toast";

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
    toast.success("تم نسخ رابط المشروع بنجاح");
  };

  return (
    <main className="min-h-screen bg-[#fcfcfd] font-arabic text-right relative" dir="rtl">
      {/* حقن الـ Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }} />
      
      {/* مؤشر القراءة العلوي */}
      <div className="fixed top-0 left-0 w-full h-1 z-[100] bg-slate-100">
        <div className="h-full bg-emerald-500 transition-all duration-150" style={{ width: `${readingProgress}%` }} />
      </div>

      {/* 1. Hero Header - رأس الصفحة السينمائي */}
      <section className="relative h-[45vh] md:h-[60vh] w-full overflow-hidden bg-[#0c2461]">
        <Image 
          src={project.image} 
          alt={`تنفيذ مشروع ${project.title} - شركة أبار جروب`} 
          fill 
          className="object-cover opacity-30 scale-105" 
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#fcfcfd] via-[#0c2461]/40 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-500 text-white text-xs font-black rounded-full mb-6 shadow-xl uppercase tracking-widest">
              <ShieldCheck size={14} /> سجل الإنجازات المعتمد
            </span>
            <h1 className="text-3xl md:text-6xl font-black text-white leading-tight drop-shadow-2xl max-w-4xl">
              {project.title}
            </h1>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 relative z-20">
        {/* 2. Breadcrumbs - مسار التنقل */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-3 text-sm font-bold text-slate-400 py-6 px-8 bg-white/90 backdrop-blur-md rounded-3xl -translate-y-1/2 border border-white shadow-xl w-fit mx-auto lg:mx-0">
          <Link href="/" className="hover:text-sky-600 transition-colors"><Home size={18}/></Link>
          <ChevronLeft size={16} className="text-slate-300 rotate-180" />
          <Link href="/project" className="hover:text-sky-600 transition-colors">المشاريع</Link>
          <ChevronLeft size={16} className="text-slate-300 rotate-180" />
          <span className="text-sky-600 truncate max-w-[200px]">{project.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-4">
          
          {/* العمود الرئيسي: التفاصيل والصورة */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* عرض الصورة كاملة */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full aspect-video bg-white rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl group"
            >
              <Image 
                src={project.image} 
                alt={`${project.title} - توريد وصيانة آبار مياه`} 
                fill 
                className="object-contain p-4 transition-transform duration-1000 group-hover:scale-105" 
              />
              <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/20">
                 <Activity className="text-sky-600 animate-pulse" size={24} />
              </div>
            </motion.div>

            {/* تفاصيل المشروع النصية */}
            <article className="bg-white rounded-[3rem] p-8 md:p-16 shadow-xl border border-slate-50">
              <h2 className="text-2xl font-black text-[#0c2461] mb-8 border-r-8 border-emerald-500 pr-6">التقرير الفني للمشروع</h2>
              <div className="text-slate-600 text-lg leading-[2.2] space-y-8 text-justify font-medium">
                <p>
                  يمثل هذا المشروع أحد إنجازات <strong>أبار جروب</strong> في مجال <strong>حفر وصيانة الآبار</strong> الجوفية. تم العمل على المشروع وفقاً لأعلى المعايير الهندسية لضمان استدامة تدفق المياه.
                </p>
                <p>{cleanDescription}</p>
                <p>
                  خلال مراحل التنفيذ، حرصنا على <strong>توريد طلمبات المياه</strong> الأصلية وتجهيز البئر بكافة المستلزمات التي تضمن كفاءة التشغيل بنظام <strong>الطاقة الشمسية</strong> الموفر للطاقة.
                </p>
              </div>

              {/* قسم مشاركة المشروع */}
              <div className="mt-20 pt-10 border-t border-slate-100">
                 <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <span className="font-black text-slate-800 flex items-center gap-2">
                       <Share2 size={20} className="text-sky-500" /> شارك هذا الإنجاز:
                    </span>
                    <div className="flex gap-4">
                       <button onClick={() => window.open(`https://facebook.com/sharer/sharer.php?u=${currentUrl}`)} className="p-4 bg-[#1877F2] text-white rounded-2xl hover:scale-110 transition-all shadow-lg shadow-blue-100"><Facebook size={20}/></button>
                       <button onClick={copyLink} className="p-4 bg-slate-900 text-white rounded-2xl hover:scale-110 transition-all shadow-lg shadow-slate-200"><Copy size={20}/></button>
                    </div>
                 </div>
              </div>
            </article>

            {/* سكشن إضافي لرفع كثافة السيو (Technical Standards) */}
            <div className="grid sm:grid-cols-3 gap-6">
               <div className="bg-white p-8 rounded-[2.5rem] shadow-md border border-slate-50 text-center group hover:bg-sky-600 transition-all duration-500">
                  <Wrench size={32} className="mx-auto mb-4 text-sky-600 group-hover:text-white" />
                  <h4 className="font-black text-slate-900 group-hover:text-white mb-2">صيانة دورية</h4>
                  <p className="text-xs text-slate-400 group-hover:text-sky-100 leading-relaxed">نظام متابعة فني بعد التسليم لضمان كفاءة البئر.</p>
               </div>
               <div className="bg-white p-8 rounded-[2.5rem] shadow-md border border-slate-50 text-center group hover:bg-emerald-600 transition-all duration-500">
                  <Sun size={32} className="mx-auto mb-4 text-emerald-600 group-hover:text-white" />
                  <h4 className="font-black text-slate-900 group-hover:text-white mb-2">طاقة نظيفة</h4>
                  <p className="text-xs text-slate-400 group-hover:text-emerald-100 leading-relaxed">تصميم محطة طاقة شمسية مخصصة لعمق البئر.</p>
               </div>
               <div className="bg-white p-8 rounded-[2.5rem] shadow-md border border-slate-50 text-center group hover:bg-amber-500 transition-all duration-500">
                  <Droplets size={32} className="mx-auto mb-4 text-amber-500 group-hover:text-white" />
                  <h4 className="font-black text-slate-900 group-hover:text-white mb-2">تدفق مستدام</h4>
                  <p className="text-xs text-slate-400 group-hover:text-amber-100 leading-relaxed">تجارب ضخ معتمدة للتأكد من إنتاجية البئر.</p>
               </div>
            </div>
          </div>

          {/* العمود الجانبي: بطاقة المعلومات */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-100 sticky top-28 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-bl-[100px] -z-0 opacity-50" />
              
              <h3 className="text-2xl font-black text-slate-900 mb-10 border-b border-slate-100 pb-6 flex items-center gap-3 relative z-10">
                <Bookmark size={24} className="text-sky-600" /> بيانات المشروع
              </h3>
              
              <div className="space-y-10 relative z-10">
                <InfoRow icon={<User />} label="العميل" value={project.client} />
                <InfoRow icon={<MapPin />} label="الموقع الجغرافي" value={project.location} />
                <InfoRow icon={<Calendar />} label="سنة التنفيذ" value={project.year} />
                <InfoRow icon={<Settings />} label="نوع الخدمة" value="حفر وتوريد متكامل" />
              </div>

              <div className="mt-12 pt-10 border-t border-slate-100 relative z-10">
                 <p className="text-slate-400 text-sm font-bold mb-6 text-center leading-relaxed">هل تريد تنفيذ مشروع مماثل في منطقتك؟</p>
                 <Link 
                  href="/contact" 
                  className="w-full bg-[#0c2461] hover:bg-emerald-600 text-white py-5 rounded-2xl font-black text-center flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95"
                 >
                   طلب استشارة فنية <ArrowRight size={20} className="rotate-180" />
                 </Link>
              </div>
            </div>
          </aside>

        </div>
      </div>

      {/* قسم الإجراء النهائي */}
      <div className="mt-32">
         <StartAction />
      </div>

      <div className="h-20" />
    </main>
  );
}

/**
 * مكون مساعدة لعرض صفوف المعلومات
 */
function InfoRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-start gap-5 group">
      <div className="p-3.5 bg-slate-50 rounded-xl text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-all shadow-sm">
        {React.cloneElement(icon as React.ReactElement, { size: 22 })}
      </div>
      <div>
        <p className="text-xs text-slate-400 font-bold mb-1 uppercase tracking-tighter">{label}</p>
        <p className="font-black text-slate-800 text-lg leading-tight">{value}</p>
      </div>
    </div>
  );
}