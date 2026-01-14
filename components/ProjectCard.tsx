'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink } from "lucide-react";

/**
 * الواجهة البرمجية للمشروع
 */
interface Project {
  id: number;
  title: string;
  image: string;
  slug: string;
}

interface ProjectCardProps {
  project: Project;
  priorityLoad?: boolean;
}

/**
 * مكون كارت المشروع المحسن - تم استخدام React.memo لتحسين الأداء
 */
const ProjectCard: React.FC<ProjectCardProps> = React.memo(({ project, priorityLoad = false }) => {
  return (
    <Link 
      href={`/project/${project.slug}`} 
      // تم تقليل مدة الانيميشن ليكون أسرع (300ms) وإضافة active:scale-95 للاستجابة اللمسية
      className="group relative bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-md hover:shadow-2xl border border-slate-100 transition-all duration-300 hover:-translate-y-2 active:scale-95 flex flex-col h-full overflow-hidden"
      prefetch={true} // التأكد من التحميل المسبق لبيانات الصفحة التالية
    >
      {/* حاوية الصورة - تحسين الوضوح والحجم */}
      <div className="relative w-full aspect-[4/3] bg-slate-50 overflow-hidden border-b border-slate-50">
        <Image
          src={project.image}
          alt={project.title}
          fill
          priority={priorityLoad}
          // استخدام object-contain مع p-2 لإظهار المعدات بوضوح دون قص
          className="object-contain p-2 md:p-3 transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        
        {/* مؤشر تفاعلي يظهر عند التحويم فقط في الشاشات الكبيرة */}
        <div className="absolute inset-0 bg-sky-900/5 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <ExternalLink className="w-5 h-5 text-sky-600" />
            </div>
        </div>
      </div>
      
      {/* قسم النصوص - تحسين الهوامش والتجاوب */}
      <div className="p-5 md:p-8 flex flex-col flex-grow text-right"> 
        <h3 className="text-lg md:text-xl font-black text-[#1a365d] mb-4 group-hover:text-sky-600 transition-colors line-clamp-2 leading-relaxed h-12 md:h-14">
          {project.title}
        </h3>
        
        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between"> 
          {/* علامة فنية صغيرة لزيادة الجمالية */}
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest group-hover:text-emerald-500 transition-colors">
            Abaar Group
          </span>

          <span className="flex items-center gap-2 text-xs md:text-sm font-black text-sky-600">
            <span>التفاصيل</span>
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-sky-50 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-all duration-300">
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </div>
          </span>
        </div>
      </div>
    </Link>
  );
});

// تحديد اسم العرض لتجنب أخطاء ESLint
ProjectCard.displayName = "ProjectCard";

export default ProjectCard;