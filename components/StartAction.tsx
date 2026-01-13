'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

const StartAction = () => {
  return (
    // استخدام py-10 للموبايل و py-16 للديسكتوب لضمان مساحة مريحة
    <section className="relative w-full bg-white py-10 md:py-16 overflow-hidden border-t border-gray-50 font-arabic" dir="rtl">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* الحفاظ على ترتيبك: النص أولاً ثم الصورة */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          
          {/* الجانب الأيمن: النص - في الموبايل يصبح متمركزاً (Center) وفي الديسكتوب يميناً كما طلبت */}
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-right space-y-4 order-1">
            <h2 className="text-2xl md:text-4xl font-black text-[#1a1a1a] leading-tight">
              محتار تبدأ مشروعك؟ <br className="hidden md:block" /> أحنا هنا هنساعدك!
            </h2>
            
            <p className="text-sm md:text-base text-gray-500 leading-relaxed max-w-md">
              سواء كنت محتاج حفر، صيانة آبار، أو استشارة فنية لتجهيز محطتك..
              <span className="block mt-2 text-[#1a365d] font-black text-lg md:text-xl">
                إحنا هنا علشان نساعدك
              </span>
            </p>

            <div className="pt-2 w-full md:w-auto">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3.5 bg-[#1a1a1a] text-white text-base font-bold rounded-lg shadow-lg hover:bg-black transition-all duration-300 hover:-translate-y-1 active:scale-95 group"
              >
                تواصل معنا الآن
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* الجانب الأيسر: الصورة - تظهر أسفل النص في الموبايل وبجانبه في الديسكتوب */}
          <div className="w-full md:w-2/5 relative h-[220px] md:h-[300px] order-2">
            <Image
              src="/image/S1.webp" 
              alt="Start Project Illustration"
              fill
              className="object-contain md:object-left"
              priority
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default StartAction;