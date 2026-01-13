'use client';

import React, { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from '@/lib/supabase';
import { 
    Building2, 
    Quote, 
    AlertCircle, 
    ChevronDown, 
    Star, 
    ShieldCheck, 
    Award,
    Loader2 
} from "lucide-react";
import { motion, Variants, AnimatePresence } from "framer-motion";

/**
 * --- واجهة البيانات ---
 */
interface OurClient {
    id: number;
    description: string;
}

/**
 * --- إعدادات الأنميشن الاحترافية (Spring Physics) ---
 * نستخدم "as const" لحل مشاكل TypeScript في Framer Motion
 */
const springTransition = { 
    type: "spring", 
    stiffness: 200, 
    damping: 22, 
    mass: 0.8 
} as const;

const hoverSpring = { 
    type: "spring", 
    stiffness: 350, 
    damping: 15 
} as const;

/**
 * --- متغيرات الحركة (Variants) ---
 */
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { 
            staggerChildren: 0.08, 
            delayChildren: 0.1 
        }
    }
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.92, rotateX: 10 },
    visible: { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        rotateX: 0,
        transition: springTransition
    }
};

const iconHoverVariants: Variants = {
    rest: { rotate: 0, scale: 1, y: 0 },
    hover: { 
        rotate: -12, 
        scale: 1.15, 
        y: -4,
        transition: hoverSpring 
    }
};

/**
 * --- هوك مخصص لاكتشاف التمرير (Intersection Observer) ---
 */
const useOnScreen = (ref: React.RefObject<HTMLElement>) => {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entry.target);
            }
        }, { rootMargin: '0px 0px -50px 0px' });

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [ref]);
    return isVisible;
};

/**
 * --- المكون الرئيسي: OurClientsSection ---
 */
const OurClientsSection: React.FC = () => {
    const [clients, setClients] = useState<OurClient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [visibleCount, setVisibleCount] = useState(9); // عرض 9 فقط في البداية

    const sectionRef = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(sectionRef);

    // دالة جلب البيانات من Supabase
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
            console.error("Fetch error:", err.message);
            setError("عذراً، لم نتمكن من تحميل بيانات شركاء النجاح حالياً.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isVisible) {
            fetchClients();
        }
    }, [isVisible, fetchClients]);

    // منطق إظهار الكل
    const handleShowMore = () => {
        setVisibleCount(clients.length);
    };

    return (
        <section 
            ref={sectionRef} 
            className="relative py-32 overflow-hidden bg-[#fdfdfe] rtl text-right select-none" 
            dir="rtl"
        >
            {/* --- زخارف الخلفية المتقدمة --- */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-cyan-100/30 rounded-full blur-[120px] mix-blend-multiply animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-[120px] mix-blend-multiply" />
                
                {/* نمط الشبكة الهندسي */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="premium-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#083344" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#premium-grid)" />
                </svg>
            </div>

            <div className="relative container mx-auto px-6 max-w-7xl z-10">
                {/* --- رأس القسم (Header) --- */}
                <header className="max-w-4xl mx-auto text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={springTransition}
                    >
                        <div className="inline-flex items-center gap-2 px-5 py-2 mb-8 text-sm font-black tracking-widest text-cyan-700 bg-cyan-50/80 backdrop-blur-md rounded-full border border-cyan-100 shadow-sm uppercase">
                            <Star size={16} className="fill-cyan-600" />
                            <span>شركاء نعتز بهم</span>
                        </div>
                        
                        <h2 className="text-4xl md:text-7xl font-black text-slate-900 mb-8 leading-[1.15] tracking-tight">
                            نبني مستقبلاً مستداماً <br /> 
                            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-l from-cyan-600 to-blue-700">
                                مع أقوى الشركاء
                                <motion.span 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: '100%' }}
                                    transition={{ delay: 0.6, duration: 1 }}
                                    className="absolute bottom-2 left-0 h-[10px] bg-cyan-200/40 -z-10 rounded-full"
                                />
                            </span>
                        </h2>
                        
                        <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                            نفخر بثقة كبرى المؤسسات الحكومية والخاصة في رؤيتنا وخبراتنا الهندسية لتنفيذ أضخم المشاريع القومية.
                        </p>
                    </motion.div>
                </header>

                {/* --- منطقة المحتوى (AnimatePresence) --- */}
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div 
                            key="skeleton"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                        >
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-72 bg-slate-50 border border-slate-100 rounded-[2.5rem] animate-pulse relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                                </div>
                            ))}
                        </motion.div>
                    ) : error ? (
                        <motion.div 
                            key="error-box"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center p-16 bg-white rounded-[3rem] shadow-2xl border border-red-50 max-w-2xl mx-auto text-center"
                        >
                            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-8">
                                <AlertCircle className="w-10 h-10 text-red-500" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 mb-4">حدث خطأ تقني</h3>
                            <p className="text-slate-600 text-lg mb-8">{error}</p>
                            <button onClick={fetchClients} className="px-8 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-cyan-600 transition-colors">إعادة المحاولة</button>
                        </motion.div>
                    ) : (
                        <div className="space-y-20">
                            <motion.div 
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
                            >
                                {clients.slice(0, visibleCount).map((client) => (
                                    <motion.div
                                        key={client.id}
                                        variants={cardVariants}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true }}
                                        whileHover="hover"
                                        whileTap={{ scale: 0.98 }}
                                        className="relative group h-full cursor-default"
                                    >
                                        {/* ظل التوهج الخلفي */}
                                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-[2.8rem] blur-xl opacity-0 group-hover:opacity-15 transition-opacity duration-500" />
                                        
                                        {/* جسم الكارد الزجاجي */}
                                        <div className="relative h-full flex flex-col p-10 bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-[0_10px_40px_rgb(0,0,0,0.03)] group-hover:shadow-[0_20px_60px_rgba(8,112,184,0.08)] group-hover:bg-white transition-all duration-500 overflow-hidden">
                                            
                                            {/* أيقونة Quote تزيينية */}
                                            <div className="absolute top-8 left-8 text-cyan-900/5 group-hover:text-cyan-900/10 transition-colors">
                                                <Quote size={80} />
                                            </div>

                                            <div className="flex-grow relative z-10">
                                                <motion.div 
                                                    variants={iconHoverVariants}
                                                    className="w-16 h-16 mb-10 flex items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-cyan-50 to-blue-50 text-cyan-700 shadow-sm border border-white group-hover:from-cyan-600 group-hover:to-blue-700 group-hover:text-white transition-all duration-500"
                                                >
                                                    <Building2 size={32} />
                                                </motion.div>
                                                
                                                <p className="text-2xl font-bold text-slate-800 leading-[1.6] group-hover:text-slate-950 transition-colors">
                                                    {client.description}
                                                </p>
                                            </div>

                                            <div className="pt-8 mt-4 border-t border-slate-50 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <ShieldCheck size={16} className="text-cyan-500" />
                                                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">اعتماد رسمي</span>
                                                </div>
                                                <motion.div 
                                                    whileHover={{ scale: 1.5 }}
                                                    className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.6)]" 
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* --- زر "عرض المزيد" الإبداعي --- */}
                            {visibleCount < clients.length && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    className="text-center"
                                >
                                    <button
                                        onClick={handleShowMore}
                                        className="group relative inline-flex items-center gap-4 px-14 py-5 bg-slate-900 text-white font-black text-xl rounded-[2rem] shadow-2xl shadow-slate-900/20 hover:bg-cyan-600 transition-all duration-500 overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                        <span className="relative">استكشف كافة الشركاء</span>
                                        <ChevronDown className="relative w-6 h-6 group-hover:translate-y-1 transition-transform duration-300" />
                                    </button>
                                    
                                    <p className="mt-6 text-slate-400 font-bold text-sm tracking-wide">
                                        يوجد أكثر من {clients.length - visibleCount} شركاء آخرين
                                    </p>
                                </motion.div>
                            )}
                        </div>
                    )}
                </AnimatePresence>

                {/* --- تذييل القسم (Footer) --- */}
                {!isLoading && clients.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="mt-32 pt-12 border-t border-slate-100 flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700"
                    >
                        <div className="flex items-center gap-3 font-bold text-slate-400"><Award size={20}/> جودة معتمدة</div>
                        <div className="flex items-center gap-3 font-bold text-slate-400"><ShieldCheck size={20}/> أمان وموثوقية</div>
                        <div className="flex items-center gap-3 font-bold text-slate-400"><Building2 size={20}/> خبرة مؤسسية</div>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default OurClientsSection;