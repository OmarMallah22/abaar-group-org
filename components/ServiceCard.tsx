'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ImageOff, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

// تعريف الواجهة للخدمة
interface Service {
  id: string;
  title: string;
  description: string;
  image_url: string;
  slug: string;
}

// تعريف الواجهة للبروبس
interface ServiceCardProps {
  service: Service;
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index }) => {
  const [imageError, setImageError] = useState(false);
  
  // تحديد إذا كان الترتيب زوجي أم فردي لتبادل الأماكن
  const isEven = index % 2 === 0;

  // تنظيف الوصف واستخراج الجزء قبل علامة "---"
  const shortDescriptionMatch = service.description.match(/([\s\S]*?)---/);
  const rawDescription = shortDescriptionMatch ? shortDescriptionMatch[1].trim() : service.description.split("\n")[0].trim();

  // حذف "وصف قصير للمعاينة" وتنظيف رموز المارك داون
  const cleanDescription = rawDescription
    .replace(/وصف قصير للمعاينة[:：]?\s*/g, '')
    .replace(/(\#+|\*|\-|\_|\`|\[|\]|\(|\)|\>)/g, '')
    .trim();

  return (
    <section 
      itemScope 
      itemType="https://schema.org/Service"
      className="relative w-full py-16 lg:py-24 overflow-hidden bg-white border-b border-slate-50 last:border-0"
    >
      {/* الزخرفة الخلفية الدائرية */}
      <div className={`absolute top-0 ${isEven ? 'right-0' : 'left-0'} w-1/3 h-full opacity-[0.03] pointer-events-none select-none hidden lg:block`}>
        <svg viewBox="0 0 500 500" className="w-full h-full text-[#0c2461]">
          {[100, 150, 200, 250, 300].map((r) => (
            <circle key={r} cx={isEven ? "500" : "0"} cy="250" r={r} fill="none" stroke="currentColor" strokeWidth="1" />
          ))}
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className={`flex flex-col ${isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-24`}>
          
          {/* الجانب البصري: الصورة مع تحسين الـ Alt لـ SEO */}
          <motion.div 
            initial={{ x: isEven ? 100 : -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="w-full lg:w-1/2"
          >
            <div className="w-full overflow-hidden rounded-[2.5rem] shadow-2xl shadow-blue-900/5 group relative border-4 border-slate-50">
              <Image
                itemProp="image"
                src={service.image_url}
                alt={`تنفيذ خدمة ${service.title} - شركة أبار جروب لحفر وصيانة الآبار`}
                width={800}
                height={600}
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ width: '100%', height: 'auto' }} 
                className="transition-transform duration-700 group-hover:scale-105"
                priority={index < 2}
              />
              {/* شارة جودة تظهر فوق الصورة */}
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                 <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                 <span className="text-[12px] font-black text-slate-800">خدمة معتمدة</span>
              </div>
            </div>
          </motion.div>

          {/* الجانب النصي: المحتوى مع Microdata */}
          <motion.div 
            initial={{ x: isEven ? -100 : 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="w-full lg:w-1/2 text-right"
          >
            <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-bold mb-6">
              قسم {service.title}
            </div>

            <h2 itemProp="name" className="text-3xl md:text-5xl font-black text-[#1a365d] mb-6 leading-tight">
              {service.title}
            </h2>
            
            <p itemProp="description" className="text-slate-600 text-lg md:text-xl leading-relaxed mb-10">
              {cleanDescription}
            </p>

            {/* سطر إضافي لتقوية الـ SEO (ثابت في كل البطاقات لزيادة كثافة الكلمات) */}
            <div className="flex flex-wrap gap-4 mb-10">
               <div className="flex items-center gap-2 text-slate-500 text-sm font-bold">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  تجهيز مستلزمات كاملة
               </div>
               <div className="flex items-center gap-2 text-slate-500 text-sm font-bold">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  صيانة دورية معتمدة
               </div>
            </div>

            {/* زر قراءة المزيد: تحسين النص ليكون وصفياً (Descriptive Link) */}
            <Link 
              href={`/service/${service.slug}`}
              className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-bold rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-blue-900/20 group"
              aria-label={`عرض تفاصيل خدمة ${service.title}`}
            >
              <span>تفاصيل خدمة {service.title}</span>
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-2" />
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ServiceCard;