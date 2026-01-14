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
  const [products] = useState<Product[]>(initialProducts);
  const [brands] = useState<Brand[]>(initialBrands);

  // حالات التحكم (تم تغيير الترتيب الافتراضي ليكون أ-ي)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [sortBy, setSortBy] = useState("name-asc");

  /**
   * Schema.org Data
   */
  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `منتجات ${subcategoryInfo?.name} - أبار جروب`,
    "description": `تصفح أفضل موديلات ${subcategoryInfo?.name} المخصصة لحفر وصيانة آبار المياه في مصر.`,
    "itemListElement": products.map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": `https://abaargroup.org/product/${p.id}`,
      "name": p.name
    }))
  }), [products, subcategoryInfo]);

  /**
   * منطق الفلترة والترتيب (بدون تأخير)
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
    <div className="bg-[#fcfcfd] min-h-screen font-arabic text-right pb-20 overflow-x-hidden" dir="rtl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      {/* 1. Navigation & Breadcrumbs (تصميم أنيق وموفر للمساحة) */}
      <nav className=" relative bg-white/80 backdrop-blur-md border-b border-slate-100 mt-20  top-0 z-[100] transition-all">
        <div className="max-w-7xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden min-w-0">
            <button 
              onClick={() => router.back()}
              className="p-2 rounded-lg bg-slate-50 text-slate-600 hover:bg-sky-600 hover:text-white transition-all shrink-0"
            >
              <ArrowRight size={18} />
            </button>

            <div className="flex items-center gap-1.5 text-[11px] md:text-sm overflow-x-auto scrollbar-hide whitespace-nowrap py-1">
              <Link href="/" className="font-bold text-slate-400 hover:text-sky-600">الرئيسية</Link>
              <ChevronLeft size={12} className="text-slate-300" />
              <Link href="/store" className="font-bold text-slate-400 hover:text-sky-600">المتجر</Link>
              {subcategoryInfo?.parent_name && (
                <>
                  <ChevronLeft size={12} className="text-slate-300" />
                  <Link href={`/store/${subcategoryInfo.parent_id}`} className="font-bold text-slate-400 hover:text-sky-600 truncate max-w-[100px]">
                    {subcategoryInfo.parent_name}
                  </Link>
                </>
              )}
              <ChevronLeft size={12} className="text-slate-300" />
              <h1 className="font-black text-sky-700 truncate">{subcategoryInfo?.name}</h1>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
            <span className="text-[10px] font-black text-emerald-700">توفّر فوري: {filteredAndSortedProducts.length} طراز</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* 2. Toolbar & Filter Section */}
        <div className="mb-10">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 md:p-6 mb-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="relative w-full lg:flex-1">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder={`ابحث عن موديل محدد في ${subcategoryInfo?.name}...`}
                  className="w-full pr-11 pl-4 py-3.5 bg-slate-50 border border-transparent focus:bg-white focus:border-sky-500 rounded-2xl outline-none transition-all text-sm md:text-base font-bold"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Selectors */}
              <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100 flex-1 md:flex-none">
                  <Filter size={16} className="text-slate-400 mr-2" />
                  <select 
                    className="bg-transparent text-xs font-black text-slate-700 outline-none cursor-pointer py-2 min-w-[100px]"
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

          {/* Active Filter Tags */}
          {(selectedBrand !== "all" || searchQuery !== "") && (
            <div className="flex flex-wrap gap-2 px-2 animate-in fade-in slide-in-from-top-1">
              {selectedBrand !== "all" && (
                <button onClick={() => setSelectedBrand("all")} className="flex items-center gap-2 bg-sky-100 text-sky-700 px-3 py-1.5 rounded-full text-[10px] font-black hover:bg-sky-200 transition-colors">
                  الماركة: {selectedBrand} <X size={12} />
                </button>
              )}
              {searchQuery !== "" && (
                <button onClick={() => setSearchQuery("")} className="flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-[10px] font-black hover:bg-slate-200 transition-colors">
                  بحث: {searchQuery} <X size={12} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* 3. Products Grid - تحسين ظهور الصور وحجمها */}
        <AnimatePresence mode="wait">
          {filteredAndSortedProducts.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8"
            >
              {filteredAndSortedProducts.map((product, index) => (
                <motion.article
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="group"
                >
                  <Link 
                    href={`/product/${product.id}`} 
                    className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden hover:border-sky-300 hover:shadow-xl transition-all duration-300 flex flex-col h-full relative"
                  >
                    {/* الحاوية المعدلة للصورة - زيادة الوضوح وتقليل الـ Padding */}
                    <div className="relative aspect-square bg-white flex items-center justify-center p-3 md:p-4 border-b border-slate-50 overflow-hidden">
                      <Image 
                        src={product.image || '/placeholder.jpg'} 
                        alt={product.name} 
                        fill 
                        className="object-contain p-2 group-hover:scale-110 transition-transform duration-500" 
                        sizes="(max-width: 768px) 50vw, 20vw"
                        priority={index < 4}
                      />
                      {/* Brand Label Overlay */}
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm border border-slate-100 px-2 py-1 rounded-lg text-[8px] font-black text-slate-400 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        {product.brand || 'Premium'}
                      </div>
                    </div>

                    <div className="p-4 flex flex-col flex-grow text-center lg:text-right">
                      <h3 className="text-[12px] md:text-[14px] font-black text-slate-800 line-clamp-2 leading-snug group-hover:text-sky-600 transition-colors min-h-[2.5rem] mb-4">
                        {product.name}
                      </h3>
                      
                      <div className="mt-auto flex items-center justify-center lg:justify-between text-sky-600 font-black text-[10px] md:text-[11px] uppercase tracking-tighter">
                         <span className="hidden lg:block">التفاصيل الفنية</span>
                         <div className="bg-sky-50 p-2 rounded-full group-hover:bg-sky-600 group-hover:text-white transition-all">
                            <ArrowLeft size={16} />
                         </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-100">
                <PackageSearch size={48} className="text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-black text-slate-800">لا توجد نتائج</h3>
                <p className="text-slate-400 text-sm mt-2">جرب تغيير كلمات البحث أو الفلتر المختار.</p>
                <button onClick={() => {setSearchQuery(""); setSelectedBrand("all");}} className="mt-6 text-sky-600 font-black text-sm underline">عرض كل الموديلات</button>
            </div>
          )}
        </AnimatePresence>

        {/* 4. SEO Section (تحسين المحتوى لرفع ترتيب الصفحة) */}
        <section className="mt-24 md:mt-32 border-t border-slate-100 pt-16 md:pt-24">
            <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
                <div className="space-y-6 md:space-y-8">
                    <h2 className="text-2xl md:text-4xl font-black text-slate-900 leading-tight">
                        توريد وتجهيز <span className="text-emerald-600">{subcategoryInfo?.name}</span> <br className="hidden md:block" /> بمواصفات هندسية دقيقة
                    </h2>
                    <div className="space-y-4 text-slate-600 text-sm md:text-lg leading-relaxed font-medium">
                        <p>
                            تعتبر <strong>أبار جروب</strong> المورد المعتمد لأفضل موديلات {subcategoryInfo?.name} في مصر. نحن لا نوفر مجرد منتجات، بل نقدم حلولاً  متكاملة تضمن لك كفاءة عالية في <strong>حفر الآبار</strong> واستدامتها.
                        </p>
                        <p>
                            كافة الموديلات المعروضة تخضع لاختبارات جودة صارمة لتناسب احتياجات <strong>صيانة الآبار</strong> في الأراضي الصحراوية، مع توافق تام مع أنظمة <strong>الطاقة الشمسية</strong> لتوفير تكاليف التشغيل.
                        </p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                          { icon: ShieldCheck, text: "ضمان أبار", color: "text-emerald-500" },
                          { icon: Truck, text: "توصيل سريع", color: "text-sky-500" },
                          { icon: Wrench, text: "دعم متخصص", color: "text-amber-500" }
                        ].map((item, i) => (
                          <div key={i} className="flex flex-col items-center p-4 bg-white rounded-2xl border border-slate-50 shadow-sm">
                              <item.icon className={item.color} size={24} />
                              <span className="font-black text-[9px] md:text-[11px] text-slate-800 mt-2">{item.text}</span>
                          </div>
                        ))}
                    </div>
                </div>
                <div className="relative">
                    <div className="absolute inset-0 bg-sky-500 rounded-[3rem] rotate-2 opacity-10"></div>
                    <div className="relative aspect-video rounded-[3rem] overflow-hidden shadow-2xl border-4 md:border-8 border-white group">
                        <Image 
                           src="/image/hint.jpeg" 
                           alt={`توريد مستلزمات ${subcategoryInfo?.name}`} 
                           fill 
                           className="object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                    </div>
                </div>
            </div>
        </section>

        {/* 5. Quick Support Footer */}
        <section className="mt-20">
            <div className="bg-slate-900 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-64 h-64 bg-sky-500/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
                <div className="relative z-10 text-center md:text-right">
                    <h5 className="text-2xl md:text-3xl font-black mb-4">هل تبحث عن قياسات مخصصة؟</h5>
                    <p className="text-slate-400 text-sm md:text-lg max-w-xl font-bold">
                        يمكن لمهندسينا توفير <strong>طلمبات مياه</strong> ومستلزمات بمواصفات خاصة غير مدرجة في الموقع. تواصل معنا الآن.
                    </p>
                </div>
                <a 
                  href="https://wa.me/201211110240" 
                  target="_blank"
                  className="relative z-10 flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white px-8 md:px-12 py-4 md:py-6 rounded-2xl md:rounded-[2rem] font-black text-base md:text-xl transition-all shadow-xl active:scale-95 w-full md:w-auto"
                >
                  تحدث مع الدعم الفني <ArrowLeft size={20} />
                </a>
            </div>
        </section>
      </main>
      
      {/* Floating Cart Button (Standard UX) */}
      <div className="fixed bottom-6 right-6 z-[150] md:hidden">
          <Link href="/cart" className="w-14 h-14 bg-sky-600 text-white rounded-full flex items-center justify-center shadow-2xl border-2 border-white">
            <ShoppingCart size={24} />
          </Link>
      </div>
    </div>
  );
}