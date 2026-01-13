'use client';

import React, { useState, useEffect } from "react";
import { supabase } from '@/lib/supabase';
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from 'react-markdown';
import { 
  ShoppingBag, Tag, Minus, Plus, Home, ChevronRight, ZoomIn, 
  X, ArrowRight, Share2, Settings, FileText, Shuffle, 
  ShoppingCart as CartIcon 
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import ShoppingCart from '@/components/shoppingcart';

/**
 * تعريف واجهات البيانات (Interfaces) لضمان توافق TypeScript
 */
interface ProductContentProps {
  product: any; // البيانات القادمة من السيرفر كحالة أولية
  params: { id: string };
}

interface HierarchyStep {
  name: string;
  url: string;
}

/**
 * دالة المساعدة لخلط مصفوفة المنتجات ذات الصلة
 */
function shuffleArray(array: any[]) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

export default function ProductContent({ product: initialProduct, params }: ProductContentProps) {
  // تعريف الحالات (States)
  const [product, setProduct] = useState<any>(initialProduct);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(!initialProduct);
  const [activeTab, setActiveTab] = useState<'specs' | 'description'>('specs'); 
  const [quantity, setQuantity] = useState(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  const router = useRouter();
  const { addToCart } = useCart();

  /**
   * جلب بيانات المنتج والمنتجات ذات الصلة عند تحميل الصفحة
   */
  useEffect(() => {
    const fetchProductData = async () => {
      if (!initialProduct) setIsLoading(true);
      try {
        // جلب بيانات المنتج الرئيسي
        const { data: mainProduct, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setProduct(mainProduct);

        // جلب عينة من المنتجات الأخرى للعرض في قسم "اختيارات قد تعجبك"
        const { data: allProducts } = await supabase
          .from('products')
          .select('id, name, image')
          .neq('id', params.id)
          .limit(30); 
          
        if (allProducts) {
          const shuffled = shuffleArray([...allProducts]);
          setRelatedProducts(shuffled.slice(0, 10)); 
        }
      } catch (err) { 
        console.error("Error fetching product data:", err); 
      } finally { 
        setIsLoading(false); 
      }
    };

    fetchProductData();
  }, [params.id, initialProduct]);

  /**
   * تأثير جانبي للتحكم في تمرير الصفحة (Scroll Lock)
   * يتم تفعيله عند فتح معاينة الصورة الكبيرة (Lightbox)
   */
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isLightboxOpen]);

  // حالة جاري التحميل
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center animate-pulse font-arabic text-sky-600 font-bold text-xl">
      جاري التحميل...
    </div>
  );

  // حالة المنتج غير موجود
  if (!product) return (
    <div className="p-20 text-center font-arabic text-xl font-bold">
      المنتج غير موجود أو تعذر جلب البيانات.
    </div>
  );

  /**
   * بناء مسار التنقل (Breadcrumbs)
   */
  const breadcrumbs: HierarchyStep[] = product.hierarchy || [
    { name: "المتجر", url: "/store" },
    ...(product.category_parent_name ? [{ name: product.category_parent_name, url: `/store/category/${product.category_parent_id}` }] : []),
    ...(product.category_name ? [{ name: product.category_name, url: `/store/category/${product.category_id}` }] : []),
  ];

  return (
    <main className="bg-slate-100 min-h-screen font-arabic text-right" dir="rtl">
      <Toaster position="bottom-center" />
      
      {/* نمط الخلفية الشبكي */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center pointer-events-none opacity-40"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 pt-8 sm:px-6 lg:px-8 z-10">
        
        {/* شريط التحكم العلوي والمسار */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 font-bold rounded-2xl shadow-sm border hover:bg-sky-50 transition-all group"
          >
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            <span>رجوع</span>
          </button>

          <nav className="flex items-center gap-2 text-sm font-bold text-slate-500 bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-sm border flex-grow sm:flex-grow-0 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-sky-600 transition-colors flex-shrink-0">
              <Home size={16} />
            </Link>
            
            <ChevronRight size={14} className="rtl:rotate-180 text-slate-300 flex-shrink-0" />
            
            {breadcrumbs.map((step: HierarchyStep, index: number) => (
              <React.Fragment key={index}>
                <Link href={step.url} className="hover:text-sky-600 transition-colors">
                  {step.name}
                </Link>
                <ChevronRight size={14} className="rtl:rotate-180 text-slate-300 flex-shrink-0" />
              </React.Fragment>
            ))}

            <span className="text-sky-700 line-clamp-1">{product.name}</span>
          </nav>
        </div>

        {/* كارت المنتج الرئيسي - يستخدم overflow-visible لضمان عمل الـ Sticky */}
        <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 grid grid-cols-1 lg:grid-cols-12 overflow-visible">
          
          {/* قسم الصورة - Sticky (يتحرك داخل إطاره فقط) */}
          <div className="lg:col-span-5 bg-slate-50 relative p-8 lg:p-12 flex flex-col items-center rounded-r-[3rem]">
            <div 
              className="sticky top-24 w-full aspect-square rounded-[2rem] overflow-hidden bg-white shadow-lg border border-slate-200 group cursor-zoom-in transition-all duration-300" 
              onClick={() => setIsLightboxOpen(true)}
            >
              <Image 
                src={product.image || '/placeholder.jpg'} 
                alt={product.name} 
                fill 
                className="object-contain transition-all duration-500 group-hover:scale-105" 
                style={{ objectPosition: 'center 10%', padding: '30px' }} 
              />
              <div className="absolute bottom-4 left-4 bg-slate-900/80 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn size={20} />
              </div>
              
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase shadow-md z-10">
                {product.brand || 'ORIGINAL'}
              </div>
            </div>
          </div>

          {/* قسم التفاصيل والبيانات الفنية */}
          <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col bg-white rounded-l-[3rem]">
            <div className="flex justify-between items-start gap-4 mb-6">
              <h1 className="text-3xl lg:text-4xl font-black text-slate-900 leading-tight">{product.name}</h1>
              <button 
                onClick={() => { 
                  navigator.clipboard.writeText(window.location.href); 
                  toast.success("تم نسخ الرابط"); 
                }} 
                className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-sky-600 transition-all shadow-sm"
              >
                <Share2 size={22} />
              </button>
            </div>

            {/* نظام التبويبات (Tabs) */}
            <div className="flex p-1 bg-slate-100 rounded-2xl mb-8 w-fit">
              <button 
                onClick={() => setActiveTab('specs')} 
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'specs' ? 'bg-white text-sky-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Settings size={18} /> المواصفات
              </button>
              <button 
                onClick={() => setActiveTab('description')} 
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'description' ? 'bg-white text-sky-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <FileText size={18} /> الوصف
              </button>
            </div>

            {/* محتوى التبويب المختار */}
            <div className="flex-grow min-h-[250px]">
              {activeTab === 'specs' ? (
                product.attributes ? (
                  <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    {Object.entries(product.attributes).map(([key, value], index) => (
                      <div key={key} className={`flex justify-between p-4 ${index % 2 === 0 ? 'bg-slate-50' : 'bg-white'} border-b border-slate-100 last:border-0`}>
                        <span className="font-bold text-slate-600 flex items-center gap-2 font-arabic">
                          <span className="w-2 h-2 bg-sky-500 rounded-full inline-block"></span> {key}
                        </span>
                        <span className="font-black text-slate-900">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                ) : <div className="text-center py-10 text-slate-400 font-arabic border-2 border-dashed rounded-2xl">لا توجد مواصفات فنية متاحة لهذا المنتج حالياً.</div>
              ) : (
                <div className="prose prose-slate max-w-none bg-slate-50 p-6 rounded-2xl border border-slate-100 font-arabic leading-relaxed">
                  <ReactMarkdown>{product.Description || 'لا يوجد وصف متاح حالياً لهذا المنتج.'}</ReactMarkdown>
                </div>
              )}
            </div>

            {/* أزرار الإجراءات (Actions) */}
            <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col sm:flex-row gap-4 font-arabic">
              <button 
                onClick={() => { addToCart(product, quantity); toast.success("تم الإضافة للسلة"); }} 
                className="flex-grow bg-slate-900 text-white rounded-2xl h-14 font-black text-lg flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-lg active:scale-95"
              >
                <ShoppingBag size={22} /> إضافة للسلة
              </button>
            </div>
            
            <button 
              onClick={() => window.open(`https://wa.me/201211110240?text=استفسار فني عن منتج: ${product.name}`, '_blank')} 
              className="mt-4 w-full border-2 border-black text-slate-900 rounded-2xl h-14 font-bold text-lg flex items-center justify-center gap-2 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all font-arabic"
            >
              <Tag size={22} /> استفسار فني • عرض سعر
            </button>
          </div>
        </div>

        {/* قسم المنتجات المقترحة (Related Products) */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 mb-16 overflow-hidden">
            <div className="flex items-center gap-3 mb-10 px-4">
              <div className="bg-sky-100 p-3 rounded-xl text-sky-600"><Shuffle size={24} /></div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 font-arabic">اختيارات قد تعجبك</h2>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-8 pt-2 px-4 scrollbar-hide snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {relatedProducts.map((item) => (
                <Link key={item.id} href={`/product/${item.id}`} className="group bg-white p-5 rounded-[2.5rem] border shadow-sm hover:shadow-xl transition-all min-w-[280px] flex-shrink-0 snap-start">
                  <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-slate-50 mb-4 border border-slate-50">
                    <Image src={item.image || '/placeholder.jpg'} alt={item.name} fill className="object-contain p-4 group-hover:scale-110 transition-all" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg group-hover:text-sky-600 transition-colors line-clamp-2 min-h-[3.5rem] flex items-center justify-center px-2 font-arabic text-center leading-snug">{item.name}</h3>
                  <div className="flex justify-center">
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-black text-sky-500 bg-sky-50 px-4 py-2 rounded-full group-hover:bg-sky-600 group-hover:text-white transition-all font-arabic">
                      عرض التفاصيل <ArrowRight size={16} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* نافذة معاينة الصورة الكبيرة (Lightbox Modal) */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4 backdrop-blur-md cursor-zoom-out"
            onClick={() => setIsLightboxOpen(false)} // الإغلاق عند الضغط خارجاً
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl h-full max-h-[85vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()} // منع الإغلاق عند الضغط على الصورة نفسها
            >
              <button 
                onClick={() => setIsLightboxOpen(false)} 
                className="absolute -top-14 left-0 md:left-auto md:-right-10 text-white flex items-center gap-2 font-bold hover:text-emerald-400 transition-colors z-[210] p-2"
              >
                <span className="hidden md:inline">إغلاق المعاينة</span> <X size={40} />
              </button>

              <div className="relative w-full h-full shadow-2xl rounded-3xl overflow-hidden border border-white/10">
                <Image 
                  src={product.image || '/placeholder.jpg'}
                  alt={product.name}
                  fill
                  className="object-contain rounded-2xl animate-in zoom-in duration-500"
                  quality={100}
                  priority
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ShoppingCart />
    </main>
  );
}