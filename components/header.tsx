'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe, Phone, ShoppingCart as CartIcon } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Variants } from 'framer-motion'; // تأكد من إضافة هذا الاستيراد
// 1. نقل البيانات خارج المكون لمنع إعادة تعريفها في كل Rerender
const navLinks = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about' },
  { key: 'service', href: '/service' },
  { key: 'projects', href: '/project' },
  { key: 'store', href: '/store' },
  { key: 'blog', href: '/blog' },
  { key: 'contact', href: '/contact' },
];

const translations: Record<string, string> = {
  home: 'الرئيسية', about: 'من نحن', service: 'خدماتنا',
  projects: 'المشاريع', store: 'المتجر', blog: 'المدونة',
  contact: 'تواصل معنا',
};

// 2. تبسيط الأنيميشن ليكون أسرع (Tween بدلاً من Spring للأداء العالي)
const mobileMenuVariants: Variants = {
  closed: { 
    opacity: 0, 
    height: 0, 
    transition: { duration: 0.2, ease: "easeInOut" } 
  },
  open: { 
    opacity: 1, 
    height: "auto", 
    transition: { duration: 0.3, ease: "easeOut" } 
  }
};

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { setIsCartOpen, getTotalItems } = useCart();
  const totalItems = getTotalItems();

  const isStorePage = pathname.startsWith('/store');

  // 3. تحسين مراقبة التمرير باستخدام Throttling يدوي بسيط
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 4. إغلاق القائمة عند تغيير المسار فوراً
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // 5. استخدام useCallback للعمليات المتكررة
  const toggleMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  // 6. تحسين الـ DOM: استخدام CSS للتحكم في الـ Overflow بدلاً من التأثيرات الجانبية الثقيلة
  useEffect(() => {
    document.documentElement.style.overflow = isMobileMenuOpen ? 'hidden' : '';
  }, [isMobileMenuOpen]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isScrolled 
          ? 'py-2 bg-white/80 backdrop-blur-md shadow-sm' 
          : 'py-4 bg-white border-b border-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          
          {/* الشعار - إضافة Priority و Sizes لتحسين LCP */}
          <Link href="/" className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 transition-transform active:scale-95">
            <Image
              src="/image/f1.png"
              alt="Logo"
              fill
              sizes="(max-width: 768px) 40px, 48px"
              className="object-contain"
              priority
            />
          </Link>

          {/* الروابط للشاشات الكبيرة - تحسين تجربة الـ Hover */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ key, href }) => {
              const active = pathname === href;
              return (
                <Link
                  key={key}
                  href={href}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                    active ? 'text-emerald-600 bg-emerald-50/50' : 'text-gray-600 hover:text-emerald-500 hover:bg-gray-50'
                  }`}
                >
                  {translations[key]}
                </Link>
              );
            })}
          </div>

          {/* الأكشنز */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* زر اتصال سريع - إضافة قيمة مضافة للعميل */}
            <a href="tel:01211110240" className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-all text-xs font-bold">
              <Phone size={14} />
              <span>اتصل بنا</span>
            </a>

            {/* سلة التسوق - تظهر فقط في المتجر */}
            {isStorePage && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-transform active:scale-90 shadow-md"
              >
                <CartIcon size={18} />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-white">
                    {totalItems}
                  </span>
                )}
              </button>
            )}

            {/* زر الموبايل - تم تبسيطه للأداء */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-xl bg-gray-100 text-gray-900 active:scale-90 transition-all"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* قائمة الموبايل - تحسين سرعة الظهور باستخدام Height Animation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="lg:hidden bg-white overflow-hidden"
            >
              <div className="flex flex-col gap-1 py-4 border-t border-gray-50">
                {navLinks.map(({ key, href }) => (
                  <Link
                    key={key}
                    href={href}
                    className={`px-4 py-4 rounded-xl text-base font-bold transition-all ${
                      pathname === href ? 'bg-emerald-50 text-emerald-600' : 'text-gray-700 active:bg-gray-50'
                    }`}
                  >
                    {translations[key]}
                  </Link>
                ))}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-gray-50 text-gray-700 font-bold text-sm">
                    <Globe size={18} className="text-emerald-500" />
                    English
                  </button>
                  <a href="tel:01211110240" className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-emerald-600 text-white font-bold text-sm shadow-sm">
                    <Phone size={18} />
                    اتصال
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default React.memo(Header); // 7. استخدام React.memo لمنع إعادة الرندر إذا لم تتغير الـ Props