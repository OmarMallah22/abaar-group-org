'use client';

import React, { useState, useEffect, useMemo } from "react";
import { supabase } from '@/lib/supabase';
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, ArrowRight, ChevronLeft, Search, LayoutGrid, 
  Home, Store, PackageOpen, X, Info, ShieldCheck, Truck, Wrench 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * الواجهات البرمجية (Interfaces)
 */
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

  /**
   * تحديث البيانات في الخلفية
   */
  useEffect(() => {
    const refreshSubs = async () => {
      const { data } = await supabase
        .from('subcategories_du')
        .select('*')
        .eq('category_id', categoryId)
        .order('name', { ascending: true });
      if (data) setSubs(data);
    };
    if (initialSubs.length === 0) refreshSubs();
  }, [categoryId, initialSubs.length]);

  /**
   * تصفية الأقسام مع تحسين الأداء
   */
  const filteredSubs = useMemo(() => 
    subs.filter(sub => sub.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [subs, searchTerm]
  );

  return (
    <div className="bg-[#fcfcfd] min-h-screen font-arabic text-right pb-20 overflow-x-hidden" dir="rtl">
      
      {/* 1. Header & Breadcrumbs */}
      <section className="bg-white border-b border-slate-100 pt-6 md:pt-8 pb-12 md:pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-sky-50/40 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-slate-400 text-[11px] md:text-sm font-bold overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
              <Link href="/" className="hover:text-sky-600 transition-colors flex items-center gap-1.5 shrink-0">
                <Home size={14} /> الرئيسية
              </Link>
              <ChevronLeft size={12} className="text-slate-300" />
              <Link href="/store" className="hover:text-sky-600 transition-colors flex items-center gap-1.5 shrink-0">
                <Store size={14} /> المتجر
              </Link>
              <ChevronLeft size={12} className="text-slate-300" />
              <span className="text-sky-700 font-black bg-sky-50 px-2 py-1 rounded-lg truncate max-w-[150px]">
                {initialCategory?.name}
              </span>
            </nav>

            <Link 
              href="/store" 
              className="inline-flex items-center gap-2 px-4 my-5 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-black text-xs md:text-sm shadow-sm hover:bg-slate-50 transition-all shrink-0 w-fit"
            >
              <ArrowRight size={16} /> تصفح كافة الأقسام
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="text-2xl md:text-4xl lg:text-6xl font-black text-slate-900 leading-tight">
                توريد مستلزمات <span className="text-sky-600">{initialCategory?.name}</span>
              </h1>
              <p className="text-slate-500 mt-4 text-base md:text-lg font-bold leading-relaxed">
                نوفر لك أفضل المنتجات المندرجة تحت {initialCategory?.name}، بضمان أبار جروب.
              </p>
            </div>

           
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-8 relative z-20">
        
        {/* 2. Search Bar */}
        <div className="max-w-xl mx-auto mb-12 md:mb-20">
          <div className="relative">
            <div className="absolute inset-0 bg-sky-500/5 blur-2xl rounded-full"></div>
            <div className="relative bg-white rounded-2xl md:rounded-[2.5rem] shadow-xl border border-slate-200/60 flex items-center p-1.5 focus-within:ring-4 focus-within:ring-sky-50 transition-all">
              <div className="p-3 md:p-4 text-sky-500">
                <Search size={24} />
              </div>
              <input 
                type="text"
                placeholder={`ابحث في ${initialCategory?.name}...`}
                value={searchTerm}
                className="w-full py-2 bg-transparent outline-none text-slate-800 placeholder:text-slate-400 font-bold text-sm md:text-lg"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="p-2 ml-2 text-slate-400 hover:text-red-500 transition-colors">
                  <X size={20} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 3. Subcategories Grid - تحسين حجم الصور وسرعة الاستجابة */}
        <AnimatePresence mode="wait">
          {filteredSubs.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-10"
            >
              {filteredSubs.map((sub, index) => (
                <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }} // تسريع زمن الظهور
                >
                    <Link 
                        href={`/store/${categoryId}/${sub.id}`} 
                        className="group block touch-manipulation" // تحسين الاستجابة للمس
                    >
                        {/* حاوية الصورة المعدلة لتظهر بشكل أكبر */}
                        <div className="relative aspect-square mb-4 md:mb-6 overflow-hidden rounded-2xl md:rounded-[2.5rem] border-2 md:border-4 border-white shadow-md group-hover:shadow-sky-200 group-hover:border-sky-100 transition-all duration-300 bg-white">
                            <Image 
                                src={sub.image || '/placeholder.jpg'} 
                                alt={sub.name} 
                                fill 
                                priority={index < 6}
                                sizes="(max-width: 768px) 50vw, 33vw"
                                className="object-contain p-2 md:p-3 group-hover:scale-105 transition-transform duration-500" // تقليل padding وزيادة الحجم
                            />

                            <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                                <div className="bg-white/95 text-sky-900 px-4 py-2 rounded-xl text-[10px] font-black shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform hidden md:flex items-center gap-2">
                                  عرض التفاصيل <ArrowLeft size={14} />
                                </div>
                            </div>
                        </div>
                        
                        <div className="text-center px-1">
                            <h4 className="font-black text-slate-800 text-sm md:text-lg group-hover:text-sky-600 transition-colors leading-tight line-clamp-2 min-h-[2.5rem] flex items-center justify-center">
                                {sub.name}
                            </h4>
                            
                        </div>
                    </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
                <PackageOpen size={40} className="text-slate-200 mx-auto mb-4" />
                <h3 className="text-slate-800 text-xl font-black">لا توجد نتائج</h3>
                <button onClick={() => setSearchTerm("")} className="mt-4 text-sky-600 font-black text-sm underline">مسح البحث</button>
            </div>
          )}
        </AnimatePresence>

        {/* 4. SEO Content Section */}
        <section className="mt-24 md:mt-32 border-t border-slate-100 pt-16 md:pt-24">
            <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
                <div className="space-y-6 md:space-y-8">
                    <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full font-black text-[10px] md:text-xs">
                        <ShieldCheck size={14} /> الخيار الأول للمشاريع القومية والمزارع
                    </div>
                    <h2 className="text-2xl md:text-4xl font-black text-slate-900 leading-tight">
                        لماذا تعتمد على أبار جروب في توريد {initialCategory?.name}؟
                    </h2>
                    <p className="text-base md:text-lg text-slate-600 leading-relaxed font-bold">
                        تتميز أبار جروب بتقديم حلول متكاملة لـ <strong>توريد مستلزمات الآبار</strong>، حيث تخضع جميع المنتجات لاختبارات دقيقة لضمان تحملها ملوحة المياه العالية وظروف الآبار العميقة في مصر.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex gap-3 p-4 bg-white rounded-2xl border border-slate-50 shadow-sm">
                            <Truck className="text-sky-500 shrink-0" size={24} />
                            <div>
                                <h5 className="font-black text-slate-900 text-sm">توريد فوري</h5>
                                <p className="text-[11px] text-slate-500 font-bold">شحن لجميع المحافظات خلال 48 ساعة.</p>
                            </div>
                        </div>
                        <div className="flex gap-3 p-4 bg-white rounded-2xl border border-slate-50 shadow-sm">
                            <Wrench className="text-emerald-500 shrink-0" size={24} />
                            <div>
                                <h5 className="font-black text-slate-900 text-sm">إشراف فني</h5>
                                <p className="text-[11px] text-slate-500 font-bold">دعم فني متخصص عند التركيب.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative">
                    <div className="absolute inset-0 bg-sky-100 rounded-[2.5rem] md:rounded-[4rem] rotate-2 opacity-30"></div>
                    <div className="relative aspect-video rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl border-4 md:border-8 border-white group">
                         <Image 
                            src="/image/about.jpeg" 
                            alt={`عمليات فحص وصيانة ${initialCategory?.name}`} 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-700" 
                         />
                         <div className="absolute inset-0 bg-sky-900/10"></div>
                    </div>
                </div>
            </div>
        </section>
      </div>

      {/* 5. CTA Footer */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-20 md:mt-32">
        <div className="bg-slate-900 rounded-[2rem] md:rounded-[3.5rem] p-8 md:p-16 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-[100px] -mr-20 -mt-20"></div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 text-center lg:text-right">
            <div>
              <h5 className="text-2xl md:text-4xl font-black mb-4">هل تحتاج الي اي استشارة </h5>
              <p className="text-slate-400 text-sm md:text-lg font-bold max-w-xl">
                تواصل معنا لتحديد أفضل نوع من <strong>مستلزمات الآبار</strong> يناسب طبيعة مشروعك.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
               <a 
                href="https://wa.me/201211110240" 
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                واتساب  <ArrowLeft size={18} />
              </a>
               <Link href="/contact" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-black border border-white/10 transition-all">
                طلب عرض سعر
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}