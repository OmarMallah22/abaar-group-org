// app/store/[categoryId]/SubcategoriesClient.tsx
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
 * الواجهات البرمجية (Interfaces) لضمان توافق الأنواع
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
   * تحديث البيانات في الخلفية لضمان مزامنة المخزون
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
   * تصفية الأقسام الفرعية مع تحسين أداء البحث
   */
  const filteredSubs = useMemo(() => 
    subs.filter(sub => sub.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [subs, searchTerm]
  );

  /**
   * بناء البيانات المهيكلة (Schema.org) لقائمة الأقسام الفرعية
   */
  const listSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `أقسام ${initialCategory?.name} - أبار جروب`,
    "description": `تصفح مجموعة مستلزمات ${initialCategory?.name} المتخصصة في حفر وصيانة الآبار في مصر.`,
    "itemListElement": filteredSubs.map((sub, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": sub.name,
      "url": `https://abaargroup.org/store/${categoryId}/${sub.id}`
    }))
  }), [filteredSubs, initialCategory, categoryId]);

  return (
    <div className="bg-[#fcfcfd] min-h-screen font-arabic text-right pb-20" dir="rtl">
      {/* حقن الـ Schema في الـ HTML */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }} />
      
      {/* 1. Header & Breadcrumbs - تحسين السيو والوصولية */}
      <section className="bg-white border-b border-slate-100 pt-8 pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-sky-50/40 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-slate-400 text-sm font-medium overflow-x-auto whitespace-nowrap pb-2 md:pb-0">
              <Link href="/" className="hover:text-sky-600 transition-colors flex items-center gap-1.5 shrink-0">
                <Home size={14} /> الرئيسية
              </Link>
              <ChevronLeft size={12} className="text-slate-300" />
              <Link href="/store" className="hover:text-sky-600 transition-colors flex items-center gap-1.5 shrink-0">
                <Store size={14} /> المتجر
              </Link>
              <ChevronLeft size={12} className="text-slate-300" />
              <span className="text-sky-700 font-bold bg-sky-50 px-3 py-1 rounded-lg truncate max-w-[200px]">
                {initialCategory?.name}
              </span>
            </nav>

            <Link 
              href="/store" 
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 hover:text-sky-600 hover:border-sky-200 transition-all group shrink-0 w-fit"
            >
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              تصفح كافة الأقسام
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight">
                توريد مستلزمات <span className="text-sky-600">{initialCategory?.name}</span>
              </h1>
              <p className="text-slate-500 mt-6 text-lg max-w-2xl font-medium leading-relaxed">
                نوفر لك أفضل  <strong> المنتجات</strong> المندرجة تحت  {initialCategory?.name}، مع ضمان الجودة لكافة المحافظات المصرية.
              </p>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-4 text-slate-500 bg-white px-6 py-4 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50"
            >
              <div className="bg-sky-500 p-2.5 rounded-xl text-white shadow-lg shadow-sky-200">
                <LayoutGrid size={22} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-sky-600 font-black uppercase tracking-widest">مخزون متاح</span>
                <span className="font-black text-slate-800 text-sm">{filteredSubs.length} أقسام فرعية</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-10 relative z-20">
        
        {/* 2. Search Bar - تحسين تجربة البحث */}
        <div className="max-w-2xl mx-auto mb-20">
          <div className="relative group">
            <div className="absolute inset-0 bg-sky-500/10 blur-3xl group-focus-within:bg-sky-500/20 transition-all rounded-[2.5rem]"></div>
            <div className="relative bg-white rounded-[2.5rem] shadow-2xl border border-slate-200/60 flex items-center p-2.5 transition-all group-focus-within:border-sky-400 group-focus-within:ring-4 group-focus-within:ring-sky-50">
              <div className="p-4 text-sky-500">
                <Search size={26} />
              </div>
              <input 
                type="text"
                placeholder={`ابحث في  ${initialCategory?.name} هنا...`}
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
                    <X size={22} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* 3. Subcategories Grid - تحسين السيو التقني للبطاقات */}
        <AnimatePresence mode="popLayout">
          {filteredSubs.length > 0 ? (
            <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12">
              {filteredSubs.map((sub, index) => (
                <motion.div
                    key={sub.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    itemScope itemType="https://schema.org/ProductGroup"
                >
                    <Link 
                        href={`/store/${categoryId}/${sub.id}`} 
                        className="group block"
                        aria-label={`تصفح منتجات قسم ${sub.name}`}
                    >
                        <div className="relative aspect-square mb-8 overflow-hidden rounded-[3rem] border-4 border-white shadow-xl group-hover:shadow-sky-500/20 group-hover:border-sky-50 transition-all duration-700 bg-white">
                            <Image 
                                src={sub.image || '/placeholder.jpg'} 
                                alt={`توريد مستلزمات ${sub.name} من شركة أبار جروب لحفر الآبار`} 
                                fill 
                                priority={index < 8}
                                quality={100}
                                sizes="(max-width: 768px) 50vw, 25vw"
                                className="object-contain p-6 group-hover:scale-110 transition-transform duration-1000" 
                                itemProp="image"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-sky-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center p-8">
                                <span className="bg-white text-sky-900 px-6 py-3 rounded-2xl text-xs font-black shadow-2xl flex items-center gap-3 translate-y-8 group-hover:translate-y-0 transition-all duration-500 uppercase tracking-tighter">
                                    استعراض الموديلات <ArrowLeft size={16} />
                                </span>
                            </div>
                        </div>
                        
                        <div className="text-center px-4">
                            <h4 itemProp="name" className="font-black text-slate-800 text-lg md:text-xl group-hover:text-sky-600 transition-colors leading-snug line-clamp-2 min-h-[3.5rem] flex items-center justify-center">
                                {sub.name}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                جودة أبار جروب المعتمدة
                            </p>
                        </div>
                    </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-32 bg-white rounded-[4rem] border-4 border-dashed border-slate-100 shadow-inner relative overflow-hidden"
            >
                <div className="bg-slate-50 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm relative z-10">
                    <PackageOpen size={55} className="text-slate-300" />
                </div>
                <h3 className="text-slate-800 text-3xl font-black mb-4 relative z-10">لا توجد نتائج داخل هذا القسم</h3>
                <p className="text-slate-500 max-w-sm mx-auto font-bold text-lg leading-relaxed relative z-10">
                  لم نجد أي مطابقة  <span className="text-sky-600">{searchTerm}</span>
                </p>
                <button 
                  onClick={() => setSearchTerm("")}
                  className="mt-10 px-12 py-4 bg-sky-600 text-white rounded-2xl font-black shadow-2xl shadow-sky-100 hover:bg-sky-700 transition-all active:scale-95 relative z-10"
                >
                  إعادة تعيين البحث
                </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. قسم المحتوى الغني (SEO Content Expansion) - يحل مشكلة Thin Content */}
        <section className="mt-32 border-t border-slate-100 pt-24">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-10">
                    <div className="inline-flex items-center gap-3 bg-emerald-50 text-emerald-600 px-5 py-2 rounded-full font-black text-xs">
                        <ShieldCheck size={16} /> خيار المهندسين الأول في مصر
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                        لماذا تختار  {initialCategory?.name} من أبار جروب؟
                    </h2>
                    <p className="text-xl text-slate-600 leading-[2.2] font-medium">
                        في أبار جروب، نحن لا نكتفي بعملية <strong>توريد مستلزمات الآبار</strong>، بل نحرص على اختيار القطع التي تتحمل ظروف التشغيل الشاقة في المواقع المصرية. خبرتنا في <strong>صيانة الآبار</strong> الجوفية جعلتنا ندرك أدق التفاصيل التي تضمن طول عمر المعدة وكفاءتها في استخراج المياه.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="flex gap-4 p-6 bg-white rounded-3xl border border-slate-50 shadow-sm">
                            <Truck className="text-sky-500 shrink-0" size={32} />
                            <div>
                                <h5 className="font-black text-slate-900 mb-1">شحن سريع</h5>
                                <p className="text-sm text-slate-500 font-bold">توصيل لكافة المحافظات والمزارع.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 p-6 bg-white rounded-3xl border border-slate-50 shadow-sm">
                            <Wrench className="text-emerald-500 shrink-0" size={32} />
                            <div>
                                <h5 className="font-black text-slate-900 mb-1">دعم فني</h5>
                                <p className="text-sm text-slate-500 font-bold">استشارات مجانية للتركيب والصيانة.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative">
                    <div className="absolute inset-0 bg-sky-200 rounded-[4rem] rotate-3 opacity-20"></div>
                    <div className="relative aspect-video rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white group">
                         <Image 
                            src="/image/about.jpeg" 
                            alt={`عمليات فحص وصيانة ${initialCategory?.name}`} 
                            fill 
                            className="object-cover transition-transform duration-700 group-hover:scale-105" 
                         />
                         <div className="absolute inset-0 bg-sky-950/20 group-hover:bg-transparent transition-all"></div>
                    </div>
                </div>
            </div>
        </section>
      </div>

      {/* 5. تذييل تفاعلي سريع */}
      <div className="max-w-7xl mx-auto px-6 mt-32">
        <div className="bg-slate-900 rounded-[3.5rem] p-10 md:p-20 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px] -mr-20 -mt-20"></div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="text-center lg:text-right">
              <h5 className="text-3xl md:text-4xl font-black mb-6">لم تجد القطعة المناسبة؟</h5>
              <p className="text-slate-400 text-lg max-w-xl font-medium leading-loose">
                مخزوننا يتحدث يومياً. تواصل معنا مباشرة لتوفير مستلزمات <strong>حفر الآبار</strong> أو أنظمة <strong>الطاقة الشمسية</strong> الخاصة بك فوراً.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 shrink-0 w-full lg:w-auto">
               <a 
                href="https://wa.me/201211110240" 
                className="px-12 py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[1.5rem] font-black transition-all shadow-xl active:scale-95 text-center flex items-center justify-center gap-3"
              >
                تواصل عبر واتساب <ArrowLeft size={20} />
              </a>
               <Link href="/contact" className="px-12 py-5 bg-white/5 hover:bg-white/10 text-white rounded-[1.5rem] font-black border border-white/10 transition-all text-center">
                اتصل بنا هاتفياً
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="h-20"></div>
    </div>
  );
}