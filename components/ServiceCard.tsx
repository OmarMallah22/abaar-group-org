'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * الواجهات البرمجية (Interfaces)
 */
interface Service {
  id: string;
  title: string;
  description: string;
  image_url: string;
  slug: string;
}

interface ServiceCardProps {
  service: Service;
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index }) => {
  // تحديد إذا كان الترتيب زوجي أم فردي لتبادل الأماكن في الشاشات الكبيرة
  const isEven = index % 2 === 0;

  // منطق تنظيف الوصف الفني لضمان ظهوره بشكل احترافي
  const shortDescriptionMatch = service.description.match(/([\s\S]*?)---/);
  const rawDescription = shortDescriptionMatch 
    ? shortDescriptionMatch[1].trim() 
    : service.description.split("\n")[0].trim();

  const cleanDescription = rawDescription
    .replace(/وصف قصير للمعاينة[:：]?\s*/g, '')
    .replace(/(\#+|\*|\-|\_|\`|\[|\]|\(|\)|\>)/g, '')
    .trim();

  return (
    <section 
      itemScope 
      itemType="https://schema.org/Service"
      className="relative w-full py-12 md:py-20 lg:py-28 overflow-hidden bg-white border-b border-slate-50 last:border-0"
    >
      {/* الزخرفة الخلفية الدائرية - تظهر فقط في الشاشات الكبيرة لتجنب تشتيت العميل في الموبايل */}
      <div className={`absolute top-0 ${isEven ? 'right-0' : 'left-0'} w-1/3 h-full opacity-[0.02] pointer-events-none select-none hidden lg:block`}>
        <svg viewBox="0 0 500 500" className="w-full h-full text-[#0c2461]">
          {[100, 150, 200, 250, 300].map((r) => (
            <circle key={r} cx={isEven ? "500" : "0"} cy="250" r={r} fill="none" stroke="currentColor" strokeWidth="1" />
          ))}
        </svg>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className={`flex flex-col ${isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-8 md:gap-16 lg:gap-24`}>
          
          {/* الجانب البصري: صورة الخدمة مع مراعاة أحجام الشاشات المختلفة */}
          <motion.div 
            initial={{ x: isEven ? 50 : -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
            className="w-full lg:w-1/2"
          >
            <div className="w-full overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl shadow-blue-900/5 group relative border-2 md:border-4 border-slate-50 bg-slate-50">
              <Image
                itemProp="image"
                src={service.image_url}
                alt={`تنفيذ خدمة ${service.title} - شركة أبار جروب لحفر وصيانة الآبار`}
                width={800}
                height={600}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="w-full h-auto transition-transform duration-700 group-hover:scale-105 object-cover"
                priority={index < 2}
              />
              {/* شارة جودة تظهر فوق الصورة */}
              <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-white/95 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-lg flex items-center gap-2 border border-white/20">
                 <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-emerald-500" />
                 <span className="text-[10px] md:text-[12px] font-black text-slate-800">خدمة معتمدة</span>
              </div>
            </div>
          </motion.div>

          {/* الجانب النصي: المحتوى التقني بتنسيق مريح للعين */}
          <motion.div 
            initial={{ x: isEven ? -50 : 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
            className="w-full lg:w-1/2 text-right"
          >
            <div className="inline-block px-3 py-1 md:px-4 md:py-1.5 bg-blue-50 text-blue-600 rounded-full text-[11px] md:text-sm font-black mb-4 md:mb-6 uppercase tracking-wider">
              قسم {service.title}
            </div>

            <h2 itemProp="name" className="text-2xl md:text-4xl lg:text-5xl font-black text-[#1a365d] mb-4 md:mb-6 leading-tight">
              {service.title}
            </h2>
            
            <p itemProp="description" className="text-slate-600 text-base md:text-xl leading-relaxed md:leading-loose mb-8 md:mb-10 font-medium break-words">
              {cleanDescription}
            </p>

            {/* نقاط القوة - تحسين السيو وزيادة الكلمات المفتاحية */}
            <div className="flex flex-wrap gap-4 mb-8 md:mb-10">
               <div className="flex items-center gap-2 text-slate-500 text-xs md:text-sm font-bold bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  تجهيز مستلزمات كاملة
               </div>
               <div className="flex items-center gap-2 text-slate-500 text-xs md:text-sm font-bold bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  صيانة دورية معتمدة
               </div>
            </div>

            {/* زر اتخاذ إجراء (CTA) - تحسين الاستجابة اللمسية */}
            <Link 
              href={`/service/${service.slug}`}
              className="inline-flex items-center gap-3 px-6 py-3.5 md:px-8 md:py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all shadow-xl hover:shadow-emerald-200 active:scale-95 group w-full sm:w-auto justify-center"
              aria-label={`عرض تفاصيل خدمة ${service.title}`}
            >
              <span className="text-sm md:text-base">تفاصيل خدمة {service.title}</span>
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-2" />
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

// تحديد اسم العرض لتجنب أخطاء ESLint وتسهيل عملية الـ Debugging
ServiceCard.displayName = "ServiceCard";

export default ServiceCard;