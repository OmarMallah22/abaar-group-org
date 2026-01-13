'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, Plus, Minus, ShoppingBag, Trash2, 
  MessageCircle, Check, ArrowLeft, ShoppingCart as CartIcon 
} from 'lucide-react';
import { useCart, CartItem as CartItemType } from '../app/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Image from 'next/image';

const CartItemRow = ({ item }: { item: CartItemType }) => {
  const { updateQuantity, removeFromCart } = useCart();
  
  return (
    <motion.div 
      layout 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }} 
      className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-slate-100 mb-3 group hover:border-sky-100 transition-colors"
    >
      <div className="flex gap-4">
        {/* صورة المنتج */}
        <div className="relative w-20 h-20 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-50">
          <Image 
            src={item.image || '/placeholder.jpg'} 
            alt={item.name} 
            fill 
            className="object-contain p-2 group-hover:scale-110 transition-transform duration-500" 
          />
        </div>

        {/* تفاصيل المنتج */}
        <div className="flex-1 flex flex-col justify-between min-w-0 font-arabic text-right">
          <div>
            <h4 className="font-black text-slate-800 text-sm mb-1 line-clamp-1">{item.name}</h4>
            <p className="text-sky-600 text-[10px] font-black uppercase tracking-wider">{item.brand || 'أصلي'}</p>
          </div>

          <div className="flex items-center justify-between mt-2">
            {/* التحكم في الكمية */}
            <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
              <button 
                onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow-sm text-slate-400 hover:text-sky-600 transition-all"
              >
                <Minus size={12} />
              </button>
              <span className="w-8 text-center font-black text-slate-800 text-sm">{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow-sm text-slate-400 hover:text-sky-600 transition-all"
              >
                <Plus size={12} />
              </button>
            </div>

            {/* حذف المنتج */}
            <button 
              onClick={() => {
                removeFromCart(item.id);
                toast.error("تم حذف المنتج من السلة");
              }} 
              className="text-slate-300 hover:text-red-500 transition-colors p-1"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ShoppingCart = () => {
  const { items, getTotalItems, isCartOpen, setIsCartOpen, clearCart } = useCart();
  const [copyState, setCopyState] = useState<'idle' | 'success'>('idle');

  useEffect(() => {
    document.body.style.overflow = isCartOpen ? 'hidden' : 'unset';
  }, [isCartOpen]);

  const handleRequestQuote = () => {
    const details = items.map(i => `📦 *${i.name}*\n🔹 الماركة: ${i.brand || 'أصلية'}\n🔹 الكمية: ${i.quantity}\n🔹 الكود: ${i.id}`).join('\n\n---\n');
    const message = `*طلب عرض سعر جديد - أبار جروب*\n\nمرحباً، أود الاستفسار عن المنتجات التالية:\n\n${details}`;
    
    navigator.clipboard.writeText(message).then(() => {
      setCopyState('success');
      toast.success("تم نسخ تفاصيل الطلب.. جاري التوجيه");
      setTimeout(() => { 
        setCopyState('idle'); 
        window.open(`https://wa.me/201211110240?text=${encodeURIComponent(message)}`, '_blank'); 
      }, 1000);
    });
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* الغلاف الخلفي المعتم والمضبب */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => setIsCartOpen(false)} 
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[110]" 
          />

          {/* لوحة السلة الجانبية */}
          <motion.div 
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }} 
            transition={{ type: 'spring', damping: 25, stiffness: 200 }} 
            className="fixed top-0 right-0 h-full w-full max-w-[400px] bg-slate-50 z-[120] shadow-2xl flex flex-col border-l border-white/10"
          >
            {/* رأس السلة - متجانس مع الهيدر */}
            <header className="bg-white p-6 border-b border-slate-100 flex items-center justify-between font-arabic">
              <div className="flex items-center gap-4">
                <div className="bg-sky-600 p-2.5 rounded-2xl text-white shadow-lg shadow-sky-200">
                  <ShoppingBag size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 leading-none">سلة الطلبات</h2>
                  <p className="text-[11px] text-slate-400 font-bold mt-1">{getTotalItems()} منتج مختار</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)} 
                className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-900"
              >
                <X size={20} />
              </button>
            </header>

            {/* المحتوى الرئيسي */}
            <main className="flex-1 overflow-y-auto p-5 space-y-2 font-arabic text-right custom-scrollbar" dir="rtl">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-10">
                  <div className="bg-slate-200/50 p-8 rounded-[3rem] mb-6">
                    <CartIcon size={48} className="text-slate-400" />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 mb-2 font-arabic">سلتك فارغة تماماً</h3>
                  <p className="text-slate-400 text-sm mb-8 font-bold">ابدأ بإضافة المنتجات التي تهمك للحصول على عرض سعر دقيق.</p>
                  <button 
                    onClick={() => setIsCartOpen(false)} 
                    className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-sky-600 transition-all"
                  >
                    تصفح المتجر الآن <ArrowLeft size={18} />
                  </button>
                </div>
              ) : (
                <div className="pb-4">
                  <div className="flex justify-between items-center mb-4 px-1">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">قائمة المنتجات</span>
                    <button 
                      onClick={() => {
                        if(confirm("هل تريد إفراغ السلة؟")) clearCart();
                      }}
                      className="text-[10px] font-black text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 size={12} /> مسح الكل
                    </button>
                  </div>
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => <CartItemRow key={item.id} item={item} />)}
                  </AnimatePresence>
                </div>
              )}
            </main>

            {/* ذيل السلة - زر واتساب */}
            {items.length > 0 && (
              <footer className="bg-white p-6 border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] font-arabic">
                <div className="flex justify-between items-center mb-6 px-1">
                  <span className="text-slate-500 font-bold text-sm">إجمالي القطع:</span>
                  <span className="text-slate-900 font-black text-xl">{getTotalItems()}</span>
                </div>
                
                <button 
                  onClick={handleRequestQuote} 
                  className={`w-full py-4 rounded-[1.5rem] text-white font-black flex items-center justify-center gap-3 text-lg transition-all duration-500 shadow-xl ${
                    copyState === 'success' 
                      ? 'bg-emerald-500 shadow-emerald-200' 
                      : 'bg-black hover:bg-green-600 shadow-slate-200'
                  }`}
                >
                  {copyState === 'success' ? (
                    <><Check size={24} /> تم النسخ.. جاري التوجيه</>
                  ) : (
                    <><MessageCircle size={22} /> طلب عرض سعر عبر واتساب</>
                  )}
                </button>
                <p className="text-[10px] text-center text-slate-400 mt-4 font-bold">سيتم إرسال قائمة المنتجات المحددة تلقائياً إلى واتساب</p>
              </footer>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShoppingCart;