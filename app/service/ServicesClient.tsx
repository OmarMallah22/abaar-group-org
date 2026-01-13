// app/service/ServicesClient.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { 
    Shield, Clock, Star, Award, Zap, 
    Droplets, CheckCircle2, ArrowLeft 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import StartAction from '@/components/StartAction';
import ServiceCard from '@/components/ServiceCard';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * تعريف الواجهات (Interfaces) لضمان توافق TypeScript
 */
interface Service {
  id: string;
  title: string;
  description: string;
  image_url: string;
  slug: string;
}

interface ServicesClientProps {
  initialServices: Service[];
}

/**
 * دالة جلب البيانات للتحديثات اللحظية عبر SWR
 */
const servicesFetcher = async () => {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("title", { ascending: true });
  if (error) throw error;
  return data as Service[];
};

const ServicesClient: React.FC<ServicesClientProps> = ({ initialServices }) => {
  // استخدام SWR مع البيانات الأولية القادمة من السيرفر لمنع "الوميض" عند التحميل
  const { data: services, error: swrError, isLoading } = useSWR('/service', servicesFetcher, {
    fallbackData: initialServices,
    revalidateOnFocus: false
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  /**
   * منطق WebGL المتطور لخلفية الهيرو (التوهج المتحرك)
   * تم الحفاظ على كافة التفاصيل لضمان الأداء البصري
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

    let time = 0;
    const vertexSource = `attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }`;
    const fragmentSource = `
      precision highp float;
      uniform float width; uniform float height; uniform float time;
      vec2 resolution = vec2(width, height);
      float glow(vec2 p, float r, float i, float s, float a, float f){
        float d = abs(p.y + a * sin(s * time + p.x * f));
        d = r / d; return pow(d, i);
      }
      void main(){
        vec2 uv = gl_FragCoord.xy / resolution;
        vec2 p = vec2(0.5) - uv; p.y *= resolution.y / resolution.x;
        vec3 col = vec3(0.0);
        col += glow(p, 0.02, 1.5, 2.0, 0.02, 4.0) * vec3(0.1, 0.8, 0.5);
        col = 1.0 - exp(-col); gl_FragColor = vec4(col, 1.0);
      }
    `;

    const compile = (src: string, type: number) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src); gl.compileShader(s);
      return s;
    };

    const program = gl.createProgram();
    if (!program) return;
    const vs = compile(vertexSource, gl.VERTEX_SHADER);
    const fs = compile(fragmentSource, gl.FRAGMENT_SHADER);
    
    if (vs && fs) {
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      gl.useProgram(program);
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]), gl.STATIC_DRAW);
      const pos = gl.getAttribLocation(program, "position");
      gl.enableVertexAttribArray(pos);
      gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
      const timeH = gl.getUniformLocation(program, "time");
      const wH = gl.getUniformLocation(program, "width");
      const hH = gl.getUniformLocation(program, "height");
      
      const render = () => {
        time += 0.01; gl.uniform1f(timeH, time);
        gl.uniform1f(wH, canvas.width); gl.uniform1f(hH, canvas.height);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        requestAnimationFrame(render);
      };
      render();
    }
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <main className="min-h-screen bg-white font-arabic" dir="rtl">
      
      {/* === 1. قسم الهيرو (Hero Section) === */}
      <section className="relative h-[55vh] md:h-[70vh] flex items-center justify-center overflow-hidden bg-sky-950">
        <video autoPlay muted loop playsInline className="absolute inset-0 z-0 w-full h-full object-cover opacity-40">
          <source src="/image/project.m4v" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-sky-950/80 via-transparent to-slate-50 z-[1]" />
        
        {/* خلفية WebGL التفاعلية */}
        <canvas ref={canvasRef} className="absolute inset-0 z-[2] opacity-30 pointer-events-none" />

        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-6 py-2 bg-emerald-500 text-white text-xs font-black rounded-full mb-6 tracking-widest animate-pulse shadow-lg shadow-emerald-500/20">
              حلول رائدة منذ 1999
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white drop-shadow-2xl mb-6">
              خدمات <span className="text-emerald-400">أبار جروب</span>
            </h1>
            <p className="text-sky-100 text-lg md:text-2xl max-w-3xl mx-auto font-medium opacity-90 leading-relaxed">
              نلتزم بتقديم أعلى مستويات الدقة الفنية في حفر الآبار وأنظمة الطاقة الشمسية المتكاملة.
            </p>
          </motion.div>
        </div>
      </section>

      {/* === 2. قسم شبكة الخدمات (Services Grid Section) === */}
      <section className="relative py-32 overflow-hidden bg-slate-50/50">
        <div className="container mx-auto px-6 relative z-10">
          
          <div className="text-center mb-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <h2 className="text-4xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight">ماذا نقدم لعملائنا؟</h2>
                <div className="w-32 h-2 bg-sky-600 mx-auto rounded-full mb-8"></div>
                <p className="mt-6 text-slate-600 text-lg md:text-xl max-w-3xl mx-auto leading-loose font-medium">
                  نفتخر بكوننا الشريك الموثوق لكبرى المشاريع الزراعية والصناعية في مصر، من خلال حزمة خدماتنا المتكاملة.
                </p>
            </motion.div>
          </div>

          {/* حالة التحميل الاحتياطية */}
          {isLoading && !services && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-slate-200 animate-pulse h-[550px] rounded-[3rem]" />
              ))}
            </div>
          )}

          {/* عرض الخطأ في حال تعذر التحديث */}
          {swrError && (
            <div className="text-center p-12 bg-red-50 text-red-600 rounded-3xl mb-12 font-bold border border-red-100">
              نواجه مشكلة في تحديث البيانات حالياً. يتم عرض النسخة المخزنة مسبقاً.
            </div>
          )}

          {/* قائمة الخدمات الديناميكية */}
          <div className="space-y-16">
            <div className="grid grid-cols-1 gap-12">
              {services?.map((item, index) => (
                <ServiceCard 
                  key={item.id} 
                  service={item} 
                  index={index} 
                />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* === 3. لماذا تختار آبار جروب (Benefits Section) === */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-50"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tighter">لماذا نحن الخيار الأفضل؟</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-bold">
                نحن نضع الجودة والاستدامة في قلب كل مشروع نقوم بتنفيذه.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { icon: Clock, title: "خبرة متراكمة", desc: "أكثر من ربع قرن من النجاح في كافة أراضي جمهورية مصر العربية.", color: "bg-blue-600" },
              { icon: Award, title: "معايير عالمية", desc: "نعتمد على أفضل العلامات التجارية العالمية في الطلمبات والمعدات.", color: "bg-emerald-600" },
              { icon: Shield, title: "ضمان حقيقي", desc: "فريق صيانة ودعم فني متاح لضمان استمرارية عمل مشاريعكم بكفاءة.", color: "bg-amber-500" },
              { icon: Star, title: "ابتكار تقني", desc: "نستخدم أحدث تقنيات التصوير التليفزيوني والجيوفيزيائي للآبار.", color: "bg-sky-500" },
            ].map((benefit, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -10 }}
                className="group p-10 rounded-[3rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl transition-all duration-500 text-center"
              >
                <div className={`inline-flex items-center justify-center w-24 h-24 ${benefit.color} rounded-[2rem] mb-10 group-hover:rotate-[15deg] transition-transform shadow-2xl`}>
                  <benefit.icon className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-6">{benefit.title}</h3>
                <p className="text-slate-600 leading-loose font-bold text-sm">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* إجراء البدء (Call to Action) */}
      <section className="pb-24">
        <StartAction />
      </section>

    </main>
  );
};

export default ServicesClient;