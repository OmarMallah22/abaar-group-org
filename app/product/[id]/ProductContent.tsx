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

  // بناء بيانات Schema.org للمنتج
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
    <main className="bg-slate-100 min-h-screen font-arabic text-right pb-20 overflow-x-hidden" dir="rtl">
      <Toaster position="bottom-center" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      
      {/* نمط الخلفية الشبكي */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center pointer-events-none opacity-20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 pt-6 sm:px-6 lg:px-8 z-10">
        
        {/* شريط التحكم العلوي والمسار */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-700 font-bold rounded-xl shadow-sm border border-slate-200 hover:bg-sky-50 transition-all group w-full sm:w-auto justify-center"
          >
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            <span>رجوع للمتجر</span>
          </button>

          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[12px] sm:text-sm font-bold text-slate-500 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-sm border border-white w-full sm:w-auto overflow-x-auto whitespace-nowrap scrollbar-hide">
            <Link href="/" className="hover:text-sky-600 transition-colors flex-shrink-0"><Home size={16} /></Link>
            <ChevronRight size={14} className="rtl:rotate-180 text-slate-300 flex-shrink-0" />
            {breadcrumbs.map((step: HierarchyStep, index: number) => (
              <React.Fragment key={index}>
                <Link href={step.url.replace('.com', '.org')} className="hover:text-sky-600 transition-colors flex-shrink-0">{step.name}</Link>
                <ChevronRight size={14} className="rtl:rotate-180 text-slate-300 flex-shrink-0" />
              </React.Fragment>
            ))}
            <span className="text-sky-700 truncate max-w-[150px]">{product.name}</span>
          </nav>
        </div>

        {/* كارت المنتج الرئيسي */}
        <div className="bg-white rounded-[2rem] md:rounded-[3.5rem] shadow-xl md:shadow-2xl border border-slate-100 grid grid-cols-1 lg:grid-cols-12 overflow-hidden mb-12">
          
          {/* قسم الصورة */}
          <div className="lg:col-span-5 bg-slate-50 relative p-6 md:p-10 lg:p-14 flex flex-col items-center border-b lg:border-b-0 lg:border-l border-slate-100">
            <div 
              className="lg:sticky lg:top-28 w-full aspect-square rounded-[1.5rem] md:rounded-[3rem] overflow-hidden bg-white shadow-lg border border-slate-200 group cursor-zoom-in transition-all duration-500 hover:shadow-xl" 
              onClick={() => setIsLightboxOpen(true)}
            >
              <Image 
                src={product.image || '/placeholder.jpg'} 
                alt={`${product.name} - توريد وتجهيز آبار المياه`} 
                fill 
                className="object-contain transition-all duration-700 group-hover:scale-110 p-6 md:p-10" 
                priority
              />
              <div className="absolute bottom-4 left-4 bg-slate-900/90 text-white p-2.5 rounded-xl opacity-0 lg:group-hover:opacity-100 transition-all">
                <ZoomIn size={20} />
              </div>
              <div className="absolute top-4 left-4 bg-emerald-500 text-white text-[9px] md:text-[10px] font-black px-3 py-1.5 rounded-full uppercase shadow-md">
                {product.brand || 'منتج أصلي معتمد'}
              </div>
            </div>
          </div>

          {/* قسم التفاصيل والبيانات الفنية */}
          <div className="lg:col-span-7 p-6 md:p-10 lg:p-16 flex flex-col bg-white">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl lg:text-5xl font-black text-slate-900 leading-tight mb-3">{product.name}</h1>
                <div className="flex items-center gap-2 text-slate-400 font-bold text-xs md:text-sm">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  <span>ضمان الجودة من أبار جروب</span>
                </div>
              </div>
              <button 
                onClick={() => { 
                  navigator.clipboard.writeText(window.location.href); 
                  toast.success("تم نسخ رابط المنتج"); 
                }} 
                className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-sky-600 transition-all border border-slate-100 self-end sm:self-start"
              >
                <Share2 size={20} />
              </button>
            </div>

            {/* نظام التبويبات المطور - متجاوب مع التمرير */}
            <div className="flex overflow-x-auto p-1 bg-slate-100 rounded-2xl mb-8 w-full scrollbar-hide">
              <div className="flex min-w-full sm:min-w-0">
                {[
                  { id: 'specs', label: 'المواصفات', icon: Settings },
                  { id: 'description', label: 'الشرح', icon: FileText },
                  { id: 'guide', label: 'الدليل', icon: Info },
                ].map((tab) => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)} 
                    className={`flex items-center justify-center gap-2 px-4 md:px-8 py-3 rounded-xl font-black text-xs md:text-sm transition-all whitespace-nowrap flex-1 ${activeTab === tab.id ? 'bg-white text-sky-600 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    <tab.icon size={16} className="hidden sm:block" /> {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* محتوى التبويب المختار */}
            <div className="flex-grow min-h-[250px] md:min-h-[300px]">
              <AnimatePresence mode="wait">
                {activeTab === 'specs' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-slate-50/30"
                  >
                    {product.attributes ? Object.entries(product.attributes).map(([key, value], index) => (
                      <div key={key} className={`flex justify-between items-center p-4 md:p-5 ${index % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'} border-b border-slate-100 last:border-0`}>
                        <span className="font-bold text-slate-600 text-sm md:text-base flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-sky-500 rounded-full"></div> {key}
                        </span>
                        <span className="font-black text-slate-900 text-sm md:text-base text-left">{String(value)}</span>
                      </div>
                    )) : (
                      <div className="text-center py-16 text-slate-400 font-bold italic">لا توجد مواصفات فنية حالياً.</div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'description' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="prose prose-slate max-w-none bg-slate-50 p-6 md:p-10 rounded-2xl border border-slate-100 leading-relaxed text-base md:text-lg text-slate-700 font-medium"
                  >
                    <ReactMarkdown>{product.Description || 'يتوفر قريباً شرح تفصيلي لكافة المميزات.'}</ReactMarkdown>
                  </motion.div>
                )}

                {activeTab === 'guide' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="bg-sky-50 p-6 md:p-10 rounded-2xl border border-sky-100"
                  >
                    <h4 className="text-sky-900 font-black mb-4 flex items-center gap-2 text-sm md:text-base">
                       <Wrench size={18} /> نصائح فنية من خبرائنا:
                    </h4>
                    <ul className="space-y-3 text-sky-800 font-bold leading-relaxed list-disc list-inside text-sm md:text-base">
                      <li>تأكد من مطابقة المنتج لقطر البئر ونوع ملوحة المياه.</li>
                      <li>يفضل التركيب بواسطة فني متخصص لضمان الضمان.</li>
                      <li>نوصي باستخدام كابلات أصلية مع طلمبات الأعماق.</li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* أزرار الإجراءات */}
            <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => { addToCart(product, quantity); toast.success("تمت الإضافة للسلة"); }} 
                className="bg-slate-900 text-white rounded-2xl h-14 md:h-16 font-black text-base md:text-lg flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-lg active:scale-95"
              >
                <ShoppingBag size={20} /> إضافة للسلة
              </button>
              
              <button 
                onClick={() => window.open(`https://wa.me/201211110240?text=استفسار فني: ${product.name}`, '_blank')} 
                className="border-2 border-slate-900 text-slate-900 rounded-2xl h-14 md:h-16 font-black text-base md:text-lg flex items-center justify-center gap-3 hover:bg-slate-900 hover:text-white transition-all"
              >
                <Tag size={20} /> استشارة فنية
              </button>
            </div>
          </div>
        </div>

        {/* سكشن SEO Expansion */}
        <section className="bg-white rounded-[2rem] md:rounded-[3.5rem] p-8 md:p-16 lg:p-20 shadow-lg mb-12 border border-slate-50">
          <div className="max-w-4xl mx-auto text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-4">لماذا تختار أبار جروب؟</h2>
            <div className="w-16 h-1 bg-emerald-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { icon: Truck, color: 'text-sky-600', title: 'توريد سريع', desc: 'نلتزم بتوريد الطلمبات والمستلزمات في وقت قياسي لكافة المحافظات.' },
              { icon: Settings, color: 'text-emerald-600', title: 'دعم فني', desc: 'نوفر خبرتنا في صيانة الآبار لمساعدتك في اختيار القطعة الأنسب.' },
              { icon: ShieldCheck, color: 'text-amber-500', title: 'ضمان حقيقي', desc: 'كافة المنتجات تأتي مع ضمان رسمي وقطع غيار أصلية متوفرة.' }
            ].map((item, i) => (
              <div key={i} className="text-center lg:text-right">
                <item.icon className={`w-10 h-10 ${item.color} mx-auto lg:mr-0 mb-4`} />
                <h4 className="text-lg font-black mb-2">{item.title}</h4>
                <p className="text-slate-600 leading-relaxed text-sm font-bold">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* قسم المنتجات المقترحة */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 mb-12 overflow-hidden px-2">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-sky-100 p-3 rounded-xl text-sky-600 shadow-inner"><Shuffle size={24} /></div>
              <h2 className="text-xl md:text-3xl font-black text-slate-900 font-arabic">منتجات قد تهمك</h2>
            </div>
            <div className="flex gap-4 md:gap-8 overflow-x-auto pb-6 pt-2 scrollbar-hide snap-x">
              {relatedProducts.map((item) => (
                <Link key={item.id} href={`/product/${item.id}`} className="group bg-white p-4 md:p-6 rounded-[2rem] border border-slate-100 shadow-md hover:shadow-xl transition-all min-w-[240px] md:min-w-[300px] flex-shrink-0 snap-start">
                  <div className="relative aspect-square rounded-[1.5rem] overflow-hidden bg-slate-50 mb-4 border border-slate-50">
                    <Image src={item.image || '/placeholder.jpg'} alt={item.name} fill className="object-contain p-4 group-hover:scale-110 transition-all duration-700" />
                  </div>
                  <h3 className="font-black text-slate-800 text-sm md:text-base group-hover:text-sky-600 transition-colors line-clamp-2 min-h-[3rem] text-center leading-relaxed">{item.name}</h3>
                  <div className="flex justify-center mt-4">
                    <span className="inline-flex items-center gap-2 text-[11px] md:text-xs font-black text-white bg-slate-900 px-4 py-2.5 rounded-xl group-hover:bg-emerald-600 transition-all">
                      عرض المنتج <ArrowLeft size={14} className="rotate-180" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* نافذة Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/98 z-[200] flex flex-col items-center justify-center p-4 backdrop-blur-xl cursor-zoom-out"
            onClick={() => setIsLightboxOpen(false)}
          >
             <button 
                onClick={() => setIsLightboxOpen(false)} 
                className="absolute top-6 right-6 text-white flex items-center gap-2 font-black hover:text-emerald-400 transition-colors z-[210] p-2"
              >
                <span>إغلاق</span> <X size={32} />
              </button>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl aspect-square md:aspect-auto md:h-[80vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full shadow-2xl rounded-2xl overflow-hidden bg-white/5">
                <Image src={product.image || '/placeholder.jpg'} alt={product.name} fill className="object-contain p-2" quality={100} priority />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ShoppingCart />
    </main>
  );
}