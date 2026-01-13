'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, User, ArrowRight } from 'lucide-react';
import StartAction from '@/components/StartAction';

export default function ProjectDetailClient({ project }: { project: any }) {
  const router = useRouter();

  // تنظيف النص وحذف جملة "وصف قصير للمعاينة"
  const cleanDescription = project.scope
    ? project.scope
        .replace(/وصف قصير للمعاينة[:：]?\s*/g, '') // حذف العبارة المطلوبة
        .replace(/(\#+|\*|\-|\_|\`|\[|\]|\(|\)|\>)/g, '') // تنظيف الماركدوان
        .trim()
    : "";

  return (
    <main className="min-h-screen bg-white pt-24 pb-20 rtl text-right">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* زر العودة للمشاريع */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-[#0c2461] mb-10 font-bold transition-colors"
        >
          <ArrowRight size={20} />
          <span>العودة للمشاريع</span>
        </button>

        <h1 className="text-4xl md:text-5xl font-black text-[#1a365d] mb-12 leading-tight">
          {project.title}
        </h1>

        {/* عرض الصورة كاملة بدون أي اقتصاص (Contain) */}
        <div className="relative w-full aspect-video bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100 mb-16 shadow-2xl">
          <Image 
            src={project.image} 
            alt={project.title} 
            fill 
            className="object-contain p-6" 
            priority
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* المحتوى النصي التفصيلي */}
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h2 className="text-2xl font-black text-[#0c2461] mb-6 border-r-4 border-sky-500 pr-4">تفاصيل المشروع</h2>
              <div className="text-slate-600 text-lg leading-relaxed space-y-6">
                <p>{cleanDescription}</p>
              </div>
            </section>
          </div>

          {/* بطاقة معلومات المشروع الجانبية */}
          <aside className="space-y-6">
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 h-fit">
              <h3 className="text-xl font-bold text-slate-900 mb-6 border-b pb-4 text-center">بطاقة المعلومات</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <User className="text-sky-600" size={24} />
                  <div>
                    <p className="text-sm text-slate-400">العميل</p>
                    <p className="font-bold text-slate-700">{project.client}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="text-sky-600" size={24} />
                  <div>
                    <p className="text-sm text-slate-400">الموقع</p>
                    <p className="font-bold text-slate-700">{project.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Calendar className="text-sky-600" size={24} />
                  <div>
                    <p className="text-sm text-slate-400">سنة التنفيذ</p>
                    <p className="font-bold text-slate-700">{project.year}</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* إضافة StartAction في نهاية الصفحة */}
      <div className="mt-20">
         <StartAction />
      </div>
    </main>
  );
}