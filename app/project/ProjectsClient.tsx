"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { supabase } from "@/lib/supabase";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin, Calendar, Layers, ArrowUpRight, Database, 
  ArrowDown, Activity, LayoutGrid, Globe, ShieldCheck,
  CheckCircle2, Wrench, Sun, Droplets
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import OurClientsSection from "../../components/OurClientsSection";
import StartAction from "../../components/StartAction";

/**
 * الواجهات البرمجية لضمان استقرار الكود
 */
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
  const { data: projects } = useSWR("all-projects-full-list", allProjectsFetcher, {
    fallbackData: initialProjects,
    revalidateOnFocus: false,
  });

  const [visibleCount, setVisibleCount] = useState(6);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const clientsSectionRef = useRef<HTMLDivElement>(null);
  const [isClientsVisible, setIsClientsVisible] = useState(false);

  const handleLoadMore = () => setVisibleCount((prev) => prev + 6);

  /**
   * تأثير WebGL المتطور - Shimmering Fluid Physics
   * يضيف لمسة تقنية هندسية تليق بشركة حفر آبار
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const vertexSource = `attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }`;
    const fragmentSource = `
      precision highp float;
      uniform float width; uniform float height; uniform float time;
      void main(){
        vec2 uv = gl_FragCoord.xy / vec2(width, height);
        float d = sin(uv.x * 12.0 + time) * 0.08 + sin(uv.y * 10.0 + time) * 0.08;
        vec3 col = vec3(0.01, 0.04, 0.08) + vec3(0.1, 0.25, 0.4) * (uv.y + d);
        gl_FragColor = vec4(col, 1.0);
      }`;

    const compile = (src: string, type: number) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src); gl.compileShader(s); return s;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(vertexSource, gl.VERTEX_SHADER));
    gl.attachShader(program, compile(fragmentSource, gl.FRAGMENT_SHADER));
    gl.linkProgram(program); gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,-1,-1,1,1,1,-1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    let t = 0;
    const render = () => {
      t += 0.008;
      gl.uniform1f(gl.getUniformLocation(program, "time"), t);
      gl.uniform1f(gl.getUniformLocation(program, "width"), canvas.width);
      gl.uniform1f(gl.getUniformLocation(program, "height"), canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(render);
    };
    render();
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsClientsVisible(true); observer.disconnect(); }
    }, { rootMargin: "200px" });
    if (clientsSectionRef.current) observer.observe(clientsSectionRef.current);
    return () => observer.disconnect();
  }, []);

  /**
   * بيانات Schema المتقدمة (JSON-LD)
   * تم توحيد النطاق إلى .org لتعزيز سلطة الموقع
   */
  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "سجل مشاريع حفر وصيانة الآبار - أبار جروب",
    "description": "قائمة بأهم مشاريع حفر الآبار الجوفية ومحطات الطاقة الشمسية التي نفذتها أبار جروب في مصر.",
    "url": "https://abaargroup.org/project",
    "itemListElement": projects?.map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": `https://abaargroup.org/project/${p.slug}`,
      "name": p.title
    }))
  }), [projects]);

  return (
    <main className="min-h-screen bg-[#f8fafc] text-right font-arabic select-none" dir="rtl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      {/* 1. Hero Section - مع خلفية WebGL وتحسين الكلمات المفتاحية */}
      <section className="relative h-[50vh] md:h-[65vh] flex items-center justify-center overflow-hidden bg-sky-950">
          <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-40 pointer-events-none" />
          <video autoPlay muted loop playsInline className="absolute inset-0 z-0 w-full h-full object-cover opacity-30">
            <source src="/image/project.m4v" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-sky-950/80 via-transparent to-slate-50 z-[1]" />
          
          <div className="relative z-10 text-center px-4">
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="inline-block px-6 py-2 bg-emerald-500 text-white text-xs font-black rounded-full mb-6 tracking-widest animate-pulse shadow-lg shadow-emerald-500/20"
            >
               أعمالنا في حفر وصيانة الآبار
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-7xl font-black text-white drop-shadow-2xl"
            >
              سجل مشاريع <span className="text-emerald-400">أبار جروب</span>
            </motion.h1>
            <p className="text-sky-100 text-lg md:text-2xl max-w-3xl mx-auto mt-6 font-medium opacity-90 leading-relaxed">
              نفخر بتنفيذ أضخم مشاريع <strong>حفر الآبار</strong> وأنظمة <strong>الطاقة الشمسية</strong> في مختلف محافظات مصر بأعلى دقة هندسية.
            </p>
          </div>
      </section>

      {/* 2. سجل المشاريع بتصميم Grid احترافي مع Microdata */}
      <section className="py-24 relative z-20">
        <div className="container mx-auto px-6">
          
          {/* قسم تمهيدي لزيادة كثافة المحتوى (SEO Expansion) */}
          <div className="max-w-4xl mx-auto text-center mb-20 space-y-6">
             <h2 className="text-3xl md:text-4xl font-black text-slate-900">خبرة ميدانية في توريد وصيانة الآبار</h2>
             <div className="w-24 h-1.5 bg-sky-600 mx-auto rounded-full"></div>
             <p className="text-slate-600 text-lg leading-loose font-medium">
               على مدار أكثر من عقدين، قمنا بتقديم حلول واقعية ومستدامة في <strong>صيانة وتطهير الآبار</strong>. مشاريعنا تشهد على التزامنا بـ <strong>توريد طلمبات المياه</strong> الأصلية وتصميم محطات <strong>الطاقة الشمسية</strong> التي تخدم كبرى المزارع والمشاريع الصناعية في مصر.
             </p>
          </div>

          {/* عرض المشاريع */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects?.slice(0, visibleCount).map((project, idx) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                itemScope itemType="https://schema.org/CreativeWork"
                className="group bg-white rounded-[3rem] border border-slate-200/60 shadow-sm hover:shadow-2xl transition-all duration-700 overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden m-4 rounded-[2.5rem] bg-slate-100">
                  <Image 
                    src={project.image} 
                    alt={`تنفيذ مشروع ${project.title} - شركة أبار جروب لحفر الآبار`} 
                    fill 
                    className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                    itemProp="image"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2">
                    <Calendar size={14} className="text-sky-600" />
                    <span className="text-[11px] font-black text-slate-800" itemProp="datePublished">{project.year}</span>
                  </div>
                </div>

                <div className="p-10 pt-4 flex flex-col flex-grow text-right">
                  <div className="flex items-center gap-2 text-sky-600 text-[11px] font-black uppercase mb-4 tracking-tighter">
                    <MapPin size={14} /> <span itemProp="locationCreated">{project.location}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-sky-600 transition-colors line-clamp-1" itemProp="name">
                    {project.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-[1.8] font-bold line-clamp-3 mb-10" itemProp="description">
                    {project.scope?.replace(/(\#+|\*|\-|\_|\`|\[|\]|\(|\)|\>)/g, "").trim()}
                  </p>

                  <div className="mt-auto">
                    <Link 
                      href={`/project/${project.slug}`} 
                      className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-xs flex items-center justify-center gap-4 transition-all hover:bg-emerald-600 shadow-xl group-hover:shadow-emerald-200"
                    >
                      استعراض التقرير الهندسي <ArrowUpRight size={18} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* زر عرض المزيد الذكي */}
          {projects && visibleCount < projects.length && (
            <div className="mt-24 text-center">
              <button 
                onClick={handleLoadMore}
                className="group relative inline-flex items-center gap-5 px-20 py-7 bg-white border-2 border-slate-200 rounded-[2.5rem] text-slate-900 font-black text-xl hover:border-sky-600 transition-all shadow-2xl hover:shadow-sky-200/50"
              >
                <span>استكشاف المزيد من الإنجازات</span>
                <div className="bg-sky-500 p-2 rounded-full text-white group-hover:translate-y-1 transition-transform">
                   <ArrowDown size={24} />
                </div>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 3. منهجية العمل (SEO Boost - حل مشكلة Thin Content) */}
      <section className="py-24 bg-white border-y border-slate-100">
         <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
               <div className="relative aspect-video rounded-[4rem] overflow-hidden shadow-2xl border-8 border-slate-50 group">
                  <Image src="/image/hint.jpeg" alt="فريق عمل أبار جروب أثناء حفر بئر مياه" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-sky-950/20" />
               </div>
               <div className="space-y-8">
                  <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">معايير التنفيذ في <span className="text-sky-600">أبار جروب</span></h2>
                  <div className="space-y-6">
                     {[
                       { icon: Droplets, title: "تحليل التربة", desc: "نقوم بعمل دراسات جيوفيزيائية دقيقة قبل البدء في حفر الآبار." },
                       { icon: Wrench, title: "الصيانة الوقائية", desc: "نستخدم كاميرات تصوير تليفزيوني لتحديد أعطال الآبار بدقة 100%." },
                       { icon: Sun, title: "حلول الطاقة", desc: "نركب أنظمة طاقة شمسية أصلية تضمن تشغيل الطلمبات بأقل تكلفة." },
                       { icon: ShieldCheck, title: "الضمان الهندسي", desc: "كافة مشاريع توريد مستلزمات الآبار تخضع لضمان فني شامل." }
                     ].map((item, i) => (
                       <div key={i} className="flex gap-5 p-6 rounded-3xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                          <div className="bg-sky-100 p-4 rounded-2xl text-sky-600 h-fit">
                             <item.icon size={24} />
                          </div>
                          <div>
                             <h4 className="font-black text-xl text-slate-900 mb-1">{item.title}</h4>
                             <p className="text-slate-500 font-bold text-sm leading-relaxed">{item.desc}</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 4. شركاء النجاح */}
      <div ref={clientsSectionRef} className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-16">
              <h3 className="text-2xl md:text-4xl font-black text-slate-800">عملاء نعتز بخدمتهم</h3>
           </div>
           {isClientsVisible && <OurClientsSection />}
        </div>
      </div>

      <StartAction />
      
      <div className="h-20 bg-white"></div>
    </main>
  );
}