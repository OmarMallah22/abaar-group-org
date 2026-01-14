'use client';

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from '@/lib/supabase';
import { 
  ArrowRight, ShoppingBag, Zap, ShieldCheck, 
  Truck, Settings, Wrench, Droplets, Clock 
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

/**
 * الواجهات البرمجية (Interfaces)
 */
interface Category {
  id: string;
  name: string;
  image: string;
}

interface MainStoreClientProps {
  initialCategories: Category[];
}

export default function MainStoreClient({ initialCategories }: MainStoreClientProps) {
  const [categories_du, setCategories] = useState<Category[]>(initialCategories);

  useEffect(() => {
    const getCats = async () => {
      const { data } = await supabase
        .from('categories_du')
        .select('*')
        .order('name', { ascending: true });
      if (data) setCategories(data);
    };
    if (initialCategories.length === 0) getCats();
  }, [initialCategories]);

  // Schema.org لمساعدة محركات البحث
  const storeSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "متجر أبار جروب",
    "description": "المورد الأول لمستلزمات حفر وصيانة الآبار وطلمبات الأعماق وأنظمة الطاقة الشمسية في مصر.",
    "url": "https://abaargroup.org/store",
    "image": "https://abaargroup.org/image/hint.jpeg",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Cairo",
      "addressCountry": "EG"
    }
  }), []);

  return (
    <main className="bg-slate-50 min-h-screen font-arabic overflow-x-hidden" dir="rtl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }} />
      
      {/* --- 1. Hero Section (تحسين التجاوب والأداء) --- */}
      <section className="relative h-[50vh] md:h-[65vh] flex items-center justify-center overflow-hidden bg-sky-950">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="absolute inset-0 z-0 w-full h-full object-cover opacity-40 pointer-events-none"
        >
          <source src="/image/project.m4v" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-sky-900/40 via-transparent to-slate-50/10 z-[1]" />
        
        <div className="relative z-10 text-center px-4 max-w-5xl">
          <motion.span 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-emerald-500 text-white text-[10px] md:text-xs font-black rounded-full mb-4 md:mb-6 tracking-widest shadow-lg"
          >
             أبار جروب: الريادة في حلول المياه
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-3xl md:text-6xl lg:text-8xl font-black text-white drop-shadow-2xl mb-4 md:mb-6 leading-[1.1]"
          >
            متجر <span className="text-emerald-400">توريد </span> مستلزمات الآبار
          </motion.h1>
          
          <p className="text-sky-50 text-sm md:text-xl lg:text-2xl max-w-3xl mx-auto mt-2 font-bold opacity-95 leading-relaxed drop-shadow-md">
            نؤمن لك <strong>طلمبات المياه</strong> وكافة معدات <strong>الطاقة الشمسية</strong> بأعلى معايير الجودة في السوق المصري.
          </p>
        </div>
      </section>

      {/* --- 2. Categories Grid --- */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-24 relative z-20">
        

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {categories_du.map((cat, index) => (
            <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4 }} // إلغاء الـ delay التراكمي لسرعة الاستجابة
            >
                <Link 
                    href={`/store/${cat.id}`} 
                    className="group relative aspect-[4/5] sm:aspect-[3/4] flex items-end rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-slate-200 border-2 md:border-4 border-white"
                >
                    <Image 
                        src={cat.image || '/placeholder.jpg'} 
                        alt={cat.name} 
                        fill 
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity"></div>
                    
                    <div className="relative z-10 p-6 md:p-10 w-full">
                        <div className="flex items-center gap-2 text-emerald-400 mb-2 md:mb-3 transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                            <Zap size={16} fill="currentColor" />
                            <span className="text-[9px] font-black uppercase tracking-tighter">جودة معتمدة</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black text-white mb-3 md:mb-4 leading-tight">{cat.name}</h3>
                        <div className="flex items-center gap-2 text-sky-400 font-black text-xs md:text-sm">
                            <span>استعراض القسم</span> 
                            <ArrowRight size={18} className="group-hover:translate-x-[-8px] transition-transform" />
                        </div>
                    </div>

                    <span className="absolute top-6 left-6 text-white/5 text-6xl md:text-8xl font-black select-none pointer-events-none group-hover:text-white/10 transition-colors">
                        0{index + 1}
                    </span>
                </Link>
            </motion.div>
          ))}
        </div>

        {/* --- 3. قسم معلومات SEO --- */}
        <section className="mt-20 md:mt-40 bg-white rounded-[2rem] md:rounded-[4rem] p-6 md:p-12 lg:p-20 shadow-xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-sky-50 rounded-full blur-[80px] -mr-24 -mt-24"></div>
            <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center relative z-10">
                <div className="text-right">
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-6 md:mb-8 leading-tight">
                        خبراء <span className="text-emerald-600">توريد مستلزمات الآبار</span> <br className="hidden md:block" /> في السوق المصري
                    </h2>
                    <p className="text-base md:text-lg lg:text-xl text-slate-600 leading-relaxed md:leading-[2] mb-8 md:mb-10 font-medium">
                        في <strong>أبار جروب</strong>، ندرك أن جودة مستلزمات الآبار هي أساس نجاح أي بئر مياه. لذلك نوفر لعملائنا أفضل <strong>طلمبات الأعماق</strong> والمواسير التي تتحمل الملوحة العالية، مع تقديم استشارات فنية لضمان اختيار القطعة الأنسب.
                    </p>
                    <div className="grid grid-cols-2 gap-4 md:gap-6">
                        {[
                          { icon: ShieldCheck, text: "ضمان حقيقي", color: "text-emerald-500" },
                          { icon: Truck, text: "شحن للموقع", color: "text-sky-500" },
                          { icon: Settings, text: "دعم فني", color: "text-amber-500" },
                          { icon: Droplets, text: "حلول مستدامة", color: "text-blue-500" }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm md:text-base text-slate-800 font-black">
                              <item.icon className={item.color} size={20} /> {item.text}
                          </div>
                        ))}
                    </div>
                </div>
                <div className="relative aspect-video rounded-2xl md:rounded-[3rem] overflow-hidden shadow-2xl border-4 md:border-8 border-slate-50 group">
                    <Image 
                      src="/image/hint.jpeg" 
                      alt="توريد طلمبات ومستلزمات آبار مياه" 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                </div>
            </div>
        </section>

        {/* حالة التحديث */}
        {categories_du.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100 mt-10">
                <p className="text-slate-400 font-black text-lg animate-pulse">جاري تحديث المخزون...</p>
            </div>
        )}
      </div>

      {/* --- 4. المميزات --- */}
      <section className="py-16 md:py-24 bg-slate-100 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-2xl md:text-3xl font-black mb-10 md:mb-16 text-center text-slate-900">لماذا تختار ابار جروب</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
                  {[
                    { icon: Wrench, title: "سهولة الصيانة", desc: "منتجات مختارة بعناية لتقليل تكاليف وفترات صيانة الآبار.", color: "bg-blue-50 text-blue-600" },
                    { icon: Zap, title: "كفاءة الطاقة", desc: "أنظمة طاقة شمسية أصلية تضمن تشغيل الطلمبات بأقل تكلفة.", color: "bg-emerald-50 text-emerald-600" },
                    { icon: Settings, title: "دقة المواصفات", desc: "توريد طلمبات ومواسير بمواصفات هندسية دقيقة للمشاريع الكبرى.", color: "bg-amber-50 text-amber-600" }
                  ].map((feature, i) => (
                    <div key={i} className="p-6 md:p-8 bg-white rounded-2xl md:rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-slate-50 text-center lg:text-right">
                        <div className={`w-12 h-12 md:w-16 md:h-16 ${feature.color} rounded-xl md:rounded-2xl flex items-center justify-center mx-auto lg:mr-0 mb-6`}>
                          <feature.icon className="w-6 h-6 md:w-8 md:h-8" />
                        </div>
                        <h4 className="text-lg md:text-xl font-black mb-3 text-slate-900">{feature.title}</h4>
                        <p className="text-slate-500 text-sm md:text-base font-bold leading-relaxed">{feature.desc}</p>
                    </div>
                  ))}
              </div>
          </div>
      </section>

      <div className="h-10 bg-white"></div>
    </main>
  );
}