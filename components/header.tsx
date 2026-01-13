'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe, Phone, ShoppingCart as CartIcon, ChevronDown } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

// --- مساعد اللغة (يُفضل نقله لملف مستقل لاحقاً) ---
const useLanguage = () => ({
  t: (key: string) => {
    const dict: any = {
      home: 'الرئيسية', about: 'من نحن', service: 'خدماتنا',
      projects: 'المشاريع', store: 'المتجر', blog: 'المدونة',
      contact: 'تواصل معنا',
    };
    return dict[key] || key;
  },
  language: 'ar',
  toggleLanguage: () => {}
});

// --- إعدادات الحركات (Variants) لضمان السرعة والجمالية ---
const navVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 }
};

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { t, language, toggleLanguage } = useLanguage();
  const { setIsCartOpen, getTotalItems } = useCart();
  const totalItems = getTotalItems();

  const isStorePage = pathname.startsWith('/store');

  // تحسين أداء مراقبة التمرير
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        if (!isScrolled) setIsScrolled(true);
      } else {
        if (isScrolled) setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  // منع التمرير عند فتح القائمة
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { key: 'home', href: '/' },
    { key: 'about', href: '/about' },
    { key: 'service', href: '/service' },
    { key: 'projects', href: '/project' },
    { key: 'store', href: '/store' },
    { key: 'blog', href: '/blog' },
    { key: 'contact', href: '/contact' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 will-change-transform ${
        isScrolled 
          ? 'py-3 bg-white/90 backdrop-blur-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_4px_6px_-2px_rgba(0,0,0,0.05)]' 
          : 'py-5 bg-white border-b border-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 lg:h-14">
          
          {/* 1. الشعار مع تأثير هوفر ناعم */}
          <Link href="/" className="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 transition-transform active:scale-90">
            <Image
              src="/image/f1.png"
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          </Link>

          {/* 2. الروابط للشاشات الكبيرة مع مؤشر نشط متحرك */}
          <div className="hidden lg:flex items-center gap-1 bg-gray-50/50 p-1.5 rounded-2xl border border-gray-100/50">
            {navLinks.map(({ key, href }) => {
              const active = pathname === href;
              return (
                <Link
                  key={key}
                  href={href}
                  className={`relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                    active ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <span className="relative z-10">{t(key)}</span>
                  {active && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-white shadow-sm rounded-lg border border-gray-100"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* 3. أزرار الأكشن */}
          <div className="flex items-center gap-3">
            
            {/* زر اللغة المطور */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleLanguage}
              className="group hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 hover:border-emerald-500 transition-all hover:shadow-md"
            >
              <Globe size={16} className="text-emerald-500 group-hover:rotate-180 transition-transform duration-500" />
              <span className="text-[11px] font-black text-gray-700 uppercase tracking-tighter">
                {language === 'ar' ? 'English' : 'العربية'}
              </span>
            </motion.button>

            {/* سلة التسوق مع انيميشن الإشعار */}
            {isStorePage && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-90"
              >
                <CartIcon size={20} />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-white"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            )}

            {/* زر الموبايل المطور */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-gray-100 text-gray-900 active:scale-90 transition-transform"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div key="x" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
                    <X size={22} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}>
                    <Menu size={22} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* 4. قائمة الموبايل المنسدلة المحسنة */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-2xl overflow-hidden"
            >
              <motion.div 
                variants={navVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-1 p-4"
              >
                {navLinks.map(({ key, href }) => (
                  <motion.div key={key} variants={itemVariants}>
                    <Link
                      href={href}
                      className={`flex items-center justify-between px-5 py-4 rounded-2xl text-base font-bold transition-all ${
                        pathname === href 
                          ? 'bg-emerald-50 text-emerald-600' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {t(key)}
                      {pathname === href && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                    </Link>
                  </motion.div>
                ))}
                
                <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-gray-50">
                  <button 
                    onClick={toggleLanguage}
                    className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-gray-50 text-gray-700 font-bold"
                  >
                    <Globe size={18} className="text-emerald-500" />
                    {language === 'ar' ? 'English' : 'العربية'}
                  </button>
                  <a 
                    href="tel:01211110240" 
                    className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-100"
                  >
                    <Phone size={18} />
                    اتصال
                  </a>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;