"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { supabase } from "@/lib/supabase";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin, Calendar, ArrowUpRight, 
  ArrowDown, Droplets, Wrench, Sun, ShieldCheck, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import OurClientsSection from "../../components/OurClientsSection";
import StartAction from "../../components/StartAction";

interface Project {
  id: number;
  title: string;
  image: string;
  slug: string;
  client: string;
  location: string;
  year: string;
  scope: string;
}

const allProjectsFetcher = async () => {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("id", { ascending: false });
  if (error) throw error;
  return data as Project[];
};

export default function ProjectsClient({ initialProjects }: { initialProjects: Project[] }) {
  const { data: projects, isLoading } = useSWR("all-projects-full-list", allProjectsFetcher, {
    fallbackData: initialProjects,
    revalidateOnFocus: false,
  });

  const [visibleCount, setVisibleCount] = useState(6);
  const clientsSectionRef = useRef<HTMLDivElement>(null);
  const [isClientsVisible, setIsClientsVisible] = useState(false);

  // مراقب ظهور قسم العملاء لتسريع الصفحة
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsClientsVisible(true); observer.disconnect(); }
    }, { rootMargin: "100px" });
    if (clientsSectionRef.current) observer.observe(clientsSectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen bg-[#fcfcfd] text-right font-arabic overflow-x-hidden" dir="rtl">
      
      {/* 1. Hero Section - تحسين الأداء البصري */}
      <section className="relative h-[45vh] md:h-[65vh] flex items-center justify-center overflow-hidden bg-sky-950 pt-16 md:pt-20">
          <video autoPlay muted loop playsInline className="absolute inset-0 z-0 w-full h-full object-cover opacity-30 pointer-events-none">
            <source src="/image/project.m4v" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-sky-950/80 via-transparent to-[#fcfcfd]/20 z-[1]" />
          
          <div className="relative z-10 text-center px-4 max-w-5xl">
            <motion.span 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1.5 md:px-6 md:py-2 bg-emerald-500 text-white text-[10px] md:text-sm font-black rounded-full mb-4 md:mb-6 shadow-xl"
            >
               سجل إنجازات أبار جروب
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-2xl md:text-5xl lg:text-7xl font-black text-white drop-shadow-2xl leading-tight"
            >
              مشاريع <span className="text-emerald-400">توريد وحفر</span> الآبار
            </motion.h1>
            <p className="text-sky-50 text-sm md:text-xl lg:text-2xl max-w-3xl mx-auto mt-4 md:mt-6 font-bold opacity-95 leading-relaxed">
              توثيق ميداني لأضخم مشاريع <strong>حفر الآبار</strong> وأنظمة <strong>الطاقة الشمسية</strong> المنفذة بأعلى دقة هندسية في مصر.
            </p>
          </div>
      </section>

      {/* 2. Grid Section - تحسين التجاوب وسرعة الأنيميشن */}
      <section className="py-12 md:py-24 relative z-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          
          <div className="max-w-4xl mx-auto text-center mb-12 md:mb-20">
             <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-4">سابقة أعمالنا الهندسية</h2>
             <div className="w-20 h-1 bg-sky-600 mx-auto rounded-full mb-6"></div>
             <p className="text-slate-600 text-base md:text-lg font-bold leading-relaxed">
               نلتزم بـ <strong>صيانة وتطهير الآبار</strong> و <strong>توريد طلمبات المياه</strong> الأصلية لخدمة كبرى المزارع في مصر.
             </p>
          </div>

          {/* Grid المحسن */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {projects?.slice(0, visibleCount).map((project, idx) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4 }}
                className="group bg-white rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-full"
              >
                <div className="relative aspect-[4/3] overflow-hidden m-3 md:m-4 rounded-xl md:rounded-[2rem] bg-slate-50">
                  <Image 
                    src={project.image} 
                    alt={project.title} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105" 
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={idx < 3}
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2">
                    <Calendar size={12} className="text-sky-600" />
                    <span className="text-[10px] font-black text-slate-800">{project.year}</span>
                  </div>
                </div>

                <div className="p-6 md:p-8 pt-0 flex flex-col flex-grow">
                  <div className="flex items-center gap-1.5 text-sky-600 text-[10px] md:text-[11px] font-black uppercase mb-3">
                    <MapPin size={14} /> <span>{project.location}</span>
                  </div>
                  <h3 className="text-lg md:text-2xl font-black text-slate-900 mb-3 group-hover:text-sky-600 transition-colors line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-bold line-clamp-2 mb-6">
                    {project.scope?.replace(/(\#+|\*|\-|\_)/g, "").trim()}
                  </p>

                  <div className="mt-auto">
                    <Link 
                      href={`/project/${project.slug}`} 
                      className="w-full bg-slate-900 text-white py-4 rounded-xl md:rounded-[1.2rem] font-black text-xs flex items-center justify-center gap-3 transition-all hover:bg-emerald-600 active:scale-95 shadow-lg group-hover:shadow-emerald-100"
                    >
                      استعراض المشروع <ArrowUpRight size={16} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* زر عرض المزيد */}
          {projects && visibleCount < projects.length && (
            <div className="mt-16 md:mt-24 text-center">
              <button 
                onClick={() => setVisibleCount(v => v + 6)}
                className="group inline-flex items-center gap-3 px-8 md:px-16 py-4 md:py-6 bg-white border-2 border-slate-200 rounded-full text-slate-900 font-black text-base md:text-xl hover:border-sky-600 hover:text-sky-600 transition-all shadow-xl hover:shadow-sky-100/50 active:scale-95"
              >
                <span>استكشاف المزيد</span>
                <ArrowDown size={20} className="group-hover:translate-y-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 3. منهجية العمل - SEO Content */}
      <section className="py-16 md:py-28 bg-white border-y border-slate-50">
         <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
               <div className="relative aspect-video rounded-3xl md:rounded-[4rem] overflow-hidden shadow-2xl border-4 md:border-8 border-slate-50">
                  <Image src="/image/hint.jpeg" alt="حفر آبار مياه" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
               </div>
               <div className="space-y-6 md:space-y-8 text-right">
                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">معايير أبار جروب <span className="text-sky-600">في التنفيذ</span></h2>
                  <div className="grid gap-4 md:gap-6">
                     {[
                       { icon: Droplets, color: 'text-sky-600', bg: 'bg-sky-50', title: "تحليل التربة", desc: "دراسات جيوفيزيائية دقيقة قبل البدء في حفر الآبار." },
                       { icon: Wrench, color: 'text-emerald-600', bg: 'bg-emerald-50', title: "صيانة شاملة", desc: "نستخدم كاميرات تصوير تليفزيوني لتحديد أعطال الآبار بدقة." },
                       { icon: Sun, color: 'text-amber-500', bg: 'bg-amber-50', title: "طاقة شمسية", desc: "تشغيل الطلمبات بأعلى كفاءة وأقل تكلفة تشغيلية." },
                       { icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-50', title: "الضمان الفني", desc: "كافة المشاريع تخضع لضمان هندسي شامل وحقيقي." }
                     ].map((item, i) => (
                       <div key={i} className="flex gap-4 p-4 md:p-6 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
                          <div className={`${item.bg} ${item.color} p-3 md:p-4 rounded-xl h-fit shadow-sm`}>
                             <item.icon size={20} />
                          </div>
                          <div>
                             <h4 className="font-black text-lg md:text-xl text-slate-900 mb-1">{item.title}</h4>
                             <p className="text-slate-500 font-bold text-xs md:text-sm">{item.desc}</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 4. شركاء النجاح */}
      <div ref={clientsSectionRef} className="py-16 md:py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-12">
              <h3 className="text-xl md:text-3xl font-black text-slate-800">عملاء نعتز بخدمتهم</h3>
           </div>
           {isClientsVisible ? <OurClientsSection /> : <div className="h-40 flex items-center justify-center"><Loader2 className="animate-spin text-sky-400" /></div>}
        </div>
      </div>

      <StartAction />
    </main>
  );
}