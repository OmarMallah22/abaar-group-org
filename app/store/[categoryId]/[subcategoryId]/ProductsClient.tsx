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
  Zap, ShieldCheck, ShoppingCart
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

/**
 * واجهات البيانات لحل مشاكل TypeScript
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
  const [loading, setLoading] = useState(false);

  // حالات التحكم في الواجهة
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  /**
   * منطق الفلترة والترتيب باستخدام useMemo لضمان سلاسة الـ UX
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
      
      {/* 1. Navigation Bar - تثبيت الهيدر مع تحسين المسار */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/90">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 overflow-hidden min-w-0 flex-1">
            <button 
              onClick={() => router.back()}
              className="p-2.5 rounded-xl bg-slate-50 text-slate-700 hover:bg-sky-600 hover:text-white transition-all shrink-0 border border-slate-100 group"
            >
              <ArrowRight size={20} className="group-active:-translate-x-1 transition-transform" />
            </button>

            <div className="w-px h-6 bg-slate-200 mx-2 hidden sm:block shrink-0"></div>

            <div className="flex items-center gap-2 text-sm overflow-x-auto no-scrollbar py-1 min-w-0 whitespace-nowrap">
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
              <span className="font-black text-sky-700 bg-sky-50 px-3 py-1 rounded-lg border border-sky-100 shrink-0 truncate max-w-[200px]">
                {subcategoryInfo?.name}
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-black text-emerald-700">
              {filteredAndSortedProducts.length} منتج متاح
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* 2. Enhanced Toolbar - شريط الأدوات العائم */}
        <div className="mb-12 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-4 md:p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
            
            <div className="flex flex-col lg:flex-row gap-6 items-center relative z-10">
              {/* البحث الذكي */}
              <div className="relative w-full lg:flex-1 group">
                <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={22} />
                <input 
                  type="text" 
                  placeholder={`البحث في منتجات ${subcategoryInfo?.name}...`}
                  className="w-full pr-14 pl-6 py-4 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-sky-500 rounded-2xl outline-none transition-all text-base font-bold shadow-inner"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                   <button onClick={() => setSearchQuery("")} className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-slate-200 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors">
                      <X size={16} />
                   </button>
                )}
              </div>

              {/* الفلاتر والترتيب */}
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <div className="flex items-center gap-3 bg-slate-100 p-2 rounded-2xl flex-1 md:flex-none">
                  <div className="p-2 bg-white rounded-xl shadow-sm text-slate-500">
                    <ArrowUpDown size={18} />
                  </div>
                  <select 
                    className="bg-transparent text-sm font-black text-slate-700 outline-none cursor-pointer pl-4"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="default">رتب حسب الاسم</option>
                    <option value="name-asc">تصاعدي (أ - ي)</option>
                    <option value="name-desc">تنازلي (ي - أ)</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 bg-slate-100 p-2 rounded-2xl flex-1 md:flex-none">
                  <div className="p-2 bg-white rounded-xl shadow-sm text-slate-500">
                    <Filter size={18} />
                  </div>
                  <select 
                    className="bg-transparent text-sm font-black text-slate-700 outline-none cursor-pointer pl-4"
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                  >
                    <option value="all">كل العلامات التجارية</option>
                    {brands.map((b, i) => <option key={i} value={b.name}>{b.name}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-4">
             <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <LayoutGrid size={24} className="text-sky-600" />
                منتجات <span className="text-sky-600">{subcategoryInfo?.name}</span>
             </h2>
             <span className="text-slate-400 text-sm font-bold">عرض {filteredAndSortedProducts.length} من أصل {products.length}</span>
          </div>
        </div>

        {/* 3. Products Grid - شبكة عرض المنتجات المحسنة */}
        <AnimatePresence mode="popLayout">
          {filteredAndSortedProducts.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 md:gap-8"
            >
              {filteredAndSortedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link 
                    href={`/product/${product.id}`} 
                    className="group bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden hover:border-sky-400 hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-500 flex flex-col relative"
                  >
                    {/* وسم العلامة التجارية */}
                    {product.brand && (
                      <div className="absolute top-4 left-4 z-10">
                        <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-slate-600 uppercase border border-slate-100 shadow-sm">
                          {product.brand}
                        </span>
                      </div>
                    )}

                    {/* منطقة الصورة المحسنة */}
                    <div className="relative aspect-square bg-slate-50 flex items-center justify-center p-6 overflow-hidden">
                      <Image 
                        src={product.image || '/placeholder.jpg'} 
                        alt={product.name} 
                        fill 
                        className="object-contain p-4 group-hover:scale-110 transition-transform duration-700" 
                        sizes="(max-width: 768px) 50vw, 20vw"
                      />
                      <div className="absolute inset-0 bg-sky-900/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>

                    {/* تفاصيل المنتج */}
                    <div className="p-6 flex flex-col flex-grow bg-white border-t border-slate-50">
                      <h3 className="text-sm md:text-base font-black text-slate-800 line-clamp-2 leading-snug group-hover:text-sky-600 transition-colors h-12 mb-4">
                        {product.name}
                      </h3>
                      
                      <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sky-600 font-black text-xs uppercase tracking-tighter">
                           <span>التفاصيل</span>
                           <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        </div>
                        <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-sky-500 group-hover:text-white transition-all">
                           <ExternalLink size={16} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-slate-200 px-6 overflow-hidden relative"
            >
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                 <PackageSearch size={400} className="mx-auto mt-10" />
              </div>
              <div className="bg-slate-50 w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner relative z-10">
                <PackageSearch size={54} className="text-slate-300" />
              </div>
              <h3 className="text-3xl font-black text-slate-800 relative z-10">لا توجد منتجات مطابقة لبحثك</h3>
              <p className="text-slate-500 mt-4 text-lg font-bold relative z-10">جرب تغيير كلمات البحث أو تصفية علامة تجارية أخرى.</p>
              <button 
                onClick={() => {setSearchQuery(""); setSelectedBrand("all");}} 
                className="mt-10 bg-slate-900 text-white px-12 py-5 rounded-[2rem] font-black text-lg hover:bg-sky-600 transition-all shadow-2xl active:scale-95 relative z-10"
              >
                إعادة ضبط البحث
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      
    </div>
  );
}