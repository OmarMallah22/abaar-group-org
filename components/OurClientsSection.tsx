'use client';

import React, { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from '@/lib/supabase';
import { 
    Building2, 
    AlertCircle, 
    ChevronDown, 
    Star, 
    ShieldCheck, 
    Award
} from "lucide-react";
import { motion, Variants, AnimatePresence } from "framer-motion";

interface OurClient {
    id: number;
    description: string;
}

// 1. إعدادات حركة خفيفة وسريعة جداً (Performance Optimized)
const fastTransition = { 
    duration: 0.4, 
    ease: [0.25, 1, 0.5, 1] // Ease-out quint لمحاكاة السرعة
} as const;

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { 
            staggerChildren: 0.04, // تسريع تتابع ظهور الكروت
            delayChildren: 0.05 
        }
    }
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 }, // تقليل مسافة الإزاحة لتسريع الأداء
    visible: { 
        opacity: 1, 
        y: 0, 
        transition: fastTransition
    }
};

const OurClientsSection: React.FC = () => {
    const [clients, setClients] = useState<OurClient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [visibleCount, setVisibleCount] = useState(9);

    const sectionRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    // 2. تحسين الـ Intersection Observer ليعمل مرة واحدة فقط وبدقة
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        }, { rootMargin: '100px' });

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    const fetchClients = useCallback(async () => {
        try {
            setIsLoading(true);
            const { data, error: dbError } = await supabase
                .from("ourclient")
                .select("id, description")
                .order("id", { ascending: true });

            if (dbError) throw dbError;
            setClients(data || []);
        } catch (err: any) {
            setError("تعذر تحميل البيانات حالياً.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isVisible) fetchClients();
    }, [isVisible, fetchClients]);

    return (
        <section 
            ref={sectionRef} 
            className="relative py-20 md:py-32 overflow-hidden bg-white rtl text-right" 
            dir="rtl"
        >
            {/* زخرفة خلفية خفيفة جداً (CSS Only) لتقليل رندر الـ SVG */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
                 style={{ backgroundImage: 'radial-gradient(#083344 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }} 
            />

            <div className="relative container mx-auto px-4 max-w-7xl z-10">
                <header className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-[10px] md:text-xs font-black tracking-widest text-cyan-700 bg-cyan-50 rounded-full border border-cyan-100 uppercase">
                            <Star size={14} className="fill-cyan-600" />
                            <span>شركاء النجاح</span>
                        </div>
                        
                        <h2 className="text-3xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
                            نبني مستقبلاً مستداماً <br /> 
                            <span className="text-cyan-600">مع كبار الشركاء</span>
                        </h2>
                        
                        <p className="text-base md:text-lg text-slate-500 font-bold max-w-xl mx-auto leading-relaxed">
                            نفخر بثقة المؤسسات الكبرى في رؤيتنا الهندسية لتنفيذ المشاريع القومية.
                        </p>
                    </motion.div>
                </header>

                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-40 bg-slate-50 rounded-3xl animate-pulse border border-slate-100" />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center p-10 bg-red-50 rounded-3xl">
                            <p className="text-red-600 font-bold">{error}</p>
                            <button onClick={fetchClients} className="mt-4 text-sm font-black underline">إعادة المحاولة</button>
                        </div>
                    ) : (
                        <div className="space-y-16">
                            <motion.div 
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                            >
                                {clients.slice(0, visibleCount).map((client) => (
                                    <motion.div
                                        key={client.id}
                                        variants={cardVariants}
                                        whileHover={{ y: -5 }} // أنميشن هوفر خفيف جداً
                                        className="will-change-transform" // تحسين أداء المتصفح
                                    >
                                        <div className="h-full flex flex-col p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                                            <div className="w-12 h-12 mb-6 flex items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                                                <Building2 size={24} />
                                            </div>
                                            <p className="text-lg md:text-xl font-black text-slate-800 leading-relaxed flex-grow">
                                                {client.description}
                                            </p>
                                            <div className="pt-6 mt-6 border-t border-slate-50 flex items-center gap-2">
                                                <ShieldCheck size={14} className="text-cyan-500" />
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">شريك معتمد</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {visibleCount < clients.length && (
                                <div className="text-center">
                                    <button
                                        onClick={() => setVisibleCount(clients.length)}
                                        className="inline-flex items-center gap-3 px-10 py-4 bg-slate-900 text-white font-black text-base rounded-2xl hover:bg-cyan-600 transition-all active:scale-95 shadow-xl"
                                    >
                                        <span>عرض كافة الشركاء</span>
                                        <ChevronDown size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </AnimatePresence>

                {/* تذييل القسم المحسن */}
                {!isLoading && (
                    <div className="mt-20 pt-10 border-t border-slate-50 flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale">
                        {[{I: Award, T: "جودة معتمدة"}, {I: ShieldCheck, T: "موثوقية تامة"}, {I: Building2, T: "خبرة ميدانية"}].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 font-black text-xs md:text-sm text-slate-900">
                                <item.I size={18}/> {item.T}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default React.memo(OurClientsSection);