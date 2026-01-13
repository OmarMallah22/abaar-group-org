// app/store/MainStoreClient.tsx
'use client';

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from '@/lib/supabase';
import { 
  ArrowRight, ShoppingBag, Zap, ShieldCheck, 
  Truck, Settings, Wrench, Droplets 
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
      const { data } = await supabase.from('categories_du').select('*').order('name', { ascending: true });
      if (data) setCategories(data);
    };
    if (initialCategories.length === 0) getCats();
  }, [initialCategories]);

  // إضافة بيانات Schema للمتجر (مهمة جداً لجوجل)
  const storeSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "متجر أبار جروب",
    "description": "المورد الأول لمستلزمات حفر وصيانة الآبار وطلمبات الأعماق وأنظمة الطاقة الشمسية في مصر.",
    "url": "https://abaargroup.org/store",
    "image": "https://abaargroup.org/image/about.jpeg",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Cairo",
      "addressCountry": "EG"
    }
  }), []);

  return (
    <main className="bg-slate-50 min-h-screen font-arabic" dir="rtl">
      {/* حقن بيانات Schema برمجياً */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }} />
      
      {/* --- 1. Hero Section (SEO Optimized) --- */}
      <section className="relative h-[55vh] md:h-[65vh] flex items-center justify-center overflow-hidden bg-sky-950">
        <video autoPlay muted loop playsInline className="absolute inset-0 z-0 w-full h-full object-cover opacity-50">
          <source src="/image/project.m4v" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-sky-900/60 via-transparent to-slate-50 z-[1]" />
        
        <div className="relative z-10 text-center px-4">
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-6 py-2 bg-emerald-500 text-white text-xs font-black rounded-full mb-6 tracking-widest animate-pulse"
          >
             توريد وتجهيز آبار المياه
          </motion.span>
          
          {/* تحديث H1 ليكون غنياً بالكلمات المفتاحية المطلوبة */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl lg:text-8xl font-black text-white drop-shadow-2xl mb-6"
          >
            متجر <span className="text-emerald-400">توريد </span> 
          </motion.h1>
          
          <p className="text-sky-100 text-lg md:text-2xl max-w-3xl mx-auto mt-6 font-medium opacity-90 leading-relaxed drop-shadow-md">
            نحن خبراؤك في <strong>توريد طلمبات المياه</strong>، ومواسير الآبار، وكافة مستلزمات <strong>الطاقة الشمسية</strong> بأعلى جودة وأفضل الأسعار في مصر.
          </p>
        </div>
      </section>

      {/* --- 2. Categories Grid (شبكة الأقسام) --- */}
      <div className="max-w-7xl mx-auto px-6 py-28 relative z-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16 border-b border-slate-200 pb-10">
            <div className="flex items-center gap-4">
                <div className="p-4 bg-sky-100 rounded-2xl text-sky-600 shadow-inner">
                    <ShoppingBag size={32} />
                </div>
                <div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">أقسام توريد مستلزمات الآبار</h2>
                    <p className="text-slate-500 font-bold">كل ما تحتاجه لتجهيز وصيانة بئرك في مكان واحد</p>
                </div>
            </div>
            <div className="hidden lg:block text-left">
                <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                  تحديثات الأسعار: يناير 2026
                </span>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {categories_du.map((cat, index) => (
            <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
            >
                <Link 
                    href={`/store/${cat.id}`} 
                    className="group relative aspect-[3/4] flex items-end rounded-[3.5rem] overflow-hidden shadow-2xl transition-all hover:-translate-y-3 bg-slate-200 border-4 border-white"
                >
                    <Image 
                        src={cat.image || '/placeholder.jpg'} 
                        alt={`قسم ${cat.name} - أبار جروب لتوريد مستلزمات الآبار`} 
                        fill 
                        className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity"></div>
                    
                    <div className="relative z-10 p-10 w-full">
                        <div className="flex items-center gap-2 text-emerald-400 mb-3 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                            <Zap size={18} fill="currentColor" />
                            <span className="text-[10px] font-black uppercase tracking-widest">مواصفات قياسية</span>
                        </div>
                        <h3 className="text-3xl font-black text-white mb-4 leading-tight">{cat.name}</h3>
                        <div className="flex items-center gap-3 text-sky-400 font-black text-sm group-hover:gap-6 transition-all">
                            <span>استعراض المنتجات</span> 
                            <ArrowRight size={22} className="transition-transform" />
                        </div>
                    </div>

                    <span className="absolute top-10 left-10 text-white/10 text-9xl font-black select-none pointer-events-none group-hover:text-white/20 transition-colors">
                        {index + 1}
                    </span>
                </Link>
            </motion.div>
          ))}
        </div>

        {/* --- 3. قسم معلومات إضافي (حل مشكلة Thin Content) --- */}
        <section className="mt-40 bg-white rounded-[4rem] p-10 lg:p-24 shadow-xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-50 rounded-full blur-[100px] -mr-32 -mt-32"></div>
            <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
                <div>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 leading-tight text-right">
                        متخصصون في توريد معدات <br /> 
                        <span className="text-emerald-600">حفر وصيانة الآبار</span>
                    </h2>
                    <p className="text-xl text-slate-600 leading-[2.2] mb-10 text-right">
                        نحن في <strong>أبار جروب</strong> لا نكتفي ببيع المنتجات، بل نوفر لك القطع الأصلية التي تضمن استمرارية عمل بئرك بكفاءة. متجرنا يضم أجود أنواع <strong>طلمبات الأعماق</strong>، ومواسير الحديد والسيملس، بالإضافة إلى كابلات طلمبات تتحمل أصعب الظروف.
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex items-center gap-3 text-slate-800 font-black">
                            <ShieldCheck className="text-emerald-500" /> ضمان حقيقي
                        </div>
                        <div className="flex items-center gap-3 text-slate-800 font-black">
                            <Truck className="text-sky-500" /> شحن للموقع
                        </div>
                        <div className="flex items-center gap-3 text-slate-800 font-black">
                            <Settings className="text-amber-500" /> دعم فني مجاني
                        </div>
                        <div className="flex items-center gap-3 text-slate-800 font-black">
                            <Droplets className="text-blue-500" /> مياه مستدامة
                        </div>
                    </div>
                </div>
                <div className="relative aspect-video rounded-[3rem] overflow-hidden shadow-2xl border-8 border-slate-50 group">
                    <Image 
                      src="/image/hint.jpeg" 
                      alt="توريد طلمبات ومستلزمات آبار مياه في مصر" 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-sky-900/10 group-hover:bg-transparent transition-colors"></div>
                </div>
            </div>
        </section>

        {/* حالة التحديث */}
        {categories_du.length === 0 && (
            <div className="text-center py-40 bg-white rounded-[4rem] border-4 border-dashed border-slate-100">
                <p className="text-slate-400 font-black text-2xl animate-pulse">جاري تحديث مخزون المتجر حالياً...</p>
            </div>
        )}
      </div>

      {/* --- 4. فوائد الشراء من متجرنا (SEO Boost) --- */}
      <section className="py-24 bg-slate-100 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6 text-center">
              <h2 className="text-3xl font-black mb-12">ماذا يميز توريدات أبار جروب؟</h2>
              <div className="grid md:grid-cols-3 gap-12">
                  <div className="p-8 bg-white rounded-[2.5rem] shadow-md border border-slate-50 hover:shadow-xl transition-all">
                      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Wrench size={32} />
                      </div>
                      <h4 className="text-xl font-black mb-4">توافق مع الصيانة</h4>
                      <p className="text-slate-500 font-bold leading-loose">كافة المنتجات مختارة لتسهيل عملية <strong>صيانة الآبار</strong> وتقليل فترات التوقف.</p>
                  </div>
                  <div className="p-8 bg-white rounded-[2.5rem] shadow-md border border-slate-50 hover:shadow-xl transition-all">
                      <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Zap size={32} />
                      </div>
                      <h4 className="text-xl font-black mb-4">طاقة شمسية أصلية</h4>
                      <p className="text-slate-500 font-bold leading-loose">نوفر ألواحاً وإنفرترات مخصصة لآبار المياه تضمن لك توفير 100% من الوقود.</p>
                  </div>
                  <div className="p-8 bg-white rounded-[2.5rem] shadow-md border border-slate-50 hover:shadow-xl transition-all">
                      <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Settings size={32} />
                      </div>
                      <h4 className="text-xl font-black mb-4">قطع غيار معتمدة</h4>
                      <p className="text-slate-500 font-bold leading-loose">نلتزم بـ <strong>توريد طلمبات</strong> أصلية بمواصفات تتحمل العمل الشاق في مختلف محافظات مصر.</p>
                  </div>
              </div>
          </div>
      </section>

      <div className="h-20 bg-white"></div>
    </main>
  );
}