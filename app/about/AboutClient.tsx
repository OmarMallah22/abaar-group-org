'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Slider from "react-slick";
import { 
    Award, Target, User, Sun, CheckCircle, 
    Users, ArrowLeft, Zap, ShieldCheck,
    Wrench, Truck, Droplets
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

// تنسيقات السلايدر
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import StartAction from '@/components/StartAction';

// --- تعريف الأنواع ---
interface AboutClientProps {
    initialTeam: any[];
    initialStats: {
        years: string;
        projects: string;
        clients: string;
        solar: string;
    };
}

const AboutClient: React.FC<AboutClientProps> = ({ initialTeam, initialStats }) => {
    const [teamMembers, setTeamMembers] = useState<any[]>(initialTeam);
    const [isTeamLoading, setIsTeamLoading] = useState(initialTeam.length === 0);
    const [statsData, setStatsData] = useState(initialStats);
    const [isMounted, setIsMounted] = useState(false); // لحل مشاكل السلايدر في أول رندر
    
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const allServices = [
        'حفر آبار المياه وتطهيرها الشامل',
        'صيانة آبار المياه الجوفية وتطويرها',
        'توريد وتركيب طلمبات ومواتير أعماق',
        'محطات الطاقة الشمسية المتكاملة للمزارع',
        'توريد ألواح الطاقة الشمسية عالية الكفاءة',
        'توريد إنفرترات الطاقة الشمسية المعتمدة',
        'الدراسات الجيوفيزيائية وجسات التربة دقيقة',
        'تصوير الآبار تليفزيونيًا لتحديد الأعطال',
        'توريد مواسير الآبار: سيملس وحديد معالج',
        'مواسير بلاستيك UPVC بمواصفات عالمية',
        'كابلات طلمبات أعماق تتحمل الخدمة الشاقة',
        'تجارب الضخ المعتمدة لتقييم البئر'
    ];

    useEffect(() => {
        setIsMounted(true);
        const fetchData = async () => {
            if (initialTeam.length > 0) return;
            setIsTeamLoading(true);
            try {
                const { data: teamData, error: teamError } = await supabase
                    .from('team_members')
                    .select('*')
                    .order('display_order', { ascending: true });

                if (teamError) throw teamError;
                setTeamMembers(teamData || []);

                const { data: configData } = await supabase.from('site_configuration').select('*');
                if (configData) {
                    const config: any = {};
                    configData.forEach((item: any) => config[item.config_key] = item.config_value);
                    
                    const currentYear = new Date().getFullYear();
                    const startYear = parseInt(config.experience_start_year) || 1999;
                    
                    setStatsData({
                        years: `${currentYear - startYear}+`,
                        projects: `${config.base_projects_count || 600}+`,
                        clients: `${config.base_clients_count || 600}+`,
                        solar: `${config.base_solar_stations_count || 150}+`
                    });
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setIsTeamLoading(false);
            }
        };
        fetchData();
    }, [initialTeam]);

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
        const vs = compile(vertexSource, gl.VERTEX_SHADER);
        const fs = compile(fragmentSource, gl.FRAGMENT_SHADER);
        
        if (vs && fs && program) {
            gl.attachShader(program, vs); gl.attachShader(program, fs);
            gl.linkProgram(program); gl.useProgram(program);
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

    // إعدادات السلايدر المحسنة لمنع التداخل في الجوال
    const leadershipSettings = {
        infinite: teamMembers.length > 1,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        rtl: true,
        dots: true, // إضافة نقاط لتسهيل التنقل
        arrows: false, // إخفاء الأسهم في الموبايل لمنع مشاكل المساحة
        responsive: [
            { 
                breakpoint: 1024, 
                settings: { slidesToShow: 2, arrows: false } 
            },
            { 
                breakpoint: 768, 
                settings: { 
                    slidesToShow: 1, 
                    centerMode: true, 
                    centerPadding: "20px", 
                    arrows: false 
                } 
            }
        ]
    };

    return (
        <div className="bg-white min-h-screen font-arabic overflow-x-hidden" dir="rtl">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "AboutPage",
                        "mainEntity": {
                            "@type": "Organization",
                            "name": "أبار جروب لحفر وصيانة الآبار",
                            "description": "شركة رائدة في حفر وصيانة آبار المياه وتوريد طلمبات الطاقة الشمسية في مصر منذ 1999.",
                            "url": "https://abaargroup.org"
                        }
                    })
                }}
            />

            {/* --- Hero Section (تم حل مشكلة التداخل مع الهيدر) --- */}
            <section className="relative min-h-[55vh] md:h-[65vh] flex items-center justify-center overflow-hidden bg-sky-950 pt-16 md:pt-0">
                <video autoPlay muted loop playsInline className="absolute inset-0 z-0 w-full h-full object-cover opacity-50">
                    <source src="/image/project.m4v" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-b from-sky-900/60 via-transparent to-slate-50 z-[1]" />
                
                <div className="relative z-10 text-center px-4 max-w-5xl">
                    <motion.span 
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="inline-block px-6 py-2 mt-10 bg-emerald-500 text-white text-xs md:text-sm font-black rounded-full mb-6 tracking-widest animate-pulse"
                    >
                        خبراء حفر وصيانة الآبار
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="text-2xl sm:text-4xl md:text-7xl font-black text-white drop-shadow-2xl leading-tight"
                    >
                        أبار جروب | ريادة في <span className="text-emerald-400">حفر وتوريد</span> الآبار
                    </motion.h1>
                    <p className="text-sky-100 text-base md:text-2xl max-w-3xl mx-auto mt-6 font-medium opacity-90 leading-relaxed">
                        نحن ملتزمون بـ <strong>توريد طلمبات المياه</strong> وتصميم محطات <strong>الطاقة الشمسية</strong> بأعلى معايير الجودة منذ عام 1999.
                    </p>
                </div>
            </section>

            {/* --- About Content --- */}
            <section className="py-16 md:py-28 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        <div className="text-right order-2 lg:order-1">
                            <h2 className="text-2xl md:text-5xl font-black text-blue-900 mb-8 leading-tight">
                                ريادة مصرية في حفر وصيانة الآبار وتوريد معداتها
                            </h2>
                            <p className="text-lg md:text-xl text-slate-600 leading-loose mb-10">
                                آبار جروب هي شريكك الموثوق في <strong>صيانة وتطهير آبار المياه</strong> الجوفية. نحن نمتلك الخبرة الفنية والمعدات الحديثة لضمان <strong>توريد كافة مستلزمات الآبار</strong> وحلول الطاقة المتجددة.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {allServices.map((service) => (
                                    <div key={service} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl hover:bg-emerald-50 transition-colors group border border-slate-100">
                                        <CheckCircle className="text-emerald-500 group-hover:scale-110 transition-transform shrink-0" size={20} />
                                        <span className="font-bold text-slate-700 text-sm md:text-base leading-snug">{service}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative aspect-square rounded-[40px] md:rounded-[60px] overflow-hidden shadow-2xl order-1 lg:order-2 border-4 md:border-8 border-slate-50">
                            <Image 
                                src="/image/about.jpeg" 
                                alt="فريق عمل شركة أبار جروب" 
                                fill 
                                className="object-cover transition-transform duration-700 hover:scale-105" 
                                sizes="(max-width: 768px) 100vw, 50vw" 
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Leadership Team Section (تم حل مشكلة تداخل الكروت) --- */}
            <section className="py-16 md:py-24 bg-[#f8fafc] relative overflow-hidden border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                    <div className="text-center mb-12 md:mb-16">
                        <h2 className="text-2xl md:text-5xl font-black text-blue-900 mb-4">
                            خبراء أبار جروب في هندسة المياه والطاقة
                        </h2>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-emerald-500 mx-auto rounded-full"></div>
                    </div>

                    {isTeamLoading ? (
                        <div className="flex flex-col items-center py-20 gap-4">
                            <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
                            <p className="text-slate-400 font-bold animate-pulse">جاري جلب بيانات القادة...</p>
                        </div>
                    ) : (
                        <div className="px-2 md:px-10 team-slider-wrapper">
                            {isMounted && (
                                <Slider {...leadershipSettings}>
                                    {teamMembers.map((member) => (
                                        <div key={member.id} className="px-2 md:px-4 py-8 outline-none">
                                            <div className="group relative bg-white rounded-[2rem] p-6 md:p-12 text-center shadow-lg border border-slate-100 transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col items-center justify-center min-h-[280px]">
                                                <div className="absolute top-0 right-0 w-full h-1.5 bg-gradient-to-l from-blue-600 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                                <div className="w-16 h-16 md:w-24 md:h-24 bg-sky-50 rounded-full mb-6 flex items-center justify-center text-sky-600">
                                                    <User size={40} className="md:w-16 md:h-16" />
                                                </div>
                                                <div className="relative z-10">
                                                    <h3 className="text-lg md:text-2xl font-black text-blue-900 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-1">{member.name}</h3>
                                                    <p className="text-emerald-600 text-xs md:text-sm font-bold bg-emerald-50 px-4 py-1.5 rounded-xl border border-emerald-100/50">
                                                        {member.position_key || 'خبير فني متخصص'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </Slider>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* --- Statistics Section --- */}
            <section className="py-20 bg-emerald-600 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full"></div>
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center relative z-10">
                    {[
                        { icon: Award, num: statsData.years, label: "سنة خبرة" },
                        { icon: Target, num: statsData.projects, label: "مشروع منجز" },
                        { icon: Users, num: statsData.clients, label: "عميل راضٍ" },
                        { icon: Sun, num: statsData.solar, label: "محطة طاقة" },
                    ].map((stat, i) => (
                        <div key={i} className="group">
                            <stat.icon className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-4 opacity-80 group-hover:scale-110 transition-transform" />
                            <div className="text-3xl md:text-5xl font-black mb-1">{stat.num}</div>
                            <div className="font-bold opacity-90 text-[10px] md:text-base">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* SEO Content Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 text-center max-w-4xl">
                    <Droplets className="w-12 h-12 text-sky-500 mx-auto mb-6" />
                    <h2 className="text-2xl md:text-3xl font-black mb-8 text-blue-900 leading-tight">نحن نؤمن بأهمية كل قطرة مياه</h2>
                    <p className="text-base md:text-lg text-slate-600 leading-relaxed font-medium">
                        عملية <strong>حفر الآبار</strong> تتطلب دقة هندسية، ونحن نستخدم تقنيات التصوير التليفزيوني لفحص البئر قبل وبعد الصيانة. التزامنا بـ <strong>توريد طلمبات أصلية</strong> يضمن لعملائنا استدامة مائية بأقل التكاليف.
                    </p>
                </div>
            </section>

            <StartAction />

            {/* تحسينات CSS مخصصة للسلايدر لمنع أي تداخل خارجي */}
            <style jsx global>{`
                .team-slider-wrapper .slick-list {
                    margin: 0 -10px;
                }
                .team-slider-wrapper .slick-dots li button:before {
                    color: #10b981;
                    font-size: 12px;
                }
                .team-slider-wrapper .slick-dots li.slick-active button:before {
                    color: #0c2461;
                }
            `}</style>
        </div>
    );
};

export default AboutClient;