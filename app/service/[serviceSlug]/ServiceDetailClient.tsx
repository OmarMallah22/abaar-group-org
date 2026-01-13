// app/service/[serviceSlug]/ServiceDetailClient.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { ArrowRight, Phone, Clock, Shield, Star, ChevronRight, CheckCircle2, Zap } from 'lucide-react';
import StartAction from '@/components/StartAction';
import { motion } from 'framer-motion';

interface Service {
  id: string;
  title: string;
  description: string;
  image_url: string;
  slug: string;
  seo_title?: string;
  meta_description?: string;
}

interface ServiceDetailClientProps {
  initialService: Service;
}

export default function ServiceDetailClient({ initialService }: ServiceDetailClientProps) {
  
  // تنظيف الوصف (إزالة أي أجزاء تعريفية زائدة)
  const fullDescription = initialService.description.replace(/---([\s\S]*)/, '$1').trim();

  return (
    <main className="min-h-screen bg-white font-arabic pb-20" dir="rtl">
      
      {/* 1. Hero Header Section - رأس الصفحة السينمائي */}
      <section className="relative h-[55vh] md:h-[65vh] w-full overflow-hidden bg-[#0c2461]">
        <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
        >
            <Image 
              src={initialService.image_url} 
              alt={initialService.title} 
              fill 
              className="object-cover opacity-40 grayscale-[0.1]" 
              priority
            />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-white via-[#0c2461]/20 to-transparent"></div>
        
        {/* المحتوى داخل الهيرو */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
          <motion.nav 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-white/90 mb-8 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 shadow-xl"
          >
            <Link href="/" className="hover:text-emerald-400 transition-colors font-bold">الرئيسية</Link>
            <ChevronRight size={16} className="text-white/40" />
            <Link href="/service" className="hover:text-emerald-400 transition-colors font-bold">خدماتنا</Link>
            <ChevronRight size={16} className="text-white/40" />
            <span className="text-white font-black">{initialService.title}</span>
          </motion.nav>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black text-white drop-shadow-2xl max-w-5xl leading-tight"
          >
            {initialService.title}
          </motion.h1>
        </div>
      </section>

      {/* 2. المحتوى الرئيسي وشبكة التفاصيل */}
      <div className="max-w-7xl mx-auto px-6 -mt-24 relative z-20">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* العمود اليمين: عرض محتوى الخدمة بـ Markdown */}
          <article className="lg:w-2/3 bg-white rounded-[3rem] shadow-2xl border border-slate-50 p-8 md:p-16">
            
            {/* الصورة التوضيحية داخل المقال */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="rounded-[2.5rem] overflow-hidden mb-12 shadow-2xl border-8 border-slate-50 group"
            >
                <Image
                    src={initialService.image_url}
                    alt={initialService.title}
                    width={1000}
                    height={560}
                    className="w-full h-auto transition-transform duration-1000 group-hover:scale-110"
                />
            </motion.div>

            {/* منطق عرض الـ Markdown مع تنسيقات مخصصة */}
            <div className="prose prose-lg prose-slate max-w-none prose-rtl">
              <style jsx global>{`
                .prose-rtl p { font-size: 1.15rem; color: #475569; line-height: 2.2; margin-bottom: 2rem; text-align: justify; font-weight: 500; }
                .prose-rtl h2 { color: #0c2461; font-weight: 900; border-right: 6px solid #10b981; padding-right: 1.5rem; margin-top: 4rem; font-size: 2rem; }
                .prose-rtl h3 { color: #1e40af; font-weight: 800; margin-top: 3rem; }
                .prose-rtl ul { list-style-type: none; padding-right: 0; }
                .prose-rtl li { position: relative; padding-right: 2.5rem; margin-bottom: 1rem; color: #334155; font-weight: 600; }
                .prose-rtl li::before { content: '✓'; position: absolute; right: 0; color: #10b981; font-weight: 900; font-size: 1.2rem; }
                .prose-rtl strong { color: #0c2461; font-weight: 900; }
              `}</style>
              
              <div className="prose-rtl">
                <ReactMarkdown>{fullDescription}</ReactMarkdown>
              </div>
            </div>
          </article>

          {/* العمود اليسار: بطاقات التواصل والفوائد الفنية */}
          <aside className="lg:w-1/3 space-y-8 sticky top-28">
            
            {/* بطاقة التواصل المباشر */}
            <div className="bg-[#0c2461] rounded-[2.5rem] p-10 text-white shadow-2xl overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full -mr-20 -mt-20 blur-3xl transition-all group-hover:bg-emerald-500/20"></div>
              <Zap className="text-emerald-400 mb-6 w-12 h-12" />
              <h3 className="text-3xl font-black mb-4 relative z-10 leading-snug">هل تحتاج إلى استشارة فنية؟</h3>
              <p className="text-white/70 mb-10 text-lg font-medium relative z-10">فريق مهندسي أبار جروب جاهز لتخطيط مشروعك بأعلى كفاءة وأقل تكلفة.</p>
              
              <a 
                href="tel:01211110240" 
                className="flex items-center justify-center gap-4 bg-white text-[#0c2461] py-5 rounded-2xl font-black text-lg transition-all hover:bg-emerald-500 hover:text-white shadow-lg active:scale-95"
              >
                <Phone size={24} />
                اتصل بنا الآن
              </a>
            </div>

            {/* بطاقة المميزات والضمانات */}
            <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
              <h4 className="text-2xl font-black text-slate-900 mb-8 border-b border-slate-200 pb-4">مميزات هذه الخدمة</h4>
              <ul className="space-y-6">
                {[
                  { icon: Shield, text: "ضمان فني شامل على التنفيذ", color: "text-blue-600", bg: "bg-blue-50" },
                  { icon: Clock, text: "صيانة دورية واستجابة فورية", color: "text-emerald-600", bg: "bg-emerald-50" },
                  { icon: Star, text: "أحدث معدات التصوير والقياس", color: "text-amber-600", bg: "bg-amber-50" },
                ].map((item, i) => (
                  <motion.li 
                    key={i} 
                    whileHover={{ x: -5 }}
                    className="flex items-center gap-5 bg-white p-5 rounded-2xl shadow-sm border border-slate-50 transition-all"
                  >
                    <div className={`p-3 rounded-xl ${item.bg}`}>
                        <item.icon className={`h-7 w-7 ${item.color}`} />
                    </div>
                    <span className="font-black text-slate-700 text-sm leading-tight">{item.text}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* زر العودة التفاعلي */}
            <Link 
                href="/service" 
                className="flex items-center justify-center gap-3 w-full py-5 border-2 border-slate-900 text-slate-900 font-black rounded-2xl hover:bg-slate-900 hover:text-white transition-all group"
            >
                <ArrowRight size={22} className="rotate-180 transition-transform group-hover:-translate-x-2" />
                تصفح كافة الخدمات
            </Link>
          </aside>

        </div>
      </div>

      {/* 3. سكشن إنهاء المشروع وبدء العمل */}
      <section className="mt-24">
          <StartAction />
      </section>
      
    </main>
  );
};