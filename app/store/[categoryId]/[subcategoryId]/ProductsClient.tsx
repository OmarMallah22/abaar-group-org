// app/store/[categoryId]/[subcategoryId]/ProductsClient.tsx
'use client';

import React, { useState, useEffect, useMemo } from "react";
import { supabase } from '@/lib/supabase';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { 
  Search, Home, ChevronLeft, 
  PackageSearch, Filter, X,
  ArrowUpDown, ExternalLink, 
  ArrowRight, ArrowLeft, LayoutGrid,
  Zap, ShieldCheck, ShoppingCart, Wrench, Truck, Droplets
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

/**
 * واجهات البيانات (Interfaces)
 */
interface Product {
  id: string;
  name: string;
  image: string;
  brand?: string;
  subcategory_id: string;
}

interface Brand {
  name: string;
}

interface ProductsClientProps {
  initialProducts: Product[];
  initialBrands: Brand[];
  subcategoryInfo: {
    name: string;
    parent_id: string;
    parent_name: string;
  };
  params: { categoryId: string; subcategoryId: string };
}

export default function ProductsClient({ initialProducts, initialBrands, subcategoryInfo, params }: ProductsClientProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [brands] = useState<Brand[]>(initialBrands);

  // حالات التحكم في الواجهة
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  /**
   * بناء البيانات المهيكلة (Schema.org) - ضروري جداً لتصدر نتائج البحث
   */
  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `منتجات ${subcategoryInfo?.name} - أبار جروب`,
    "description": `تصفح أفضل موديلات ${subcategoryInfo?.name} المخصصة لحفر وصيانة آبار المياه في مصر.`,
    "url": `https://abaargroup.org/store/${params.categoryId}/${params.subcategoryId}`,
    "itemListElement": products.map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": `https://abaargroup.org/product/${p.id}`,
      "name": p.name
    }))
  }), [products, subcategoryInfo, params]);

  /**
   * منطق الفلترة والترتيب
   */
  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesBrand = selectedBrand === "all" || p.brand === selectedBrand;
        return matchesSearch && matchesBrand;
      })
      .sort((a, b) => {
        if (sortBy === "name-asc") return a.name.localeCompare(b.name);
        if (sortBy === "name-desc") return b.name.localeCompare(a.name);
        return 0;
      });
  }, [products, searchQuery, selectedBrand, sortBy]);

  return (
    <div className="bg-[#f8fafc] min-h-screen font-arabic text-right pb-20" dir="rtl">
      {/* حقن الـ Schema في الصفحة */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      {/* 1. Navigation Bar - تحسين الروابط لتشير إلى .org */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/90">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden min-w-0 flex-1">
            <button 
              onClick={() => router.back()}
              className="p-2.5 rounded-xl bg-slate-50 text-slate-700 hover:bg-sky-600 hover:text-white transition-all shrink-0 border border-slate-100 group"
              aria-label="الرجوع للخلف"
            >
              <ArrowRight size={20} className="group-active:-translate-x-1 transition-transform" />
            </button>

            <div className="w-px h-6 bg-slate-200 mx-2 hidden sm:block shrink-0"></div>

            <div className="flex items-center gap-2 text-sm overflow-x-auto no-scrollbar py-1 min-w-0 whitespace-nowrap" aria-label="Breadcrumb">
              <Link href="/" className="font-bold text-slate-500 hover:text-sky-600 transition-colors shrink-0">الرئيسية</Link>
              <ChevronLeft size={14} className="text-slate-300 shrink-0" />
              <Link href="/store" className="font-bold text-slate-500 hover:text-sky-600 transition-colors shrink-0">المتجر</Link>
              {subcategoryInfo?.parent_name && (
                <>
                  <ChevronLeft size={14} className="text-slate-300 shrink-0" />
                  <Link href={`/store/${subcategoryInfo.parent_id}`} className="font-bold text-slate-500 hover:text-sky-600 transition-colors truncate max-w-[120px]">
                    {subcategoryInfo.parent_name}
                  </Link>
                </>
              )}
              <ChevronLeft size={14} className="text-slate-300 shrink-0" />
              <h1 className="font-black text-sky-700 bg-sky-50 px-3 py-1 rounded-lg border border-sky-100 shrink-0 truncate max-w-[200px]">
                {subcategoryInfo?.name}
              </h1>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-black text-emerald-700">
              {filteredAndSortedProducts.length} طراز متاح حالياً
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* 2. Enhanced Toolbar - توزيع الكلمات المفتاحية في شريط الأدوات */}
        <div className="mb-12 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-sky-50 rounded-full -mr-20 -mt-20 opacity-40"></div>
            
            <div className="flex flex-col lg:flex-row gap-8 items-center relative z-10">
              <div className="relative w-full lg:flex-1 group">
                <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={24} />
                <input 
                  type="text" 
                  placeholder={`ابحث عن موديلات ${subcategoryInfo?.name} المتاحة للتوريد...`}
                  className="w-full pr-14 pl-6 py-5 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-sky-500 rounded-[1.5rem] outline-none transition-all text-lg font-bold shadow-inner"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                <div className="flex items-center gap-3 bg-slate-100 p-2.5 rounded-2xl flex-1 md:flex-none">
                  <ArrowUpDown size={20} className="text-slate-500 mr-2" />
                  <select 
                    className="bg-transparent text-sm font-black text-slate-700 outline-none cursor-pointer min-w-[140px]"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="default">الترتيب التلقائي</option>
                    <option value="name-asc">الاسم (أ - ي)</option>
                    <option value="name-desc">الاسم (ي - أ)</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 bg-slate-100 p-2.5 rounded-2xl flex-1 md:flex-none">
                  <Filter size={20} className="text-slate-500 mr-2" />
                  <select 
                    className="bg-transparent text-sm font-black text-slate-700 outline-none cursor-pointer min-w-[140px]"
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                  >
                    <option value="all">كل الماركات</option>
                    {brands.map((b, i) => <option key={i} value={b.name}>{b.name}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6">
             
              <p className="text-slate-400 font-bold text-sm bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
                عرض {filteredAndSortedProducts.length} من أصل {products.length} طراز فني
              </p>
          </div>
        </div>

        {/* 3. Products Grid - تحسين الـ Alt Text والروابط الوصفية */}
        <AnimatePresence mode="popLayout">
          {filteredAndSortedProducts.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 md:gap-10"
            >
              {filteredAndSortedProducts.map((product, index) => (
                <motion.article
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <Link 
                    href={`/product/${product.id}`} 
                    className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden hover:border-sky-400 hover:shadow-2xl hover:shadow-sky-500/15 transition-all duration-700 flex flex-col h-full relative"
                    aria-label={`استعراض تفاصيل ${product.name}`}
                  >
                    <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-emerald-500 text-white p-2 rounded-xl shadow-lg shadow-emerald-200">
                           <ShoppingCart size={18} />
                        </div>
                    </div>

                    <div className="relative aspect-square bg-slate-50 flex items-center justify-center p-8 overflow-hidden border-b border-slate-50">
                      <Image 
                        src={product.image || '/placeholder.jpg'} 
                        alt={`توريد ${product.name} - أصلية بضمان أبار جروب`} 
                        fill 
                        className="object-contain p-4 group-hover:scale-110 transition-transform duration-1000" 
                        sizes="(max-width: 768px) 50vw, 15vw"
                      />
                      <div className="absolute inset-0 bg-sky-900/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow bg-white">
                      <div className="flex items-center gap-2 mb-3">
                         <span className="bg-sky-50 text-sky-600 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-sky-100">
                           {product.brand || 'Premium'}
                         </span>
                      </div>
                      <h3 className="text-sm md:text-[15px] font-black text-slate-800 line-clamp-2 leading-snug group-hover:text-sky-600 transition-colors h-10 mb-4">
                        {product.name}
                      </h3>
                      
                      <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between text-sky-600 font-black text-[11px] uppercase">
                         <span>المواصفات</span>
                         <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-40 bg-white rounded-[4rem] border-2 border-dashed border-slate-200 shadow-inner overflow-hidden relative"
            >
              <div className="bg-slate-50 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm relative z-10">
                <PackageSearch size={64} className="text-slate-300" />
              </div>
              <h3 className="text-3xl font-black text-slate-800 relative z-10">لا توجد طرازات مطابقة</h3>
              <p className="text-slate-500 mt-4 text-lg font-bold relative z-10">نحن نقوم بتحديث مخزون {subcategoryInfo?.name} باستمرار، حاول مرة أخرى قريباً.</p>
              <button 
                onClick={() => {setSearchQuery(""); setSelectedBrand("all");}} 
                className="mt-10 bg-slate-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-sky-600 transition-all shadow-xl active:scale-95 relative z-10"
              >
                إعادة تعيين كافة الفلاتر
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. SEO Section: حل مشكلة Thin Content (مهم جداً للـ SEO) */}
        <section className="mt-32 border-t border-slate-100 pt-24">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
                <div className="space-y-10">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                        دليلك الفني لاختيار <br />
                        <span className="text-emerald-600">{subcategoryInfo?.name}</span> الأنسب لبئرك
                    </h2>
                    <div className="space-y-6 text-slate-600 text-lg leading-[2.2] font-medium">
                        <p>
                            تعد عملية <strong>توريد مستلزمات الآبار</strong> خطوة حرجة في عمر أي مشروع مائي. في أبار جروب، نحرص على توفير موديلات {subcategoryInfo?.name} التي أثبتت كفاءة عالية في ظروف التربة المصرية المختلفة.
                        </p>
                        <p>
                            سواء كنت تبحث عن قطع غيار لغرض <strong>صيانة الآبار</strong> الدورية أو ترغب في تجهيز بئر جديد يعمل بـ <strong>الطاقة الشمسية</strong>، فإن فريقنا الهندسي يقدم لك الدعم الكامل لاختيار المواصفات الفنية الدقيقة التي تضمن لك تدفق مياه مستقر وبأقل تكلفة تشغيلية.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
                        <div className="flex flex-col items-center p-6 bg-white rounded-3xl shadow-sm border border-slate-50">
                            <ShieldCheck className="text-emerald-500 mb-4" size={32} />
                            <span className="font-black text-sm text-slate-800">جودة معتمدة</span>
                        </div>
                        <div className="flex flex-col items-center p-6 bg-white rounded-3xl shadow-sm border border-slate-50">
                            <Truck className="text-sky-500 mb-4" size={32} />
                            <span className="font-black text-sm text-slate-800">توريد سريع</span>
                        </div>
                        <div className="flex flex-col items-center p-6 bg-white rounded-3xl shadow-sm border border-slate-50">
                            <Wrench className="text-amber-500 mb-4" size={32} />
                            <span className="font-black text-sm text-slate-800">دعم فني</span>
                        </div>
                    </div>
                </div>
                <div className="relative group">
                    <div className="absolute inset-0 bg-sky-600 rounded-[4rem] rotate-3 opacity-10 group-hover:rotate-0 transition-transform duration-700"></div>
                    <div className="relative aspect-video rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white">
                        <Image 
                           src="/image/hint.jpeg" 
                           alt={`معدات ${subcategoryInfo?.name} المخصصة لحفر الآبار في مصر`} 
                           fill 
                           className="object-cover group-hover:scale-105 transition-transform duration-1000" 
                        />
                    </div>
                </div>
            </div>
        </section>

        {/* 5. Footer Interaction */}
        <section className="mt-32">
            <div className="bg-slate-900 rounded-[4rem] p-10 md:p-20 text-white flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
                <div className="relative z-10 text-center md:text-right">
                    <h5 className="text-3xl font-black mb-6">استشارة فنية مجانية؟</h5>
                    <p className="text-slate-400 text-lg max-w-xl font-medium leading-loose">
                        لا تتردد في التواصل مع مهندسينا لمناقشة مواصفات <strong>طلمبات المياه</strong> أو تجهيزات <strong>حفر الآبار</strong> المطلوبة لمشروعك القادم.
                    </p>
                </div>
                <div className="relative z-10 shrink-0 w-full md:w-auto">
                    <a 
                      href="https://wa.me/201211110240" 
                      target="_blank"
                      className="flex items-center justify-center gap-4 bg-emerald-500 hover:bg-emerald-600 text-white px-12 py-6 rounded-[2rem] font-black text-xl transition-all shadow-2xl active:scale-95"
                    >
                      تحدث مع مهندس <ArrowUpRight size={24} className="rotate-45" />
                    </a>
                </div>
            </div>
        </section>
      </main>
    </div>
  );
}

function ArrowUpRight({ size, className }: { size: number; className?: string }) {
  return (
    <svg 
      width={size} height={size} viewBox="0 0 24 24" fill="none" 
      stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}
    >
      <line x1="7" y1="17" x2="17" y2="7"></line>
      <polyline points="7 7 17 7 17 17"></polyline>
    </svg>
  );
}