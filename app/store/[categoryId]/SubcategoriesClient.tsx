// app/store/[categoryId]/SubcategoriesClient.tsx
'use client';

import React, { useState, useEffect, useMemo } from "react";
import { supabase } from '@/lib/supabase';
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ChevronLeft, Search, LayoutGrid, Home, Store, PackageOpen, X, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Subcategory {
  id: string;
  name: string;
  image: string;
  category_id: string;
}

interface Category {
  name: string;
}

interface SubcategoriesClientProps {
  initialCategory: Category;
  initialSubs: Subcategory[];
  categoryId: string;
}

export default function SubcategoriesClient({ initialCategory, initialSubs, categoryId }: SubcategoriesClientProps) {
  const [subs, setSubs] = useState<Subcategory[]>(initialSubs);
  const [searchTerm, setSearchTerm] = useState("");

  // تحسين: تحديث البيانات في الخلفية
  useEffect(() => {
    const refreshSubs = async () => {
      const { data } = await supabase.from('subcategories_du').select('*').eq('category_id', categoryId);
      if (data) setSubs(data);
    };
    if (initialSubs.length === 0) refreshSubs();
  }, [categoryId, initialSubs.length]);

  // تحسين: تصفية النتائج باستخدام useMemo للأداء
  const filteredSubs = useMemo(() => 
    subs.filter(sub => sub.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [subs, searchTerm]
  );

  return (
    <div className="bg-[#fcfcfd] min-h-screen font-arabic text-right pb-20" dir="rtl">
      
      {/* 1. Header & Breadcrumbs - تحسين الهوية البصرية */}
      <section className="bg-white border-b border-slate-100 pt-8 pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-sky-50/40 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            {/* مسار التنقل - محسن للجوال */}
            <nav className="flex flex-wrap items-center gap-2 text-slate-400 text-sm font-medium overflow-x-auto whitespace-nowrap pb-2 md:pb-0">
              <Link href="/" className="hover:text-sky-600 transition-colors flex items-center gap-1.5 shrink-0">
                <Home size={14} /> الرئيسية
              </Link>
              <ChevronLeft size={12} className="text-slate-300" />
              <Link href="/store" className="hover:text-sky-600 transition-colors flex items-center gap-1.5 shrink-0">
                <Store size={14} /> المتجر
              </Link>
              <ChevronLeft size={12} className="text-slate-300" />
              <span className="text-sky-700 font-bold bg-sky-50 px-3 py-1 rounded-lg truncate max-w-[150px]">
                {initialCategory?.name}
              </span>
            </nav>

            <Link 
              href="/store" 
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 hover:text-sky-600 hover:border-sky-200 transition-all group shrink-0 w-fit"
            >
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              العودة للأقسام الرئيسية
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight">
                {initialCategory?.name}
              </h1>
              <p className="text-slate-500 mt-4 text-lg max-w-2xl font-medium">
                اكتشف مجموعة مختارة من أفضل المنتجات والمعدات المتاحة في هذا القسم.
              </p>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-4 text-slate-500 bg-sky-50/50 px-6 py-4 rounded-[2rem] border border-sky-100 shadow-sm"
            >
              <div className="bg-sky-500 p-2 rounded-xl text-white">
                <LayoutGrid size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-sky-600 font-black uppercase">التوفر</span>
                <span className="font-black text-slate-700 text-sm"><b>{filteredSubs.length}</b> أقسام فرعية</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-10 relative z-20">
        
        {/* 2. Search Bar - تحسين تفاعل البحث */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative group">
            <div className="absolute inset-0 bg-sky-500/15 blur-2xl group-focus-within:bg-sky-500/30 transition-all rounded-[2.5rem]"></div>
            <div className="relative bg-white rounded-[2rem] shadow-xl border border-slate-200 flex items-center p-2 transition-all group-focus-within:border-sky-300">
              <div className="p-4 text-sky-500">
                <Search size={24} />
              </div>
              <input 
                type="text"
                placeholder="ابحث داخل هذا القسم..."
                value={searchTerm}
                className="w-full py-4 bg-transparent outline-none text-slate-800 placeholder:text-slate-400 font-bold text-lg"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <AnimatePresence>
                {searchTerm && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setSearchTerm("")}
                    className="p-3 ml-2 text-slate-400 hover:text-red-500 bg-slate-50 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
          {searchTerm && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-4 text-slate-500 font-bold text-sm"
            >
              نتائج البحث عن: <span className="text-sky-600">{searchTerm}</span> (وجدنا {filteredSubs.length})
            </motion.p>
          )}
        </div>

        {/* 3. Subcategories Grid - تحسين عرض الصور والبطاقات */}
        <AnimatePresence mode="popLayout">
          {filteredSubs.length > 0 ? (
            <motion.div 
                layout
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10"
            >
              {filteredSubs.map((sub, index) => (
                <motion.div
                    key={sub.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                >
                    <Link 
                        href={`/store/${categoryId}/${sub.id}`} 
                        className="group block"
                    >
                        <div className="relative aspect-square mb-6 overflow-hidden rounded-[2.5rem] border border-slate-100 shadow-sm group-hover:shadow-2xl group-hover:shadow-sky-500/15 transition-all duration-700 bg-white">
                            {/* تم تحسين معايير الصورة للوضوح الأقصى */}
                            <Image 
                                src={sub.image || '/placeholder.jpg'} 
                                alt={sub.name} 
                                fill 
                                priority={index < 8}
                                quality={100}
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                className="object-contain p-3 group-hover:scale-110 transition-transform duration-1000" 
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-sky-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center p-8">
                                <span className="bg-sky-600 text-white px-8 py-3 rounded-2xl text-sm font-black shadow-2xl flex items-center gap-3 translate-y-8 group-hover:translate-y-0 transition-all duration-500">
                                    تصفح الآن <ArrowLeft size={18} />
                                </span>
                            </div>
                            
                            <div className="absolute top-4 left-4 w-10 h-10 border-t border-l border-sky-100 rounded-tl-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                        </div>
                        
                        <div className="text-center px-4">
                            <h4 className="font-black text-slate-800 text-lg md:text-xl group-hover:text-sky-600 transition-colors leading-snug line-clamp-2 min-h-[3rem] flex items-center justify-center">
                                {sub.name}
                            </h4>
                            <div className="mt-3 w-8 h-1.5 bg-slate-100 mx-auto rounded-full group-hover:w-16 group-hover:bg-sky-400 transition-all duration-500"></div>
                        </div>
                    </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-24 bg-white rounded-[4rem] border-2 border-dashed border-slate-200 shadow-inner overflow-hidden relative"
            >
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] text-sky-900 pointer-events-none">
                  <Search size={200} />
                </div>
                <div className="bg-slate-50 w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm relative z-10">
                    <PackageOpen size={45} className="text-slate-300" />
                </div>
                <h3 className="text-slate-800 text-3xl font-black mb-4 relative z-10">عذراً، لا توجد نتائج مطابقة</h3>
                <p className="text-slate-500 max-w-sm mx-auto font-bold text-lg leading-relaxed relative z-10">
                  لم نجد أي قسم يطابق كلمات البحث هذه. حاول استخدام كلمات مفتاحية أخرى.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="px-8 py-3 bg-sky-600 text-white rounded-2xl font-black shadow-lg shadow-sky-200 hover:bg-sky-700 transition-all active:scale-95"
                  >
                    مسح البحث
                  </button>
                  <Link href="/store" className="px-8 py-3 text-sky-600 font-black hover:bg-sky-50 rounded-2xl transition-all">
                    العودة لجميع الأقسام
                  </Link>
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* لمسة نهائية: قسم المساعدة السريع */}
      <div className="max-w-7xl mx-auto px-6 mt-20">
        <div className="bg-slate-900 rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <h5 className="text-2xl font-black mb-2">هل تحتاج لمساعدة في اختيار المنتج؟</h5>
            <p className="text-slate-400 font-medium">فريقنا الفني جاهز لمساعدتك في الحصول على المعدات المناسبة لمشروعك.</p>
          </div>
          <a 
            href="https://wa.me/201211110240" 
            target="_blank"
            className="px-10 py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[1.5rem] font-black transition-all shadow-xl active:scale-95 relative z-10 shrink-0"
          >
            تحدث مع خبير الآن
          </a>
        </div>
      </div>

      <div className="h-20"></div>
    </div>
  );
}