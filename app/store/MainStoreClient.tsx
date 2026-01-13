// app/store/MainStoreClient.tsx
'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from '@/lib/supabase';
import { ArrowRight, ShoppingBag, Zap } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

/**
 * تعريف الواجهة (Interface) لضمان توافق الأنواع (TypeScript)
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
  // تعريف حالة الأقسام مبتدئة ببيانات السيرفر
  const [categories_du, setCategories] = useState<Category[]>(initialCategories);

  // تحديث البيانات لحظياً في حال حدوث تغيير
  useEffect(() => {
    const getCats = async () => {
      const { data } = await supabase.from('categories_du').select('*').order('name', { ascending: true });
      if (data) setCategories(data);
    };
    // لا يتم الجلب مجدداً إلا إذا كانت البيانات الأولية فارغة
    if (initialCategories.length === 0) getCats();
  }, [initialCategories]);

  return (
    <main className="bg-slate-50 min-h-screen font-arabic" dir="rtl">
      
      {/* --- 1. Hero Section (الموحد السينمائي) --- */}
      <section className="relative h-[55vh] md:h-[65vh] flex items-center justify-center overflow-hidden bg-sky-950">
        {/* خلفية الفيديو الخاصة بك */}
        <video autoPlay muted loop playsInline className="absolute inset-0 z-0 w-full h-full object-cover opacity-50">
          <source src="/image/project.m4v" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-sky-900/60 via-transparent to-slate-50 z-[1]" />
        
        <div className="relative z-10 text-center px-4">
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-6 py-2 bg-emerald-500 text-white text-xs font-black rounded-full mb-6 tracking-widest animate-bounce shadow-xl"
          >
             أبار جروب
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white drop-shadow-2xl mb-6"
          >
            متجر <span className="text-emerald-400">أبار جروب</span>
          </motion.h1>
          
          <p className="text-sky-100 text-lg md:text-2xl max-w-3xl mx-auto mt-6 font-medium opacity-90 leading-relaxed drop-shadow-md">
            تصفح مجموعة كبيرة من المنتجات التي تتعلق بعالم الآبار وحلول الطاقة المستدامة
          </p>
        </div>
      </section>

      {/* --- 2. Categories Grid (شبكة الأقسام) --- */}
      <div className="max-w-7xl mx-auto px-6 py-28 relative z-20">
        <div className="flex items-center gap-4 mb-16">
            <div className="p-3 bg-sky-100 rounded-2xl text-sky-600">
                <ShoppingBag size={28} />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">أقسام المتجر الرئيسية</h2>
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
                    className="group relative aspect-[3/4] flex items-end rounded-[3rem] overflow-hidden shadow-2xl transition-all hover:-translate-y-3  bg-slate-200"
                >
                    {/* عرض الصورة مع تأثير زووم عند التمرير */}
                    <Image 
                        src={cat.image || '/placeholder.jpg'} 
                        alt={cat.name} 
                        fill 
                        className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                    />
                    
                    {/* تدرج لوني لضمان وضوح النص */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                    
                    <div className="relative z-10 p-10 w-full">
                        <div className="flex items-center gap-2 text-emerald-400 mb-2 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                            <Zap size={16} fill="currentColor" />
                            <span className="text-xs font-black uppercase tracking-tighter">منتجات معتمدة</span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">{cat.name}</h3>
                        <div className="flex items-center gap-3 text-sky-400 font-black text-sm group-hover:gap-5 transition-all">
                            <span>استكشاف القسم</span> 
                            <ArrowRight size={20} className="transition-transform" />
                        </div>
                    </div>

                    {/* زخرفة رقمية خلفية */}
                    <span className="absolute top-8 left-8 text-white/5 text-8xl font-black select-none pointer-events-none group-hover:text-white/10 transition-colors">
                        0{index + 1}
                    </span>
                </Link>
            </motion.div>
          ))}
        </div>

        {/* حالة عدم وجود أقسام */}
        {categories_du.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold text-xl">جاري تحديث قائمة الأقسام حالياً...</p>
            </div>
        )}
      </div>

      {/* لمسة جمالية سفلية */}
      <div className="h-20 bg-gradient-to-b from-slate-50 to-white"></div>
    </main>
  );
}