'use client';

import React, { useState, useEffect, useMemo } from "react";
import { supabase } from '@/lib/supabase';
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from 'react-markdown';
import { 
  ShoppingBag, Tag, Minus, ArrowLeft, Home, ChevronRight, ZoomIn, 
  X, ArrowRight, Share2, Settings, FileText, Shuffle, 
  ShoppingCart as CartIcon, ShieldCheck, Wrench, Truck, Info
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import ShoppingCart from '@/components/shoppingcart';

/**
 * الواجهات البرمجية (Interfaces)
 */
interface ProductContentProps {
  product: any;
  params: { id: string };
}

interface HierarchyStep {
  name: string;
  url: string;
}

/**
 * دالة المساعدة لخلط المنتجات ذات الصلة
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
  const [product, setProduct] = useState<any>(initialProduct);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(!initialProduct);
  const [activeTab, setActiveTab] = useState<'specs' | 'description' | 'guide'>('specs'); 
  const [quantity, setQuantity] = useState(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  const router = useRouter();
  const { addToCart } = useCart();

  /**
   * جلب بيانات المنتج والمنتجات ذات الصلة
   */
  useEffect(() => {
    const fetchProductData = async () => {
      if (!initialProduct) setIsLoading(true);
      try {
        const { data: mainProduct, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setProduct(mainProduct);

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
   * قفل التمرير عند فتح Lightbox
   */
  useEffect(() => {
    document.body.style.overflow = isLightboxOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isLightboxOpen]);

  // بناء بيانات Schema.org للمنتج (ضروري جداً للسيو)
  const productSchema = useMemo(() => ({
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product?.name,
    "image": product?.image,
    "description": product?.Description?.substring(0, 160),
    "brand": {
      "@type": "Brand",
      "name": product?.brand || "أبار جروب"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://abaargroup.org/product/${product?.id}`,
      "priceCurrency": "EGP",
      "availability": "https://schema.org/InStock"
    }
  }), [product]);

  if (isLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="w-16 h-16 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mb-4"></div>
      <p className="font-black text-sky-900 animate-pulse text-xl">جاري تحميل بيانات المنتج...</p>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center">
      <h2 className="text-2xl font-black text-slate-800 mb-4">عذراً، المنتج غير متاح حالياً</h2>
      <Link href="/store" className="text-sky-600 font-bold underline">العودة للمتجر</Link>
    </div>
  );

  const breadcrumbs: HierarchyStep[] = product.hierarchy || [
    { name: "المتجر", url: "/store" },
    ...(product.category_parent_name ? [{ name: product.category_parent_name, url: `/store/category/${product.category_parent_id}` }] : []),
    ...(product.category_name ? [{ name: product.category_name, url: `/store/category/${product.category_id}` }] : []),
  ];

  return (
    <main className="bg-slate-100 min-h-screen font-arabic text-right pb-20" dir="rtl">
      <Toaster position="bottom-center" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      
      {/* نمط الخلفية الشبكي */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center pointer-events-none opacity-20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 pt-8 sm:px-6 lg:px-8 z-10">
        
        {/* شريط التحكم العلوي والمسار */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 font-bold rounded-2xl shadow-sm border border-slate-200 hover:bg-sky-50 transition-all group"
          >
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            <span>رجوع للمتجر</span>
          </button>

          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm font-bold text-slate-500 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl shadow-sm border border-white flex-grow sm:flex-grow-0 overflow-x-auto">
            <Link href="/" className="hover:text-sky-600 transition-colors flex-shrink-0"><Home size={16} /></Link>
            <ChevronRight size={14} className="rtl:rotate-180 text-slate-300 flex-shrink-0" />
            {breadcrumbs.map((step: HierarchyStep, index: number) => (
              <React.Fragment key={index}>
                <Link href={step.url.replace('.com', '.org')} className="hover:text-sky-600 transition-colors">{step.name}</Link>
                <ChevronRight size={14} className="rtl:rotate-180 text-slate-300 flex-shrink-0" />
              </React.Fragment>
            ))}
            <span className="text-sky-700 line-clamp-1">{product.name}</span>
          </nav>
        </div>

        {/* كارت المنتج الرئيسي */}
        <div className="bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 grid grid-cols-1 lg:grid-cols-12 overflow-visible mb-12">
          
          {/* قسم الصورة - Sticky */}
          <div className="lg:col-span-5 bg-slate-50 relative p-8 lg:p-14 flex flex-col items-center rounded-t-[3.5rem] lg:rounded-r-[3.5rem] lg:rounded-tl-none border-l border-slate-100">
            <div 
              className="sticky top-28 w-full aspect-square rounded-[3rem] overflow-hidden bg-white shadow-xl border border-slate-200 group cursor-zoom-in transition-all duration-500 hover:shadow-2xl" 
              onClick={() => setIsLightboxOpen(true)}
            >
              <Image 
                src={product.image || '/placeholder.jpg'} 
                alt={`${product.name} - توريد وتجهيز آبار المياه بأحدث المعدات`} 
                fill 
                className="object-contain transition-all duration-700 group-hover:scale-110" 
                style={{ objectPosition: 'center', padding: '40px' }} 
                priority
              />
              <div className="absolute bottom-6 left-6 bg-slate-900/90 text-white p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                <ZoomIn size={24} />
              </div>
              <div className="absolute top-6 left-6 bg-emerald-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase shadow-lg">
                {product.brand || 'منتج أصلي معتمد'}
              </div>
            </div>
          </div>

          {/* قسم التفاصيل والبيانات الفنية */}
          <div className="lg:col-span-7 p-8 lg:p-16 flex flex-col bg-white rounded-b-[3.5rem] lg:rounded-l-[3.5rem] lg:rounded-br-none">
            <div className="flex justify-between items-start gap-4 mb-8">
              <div>
                <h1 className="text-3xl lg:text-5xl font-black text-slate-900 leading-tight mb-4">{product.name}</h1>
                <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  <span>ضمان الجودة من أبار جروب</span>
                </div>
              </div>
              <button 
                onClick={() => { 
                  navigator.clipboard.writeText(window.location.href); 
                  toast.success("تم نسخ رابط المنتج بنجاح"); 
                }} 
                className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:text-sky-600 transition-all shadow-sm border border-slate-100"
                aria-label="Share Product"
              >
                <Share2 size={24} />
              </button>
            </div>

            {/* نظام التبويبات المطور */}
            <div className="flex p-1.5 bg-slate-100 rounded-[1.5rem] mb-10 w-fit">
              {[
                { id: 'specs', label: 'المواصفات الفنية', icon: Settings },
                { id: 'description', label: 'شرح المنتج', icon: FileText },
                { id: 'guide', label: 'دليل الاستخدام', icon: Info },
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)} 
                  className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black text-sm transition-all ${activeTab === tab.id ? 'bg-white text-sky-600 shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  <tab.icon size={18} /> {tab.label}
                </button>
              ))}
            </div>

            {/* محتوى التبويب المختار */}
            <div className="flex-grow min-h-[300px]">
              <AnimatePresence mode="wait">
                {activeTab === 'specs' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm bg-slate-50/30"
                  >
                    {product.attributes ? Object.entries(product.attributes).map(([key, value], index) => (
                      <div key={key} className={`flex justify-between p-5 ${index % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'} border-b border-slate-100 last:border-0`}>
                        <span className="font-bold text-slate-600 flex items-center gap-3">
                          <div className="w-1.5 h-1.5 bg-sky-500 rounded-full"></div> {key}
                        </span>
                        <span className="font-black text-slate-900">{String(value)}</span>
                      </div>
                    )) : (
                      <div className="text-center py-16 text-slate-400 font-bold italic">لا توجد مواصفات فنية مسجلة حالياً.</div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'description' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="prose prose-slate max-w-none bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 leading-[2.2] text-lg text-slate-700 font-medium"
                  >
                    <ReactMarkdown>{product.Description || 'يتوفر قريباً شرح تفصيلي لكافة مميزات واستخدامات هذا المنتج.'}</ReactMarkdown>
                  </motion.div>
                )}

                {activeTab === 'guide' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="bg-sky-50 p-10 rounded-[2.5rem] border border-sky-100"
                  >
                    <h4 className="text-sky-900 font-black mb-6 flex items-center gap-2">
                       <Wrench size={20} /> نصائح فنية من خبراء أبار جروب:
                    </h4>
                    <ul className="space-y-4 text-sky-800 font-bold leading-relaxed list-disc list-inside">
                      <li>تأكد من مطابقة المنتج لقطر البئر ونوع ملوحة المياه.</li>
                      <li>يفضل التركيب بواسطة فني متخصص لضمان عدم خروج المنتج من الضمان.</li>
                      <li>للحصول على أداء مثالي، نوصي باستخدام كابلات أصلية مع طلمبات الأعماق.</li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* أزرار الإجراءات */}
            <div className="mt-12 pt-10 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <button 
                onClick={() => { addToCart(product, quantity); toast.success("تمت الإضافة لسلة المشتريات"); }} 
                className="bg-slate-900 text-white rounded-3xl h-16 font-black text-xl flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-xl active:scale-95"
              >
                <ShoppingBag size={24} /> إضافة للسلة
              </button>
              
              <button 
                onClick={() => window.open(`https://wa.me/201211110240?text=استفسار فني بخصوص: ${product.name}`, '_blank')} 
                className="border-3 border-slate-900 text-slate-900 rounded-3xl h-16 font-black text-lg flex items-center justify-center gap-3 hover:bg-slate-900 hover:text-white transition-all"
              >
                <Tag size={24} /> استشارة فنية فورية
              </button>
            </div>
          </div>
        </div>

        {/* سكشن المحتوى الجديد لزيادة الكلمات (SEO Expansion) */}
        
        <section className="bg-white rounded-[3.5rem] p-10 lg:p-20 shadow-xl mb-16 border border-slate-50">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">لماذا تشتري مستلزمات الآبار من أبار جروب؟</h2>
            <div className="w-24 h-1.5 bg-emerald-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-12 text-center lg:text-right">
            <div>
              <Truck className="w-12 h-12 text-sky-600 mx-auto lg:mr-0 mb-6" />
              <h4 className="text-xl font-black mb-4">توريد سريع لكافة المحافظات</h4>
              <p className="text-slate-600 leading-relaxed font-bold">نلتزم بـ <strong>توريد طلمبات المياه</strong> وكافة المستلزمات إلى موقع مشروعك في وقت قياسي لضمان عدم توقف العمل.</p>
            </div>
            <div>
              <Settings className="w-12 h-12 text-emerald-600 mx-auto lg:mr-0 mb-6" />
              <h4 className="text-xl font-black mb-4">دعم فني متخصص في الصيانة</h4>
              <p className="text-slate-600 leading-relaxed font-bold">لا نقدم مجرد منتجات، بل نوفر خبرتنا في <strong>صيانة الآبار</strong> لمساعدتك في اختيار القطعة الأنسب لظروف بئرك المحددة.</p>
            </div>
            <div>
              <ShieldCheck className="w-12 h-12 text-amber-500 mx-auto lg:mr-0 mb-6" />
              <h4 className="text-xl font-black mb-4">ضمان حقيقي وقطع غيار أصلية</h4>
              <p className="text-slate-600 leading-relaxed font-bold">كل ما نوفره من <strong>مستلزمات آبار</strong> وطاقة شمسية يأتي مع ضمان رسمي وقطع غيار أصلية تضمن لك العمر الطويل.</p>
            </div>
          </div>
        </section>

        {/* قسم المنتجات المقترحة */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 mb-16 overflow-hidden">
            <div className="flex items-center gap-4 mb-12 px-4">
              <div className="bg-sky-100 p-4 rounded-2xl text-sky-600 shadow-inner"><Shuffle size={28} /></div>
              <h2 className="text-2xl md:text-4xl font-black text-slate-900 font-arabic">منتجات قد تهمك في مشروعك القادم</h2>
            </div>
            <div className="flex gap-8 overflow-x-auto pb-10 pt-2 px-4 scrollbar-hide snap-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {relatedProducts.map((item) => (
                <Link key={item.id} href={`/product/${item.id}`} className="group bg-white p-6 rounded-[3rem] border border-slate-100 shadow-lg hover:shadow-2xl transition-all min-w-[300px] flex-shrink-0 snap-start">
                  <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-slate-50 mb-6 border border-slate-50">
                    <Image src={item.image || '/placeholder.jpg'} alt={`${item.name} من شركة أبار جروب`} fill className="object-contain p-6 group-hover:scale-110 transition-all duration-700" />
                  </div>
                  <h3 className="font-black text-slate-800 text-lg group-hover:text-sky-600 transition-colors line-clamp-2 min-h-[3.5rem] flex items-center justify-center px-2 text-center leading-relaxed">{item.name}</h3>
                  <div className="flex justify-center mt-6">
                    <span className="inline-flex items-center gap-2 text-sm font-black text-white bg-slate-900 px-6 py-3 rounded-2xl group-hover:bg-emerald-600 transition-all">
                      عرض المنتج <ArrowLeft size={18} className="rotate-180 transition-transform group-hover:-translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* نافذة Lightbox المحدثة */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/98 z-[200] flex items-center justify-center p-6 backdrop-blur-xl cursor-zoom-out"
            onClick={() => setIsLightboxOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-6xl h-full max-h-[85vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setIsLightboxOpen(false)} 
                className="absolute -top-16 right-0 text-white flex items-center gap-3 font-black hover:text-emerald-400 transition-colors z-[210] p-3 group"
              >
                <span>إغلاق المعاينة</span> <X size={44} className="group-hover:rotate-90 transition-transform" />
              </button>
              <div className="relative w-full h-full shadow-2xl rounded-3xl overflow-hidden bg-white/5 border border-white/10">
                <Image src={product.image || '/placeholder.jpg'} alt={product.name} fill className="object-contain p-4" quality={100} priority />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ShoppingCart />
    </main>
  );
}