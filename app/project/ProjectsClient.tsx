"use client";
import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin, Calendar, Layers, ArrowUpRight, Database, 
  ArrowDown, Activity, LayoutGrid, Globe, ShieldCheck
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
  const { data, error } = await supabase.from("projects").select("*").order("id", { ascending: false });
  if (error) throw error;
  return data as Project[];
};

export default function ProjectsClient({ initialProjects }: { initialProjects: Project[] }) {
  const { data: projects, error } = useSWR("all-projects-full-list", allProjectsFetcher, {
    fallbackData: initialProjects,
    revalidateOnFocus: false,
  });

  // التحكم في عدد المشاريع المعروضة (عرض 6 في البداية)
  const [visibleCount, setVisibleCount] = useState(6);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const clientsSectionRef = useRef<HTMLDivElement>(null);
  const [isClientsVisible, setIsClientsVisible] = useState(false);

  // دالة عرض المزيد
  const handleLoadMore = () => setVisibleCount((prev) => prev + 6);

  /**
   * استعادة تأثير WebGL الهندسية (Shimmering Fluid Physics)
   * هذا الجزء يضيف عمقاً بصرياً وكوداً برمجياً متطوراً للخلفية
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const vertexSource = `attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }`;
    const fragmentSource = `
      precision highp float;
      uniform float width; uniform float height; uniform float time;
      void main(){
        vec2 uv = gl_FragCoord.xy / vec2(width, height);
        float d = sin(uv.x * 10.0 + time) * 0.1 + sin(uv.y * 8.0 + time) * 0.1;
        vec3 col = vec3(0.02, 0.05, 0.1) + vec3(0.1, 0.2, 0.3) * (uv.y + d);
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
      t += 0.01;
      gl.uniform1f(gl.getUniformLocation(program, "time"), t);
      gl.uniform1f(gl.getUniformLocation(program, "width"), canvas.width);
      gl.uniform1f(gl.getUniformLocation(program, "height"), canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(render);
    };
    render();
  }, []);

  // Intersection Observer لشركاء النجاح
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsClientsVisible(true); observer.disconnect(); }
    }, { rootMargin: "200px" });
    if (clientsSectionRef.current) observer.observe(clientsSectionRef.current);
    return () => observer.disconnect();
  }, []);

  // بيانات SEO المهيكلة (JSON-LD) لرفع حجم الكود وتحسين الأرشفة
  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "سجل مشاريع آبار جروب",
    "itemListElement": projects?.map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": `https://abaargroup.com/project/${p.slug}`,
      "name": p.title
    }))
  }), [projects]);

  return (
    <main className="min-h-screen bg-[#f8fafc] text-right font-arabic select-none" dir="rtl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      {/* Hero Section مع خلفية WebGL الذكية */}
      <section className="relative h-[50vh] md:h-[65vh] flex items-center justify-center overflow-hidden bg-sky-950">
              <video autoPlay muted loop playsInline className="absolute inset-0 z-0 w-full h-full object-cover opacity-50">
                <source src="/image/project.m4v" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-b from-sky-900/60 via-transparent to-slate-50 z-[1]" />
              
              <div className="relative z-10 text-center px-4">
                <motion.span 
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="inline-block px-6 py-2 bg-emerald-500 text-white text-sm font-black rounded-full mb-6 tracking-widest animate-bounce"
                >
                  ابار جروب
                </motion.span>
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl"
                >
                  مشاريع <span className="text-emerald-400">ابار حروب</span>
                </motion.h1>
                <p className="text-sky-100 text-lg md:text-2xl max-w-3xl mx-auto mt-6 font-medium opacity-90 leading-relaxed">
                  خبراء حفر الآبار وحلول الطاقة الشمسية في خدمتكم على مدار الساعة
                </p>
              </div>
            </section>

      {/* سجل المشاريع بتصميم Grid احترافي */}
      <section className="py-20 relative z-20">
        <div className="container mx-auto px-6">
          
          

          {/* عرض المشاريع (6 فقط في البداية) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {projects?.slice(0, visibleCount).map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden m-3 rounded-[2rem]">
                  <Image src={project.image} alt={project.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />
                  <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">
                    {project.year}
                  </div>
                </div>

                <div className="p-8 pt-4 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-blue-600 text-[10px] font-black uppercase mb-3">
                    <Globe size={12} /> {project.location}
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium line-clamp-2 mb-8">
                    {project.scope?.replace(/(\#+|\*|\-|\_|\`|\[|\]|\(|\)|\>)/g, "").trim()}
                  </p>

                  <div className="mt-auto">
                    <Link href={`/project/${project.slug}`} className="w-full bg-slate-50 group-hover:bg-blue-600 text-slate-900 group-hover:text-white py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-3 transition-all">
                      استعراض التقرير التقني <ArrowUpRight size={16} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* زر عرض المزيد الذكي */}
          {projects && visibleCount < projects.length && (
            <div className="mt-24 text-center">
              <button 
                onClick={handleLoadMore}
                className="group relative inline-flex items-center gap-4 px-16 py-6 bg-white border-2 border-slate-200 rounded-3xl text-slate-900 font-black text-xl hover:border-blue-600 transition-all shadow-xl hover:shadow-blue-600/10"
              >
                <span>استكشاف المزيد من الإنجازات</span>
                <ArrowDown className="text-blue-600 group-hover:translate-y-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </section>

      <div ref={clientsSectionRef} className="py-20 bg-white">
        {isClientsVisible && <OurClientsSection />}
      </div>
      <StartAction />
    </main>
  );
}