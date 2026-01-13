'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Slider from 'react-slick';

// استيراد أيقونات المكتبة (حافظت على جميع اختياراتك وأضفت ما يلزم للـ SEO)
import { 
  CheckCircle2, 
  Drill,
  Trophy, 
  Users, 
  Calendar, 
  Droplet,
  ArrowLeft,
  Droplets,
  Settings,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';

// استيراد ملف الاتصال بـ Supabase
import { supabase } from '@/lib/supabase';

// ملفات تنسيق السلايدر الأساسية
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import StartAction from '@/components/StartAction'; 

/**
 * 1. الواجهات البرمجية (Interfaces) - تم الإبقاء عليها بالكامل كما في كودك الأصلي
 */
interface Client {
  id: string | number;
  logo_url: string;
}

interface StatItem {
  number: string;
  label: string;
  icon: React.ReactNode;
}

interface ReasonItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

/**
 * 2. هوك مخصص لمراقبة ظهور العنصر على الشاشة (Intersection Observer)
 */
const useOnScreen = (ref: React.RefObject<HTMLElement | null>, rootMargin = '0px') => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, rootMargin]);
  return isVisible;
};

export default function HomePage() {
  // --- الحالات البرمجية (States) - تم استعادة openIndex وكل الحالات الأصلية ---
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientsLoading, setClientsLoading] = useState(true);

  // --- المراجع (Refs) ---
  const statsRef = useRef<HTMLDivElement>(null);
  const clientsRef = useRef<HTMLElement>(null);
  const isStatsVisible = useOnScreen(statsRef);
  const isClientsVisible = useOnScreen(clientsRef);

  // 1. بيانات الخدمات السريعة (السكشن العلوي) - تم الإبقاء على مسمياتك
  const servicesList = [
    "صيانة وتطهير ابار المياه جوفية",
    "توريد طلمبات و مواتير أعماق",
    "توريد مواسير الآبار: سيملس وحديد",
    "كابلات طلمبات اعماق",
    "توريد ألواح الطاقة الشمسية",
    "الدراسات الجيوفيزيائية وجسات التربة",
    "تصوير الآبار تليفزيونيًا",
    "توريد إنفرترات الطاقة الشمسية",
    "حفر آبار المياه",
    "مواسير بلاستيتك UPVC"
  ];

  // 2. الإحصائيات (الأرقام الكبيرة)
  const stats: StatItem[] = [
    { number: "+563", label: "مشروع مكتمل", icon: <Trophy className="w-6 h-6" /> },
    { number: "+610", label: "عميل راضٍ", icon: <Users className="w-6 h-6" /> },
    { number: "+26", label: "سنة خبرة", icon: <Calendar className="w-6 h-6" /> },
    { number: "+563", label: "بئر محفور", icon: <Droplet className="w-6 h-6" /> },
  ];

  // 3. إعدادات السلايدر لشركاء النجاح
 const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 5, // للشاشات الكبيرة
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  rtl: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
      }
    },
    {
      breakpoint: 768, // الجوال
      settings: {
        slidesToShow: 2, // عرض لوجوين فقط ليكون حجمهم كبيراً وواضحاً
        centerMode: true, // لإظهار جزء من اللوجو التالي (يعطي إيحاء بالسحب)
        centerPadding: '20px',
      }
    }
  ]
};

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setClientsLoading(true);
        const { data: clientsData, error: clientsError } = await supabase
          .from('our_clients')
          .select('id, logo_url');

        if (clientsError) {
          console.error("خطأ في جلب الشركاء:", clientsError.message);
          setClients([]);
        } else {
          const validClients = (clientsData || []).filter(c => c.logo_url);
          setClients(validClients);
        }
      } catch (err) {
        console.error("خطأ غير متوقع:", err);
      } finally {
        setClientsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  return (
    <main className="min-h-screen bg-white" dir="rtl">
      
      {/* ===================================================================================
          إضافة تقنية (JSON-LD) لتحسين محركات البحث - تعريف الشركة لجوجل
          =================================================================================== 
      */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "أبار جروب",
            "url": "https://abaargroup.org",
            "logo": "https://abaargroup.org/image/icon.png",
            "description": "شركة أبار جروب هي الرائدة في حفر وصيانة آبار المياه وتوريد طلمبات الأعماق وأنظمة الطاقة الشمسية في مصر.",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+201000000000",
              "contactType": "customer service"
            }
          })
        }}
      />

      {/* ===================================================================================
          1. سكشن الهيرو (Hero Section) - الفيديو والترحيب
          =================================================================================== 
      */}
      <section className="relative h-screen w-full overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onContextMenu={(e) => e.preventDefault()}
            className="w-full h-full object-cover"
          >
            <source src="/image/home-page-banner.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="absolute inset-0 bg-white/20 z-10" />

        <div className="relative z-20 h-full flex items-center justify-center text-center px-6">
          <div className="max-w-4xl flex flex-col items-center">
            {/* تحسين العنوان الرئيسي (H1) ليشمل الكلمات المفتاحية الناقصة في التقرير */}
            <h1 className="text-[32px] md:text-[55px] lg:text-[70px] font-black text-black leading-tight mb-3 pt-5 animate-in fade-in slide-in-from-bottom-4 duration-1000">
             آبار جروب  حفر وصيانة الآبار وتوريد حلول الطاقة الشمسية المتكاملة
            </h1>

            <p className="text-[18px] md:text-[24px] text-black max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
معاك خطوة بخطوة في صيانة وتطهير بئرك؛ بنصور البير من الداخل عشان نحدد المشكلة بدقة ونعالجها، ونوفر لك كل مستلزمات الآبار من مواسير وكابلات وطلمبات أصلية بتعيش معاك.       </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#f9f9f9] to-transparent z-20" />
      </section>


      {/* ===================================================================================
          2. سكشن الخدمات الأول (نظرة عامة) - ستايل الصور والنصوص
          =================================================================================== 
      */}
      <section className="py-16 md:py-28 bg-[#f9f9f9] overflow-hidden relative">
        {/* خلفية متحركة دقيقة */}
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-blue-500/20 to-transparent rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 -right-1/2 w-full h-full bg-gradient-to-l from-green-500/20 to-transparent rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-1/2 left-1/2 w-full h-full bg-gradient-to-t from-blue-500/20 to-transparent rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* عنوان القسم: تم دمج كلمة "توريد" و "حفر" و "صيانة" لزيادة الكثافة */}
          <div className="text-center mb-16 md:mb-20 relative">
            <h2 className="text-4xl md:text-5xl font-bold text-[#222] mb-4 inline-block relative z-10">
              خدمات حفر وصيانة الآبار وتوريد الطلمبات
              <span className="absolute -bottom-2 left-0 w-full h-3 bg-blue-100 -z-10 skew-x-12"></span>
            </h2>
            <div className="w-24 h-1.5 bg-[#1a1a1a] mx-auto rounded-full mt-4"></div>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            
            {/* 1. الجانب البصري */}
            <div className="w-full lg:w-1/2 relative order-1 lg:order-1 group perspective-1000">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] aspect-[4/3] transform transition-all duration-700 group-hover:rotate-y-6 group-hover:scale-105">
                <Image 
                  src="/image/hint.jpeg" 
                  alt="خدمات شركة آبار جروب المتميزة في حفر الآبار وتوريد الطلمبات" 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              <div className="absolute -bottom-8 -right-8 md:-bottom-12 md:-right-12 w-48 h-48 md:w-64 md:h-64 border-4 border-blue-500/20 rounded-full z-0 animate-spin-slow pointer-events-none"></div>
              <div className="absolute -top-8 -left-8 md:-top-12 md:-left-12 w-32 h-32 md:w-48 md:h-48 border-4 border-green-500/20 rounded-full z-0 animate-spin-slow animation-delay-2000 animation-reverse pointer-events-none"></div>
            </div>

            {/* 2. الجانب النصي */}
            <div className="w-full lg:w-1/2 text-right order-2 lg:order-2">
              <div className="mb-8 relative">
                <h3 className="text-3xl md:text-4xl font-bold text-[#1f2937] mb-6 leading-snug">
                  ريادة في حلول <br /> 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a365d] to-[#22c55e]">
                    المياه الجوفية والطاقة الشمسية
                  </span>
                </h3>
                <div className="w-20 h-[3px] bg-gradient-to-r from-[#1a365d] to-[#22c55e] mb-8"></div>
              </div>
              
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10 opacity-90">
                نفخر بكوننا شركة متخصصة في <strong>توريد طلمبات المياه</strong> وحفر وصيانة الآبار الجوفية بخبرة تتجاوز 26 عاماً، حيث نقدم لعملائنا حلولاً متكاملة تضمن أعلى كفاءة.
              </p>

              {/* القائمة الشبكية للخدمات */}
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4 mb-12">
                {servicesList.map((service, index) => (
                  <li 
                    key={index} 
                    className="flex items-center gap-4 text-gray-800 font-bold group p-3 rounded-xl transition-all duration-300 hover:bg-white hover:shadow-md hover:-translate-x-1"
                  >
                    <div className="bg-green-100 p-2 rounded-full group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="text-[16px]">
                      {service}
                    </span>
                  </li>
                ))}
              </ul>

              <Link 
                href="/service" 
                className="group relative inline-flex items-center gap-3 px-10 py-4 bg-[#1a1a1a] text-white text-lg font-bold rounded-full overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                <span className="relative z-10 flex items-center gap-2">
                  اكتشف خدماتنا الكاملة
                  <ArrowLeft className="w-5 h-5 group-hover:translate-x-[-5px] transition-transform" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================================
          سكشن (جديد) - حل مشكلة "المحتوى الضعيف" (Thin Content)
          هذا القسم يزيد عدد الكلمات في الصفحة ويغطي الكلمات المفتاحية الناقصة
          =================================================================================== 
      */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
              لماذا تختار أبار جروب لحلول المياه والري في مصر؟
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              نحن نوفر خدمات شاملة تبدأ من دراسة التربة وصولاً إلى <strong>توريد ألواح الطاقة الشمسية</strong> وتشغيل الآبار بأعلى كفاءة ممكنة.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-blue-50 rounded-3xl border border-blue-100">
              <ShieldCheck className="w-12 h-12 text-blue-600 mb-6" />
              <h4 className="text-xl font-bold mb-4">جودة التوريد والحفر</h4>
              <p className="text-gray-600 leading-loose">
                نلتزم بـ <strong>توريد طلمبات و مواتير أعماق</strong> من كبرى العلامات التجارية العالمية، لنضمن لعملائنا أعلى معايير الجودة وأداءً فائقاً يمتد لسنوات طويلة.
              </p>
            </div>
            <div className="p-8 bg-green-50 rounded-3xl border border-green-100">
              <Zap className="w-12 h-12 text-green-600 mb-6" />
              <h4 className="text-xl font-bold mb-4">أنظمة الطاقة الشمسية</h4>
              <p className="text-gray-600 leading-loose">
                نوفر أحدث حلول <strong>الطاقة الشمسية</strong> لتشغيل طلمبات الأعماق، مما يقلل تكاليف الكهرباء والديزل بنسبة 100% ويحافظ على البيئة.
              </p>
            </div>
            <div className="p-8 bg-orange-50 rounded-3xl border border-orange-100">
              <Settings className="w-12 h-12 text-orange-600 mb-6" />
              <h4 className="text-xl font-bold mb-4">صيانة دورية وتطهير</h4>
              <p className="text-gray-600 leading-loose">
                لا يقتصر عملنا على الحفر، بل نمتلك أحدث أجهزة <strong>تصوير الآبار تليفزيونيًا</strong> للقيام بأعمال الصيانة الوقائية والتطهير الشامل.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* ===================================================================================
          3. سكشن الإحصائيات (Stats)
          =================================================================================== 
      */}
      <section ref={statsRef} className="relative py-32 bg-white overflow-hidden font-arabic">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-br from-slate-50/80 to-transparent -skew-x-12 transform origin-top-right -z-0"></div>
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-100/30 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-10 left-10 opacity-[0.03] select-none pointer-events-none">
          <Droplets size={500} className="text-blue-900" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="relative bg-[#1a365d] rounded-[3rem] p-10 md:p-20 shadow-2xl overflow-hidden">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/20 blur-[100px] rounded-full animate-pulse"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-500/10 blur-[100px] rounded-full"></div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col items-center text-center group">
                  <div className="mb-6 p-5 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/20 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-500 shadow-xl">
                    {React.cloneElement(stat.icon as React.ReactElement, {
                      className: "w-10 h-10 text-blue-300 group-hover:text-white transition-colors"
                    })}
                  </div>
                  <span className="text-5xl md:text-7xl font-black text-white mb-3 tracking-tighter">
                    {stat.number}
                  </span>
                  <div className="h-1.5 w-10 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full mb-4 group-hover:w-20 transition-all duration-500"></div>
                  <span className="text-blue-100 text-sm md:text-base font-bold uppercase tracking-[0.2em] opacity-80 group-hover:opacity-100 transition-opacity">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ===================================================================================
          5. سكشن شركاء النجاح (Success Partners Slider)
          =================================================================================== 
      */}
      <section ref={clientsRef} className="py-16 md:py-32 bg-[#fcfcfd] overflow-hidden border-t border-slate-100">
  <div className="container mx-auto px-4">
    <div className="text-center mb-10 md:mb-20">
      <h2 className="text-2xl md:text-5xl font-black text-slate-800 mb-4 leading-tight">
        شركاء النجاح في خدمات حفر الآبار
      </h2>
      <div className="w-16 h-1.5 bg-gradient-to-r from-sky-600 to-green-500 mx-auto rounded-full" />
      <p className="text-base md:text-xl text-slate-500 mt-6 max-w-2xl mx-auto leading-relaxed px-4">
        نفخر بالثقة التي منحنا إياها كبار العملاء في مختلف قطاعات <strong>توريد وحفر الآبار</strong> في مصر.
      </p>
    </div>

    <div className="px-2 relative">
      {clientsLoading ? (
        <div className="flex flex-col items-center py-16 gap-4">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-sky-600 rounded-full animate-spin" />
          <p className="text-slate-400 font-bold text-sm">جاري جلب بيانات الشركاء...</p>
        </div>
      ) : isClientsVisible && clients.length > 0 ? (
        <div className="success-partners-wrapper">
          <Slider {...sliderSettings}>
            {clients.map((client) => (
              <div key={client.id} className="px-2 md:px-4 outline-none group cursor-pointer">
                {/* تعديل الارتفاع والعرض ليكون متناسقاً على الجوال */}
                <div className="relative h-20 md:h-32 w-full rounded-2xl p-4 border border-slate-100 transition-all duration-300 shadow-sm hover:shadow-md bg-white flex items-center justify-center">
                  <Image
                    src={client.logo_url}
                    alt={`لوجو شريك نجاح شركة أبار جروب - ${client.id}`}
                    fill
                    // تحسين: إلغاء الـ grayscale على الجوال ليكون اللوجو واضحاً فوراً
                    className="object-contain p-3 md:p-5 grayscale-0 md:grayscale md:opacity-60 transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                    sizes="(max-width: 768px) 40vw, 20vw"
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>
      ) : (
        <div className="text-center py-10 text-red-400 text-sm font-bold border-2 border-dashed border-red-50 rounded-2xl">
          تعذر تحميل بيانات الشركاء حالياً.
        </div>
      )}
    </div>
  </div>
</section>

      {/* ===================================================================================
          سكشن (جديد) - لزيادة كمية الكلمات وتحسين الـ SEO في نهاية الصفحة
          =================================================================================== 
      */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">حلول مياه متكاملة لكافة المحافظات</h2>
          <div className="max-w-4xl mx-auto space-y-6 text-gray-700 text-lg leading-loose">
            <p>
              تتميز شركة <strong>أبار جروب</strong> بقدرتها على الوصول إلى أصعب المواقع الجغرافية في مصر لتنفيذ مشاريع <strong>حفر آبار المياه</strong>. نحن لا نقوم فقط بالحفر، بل نقدم استشارات فنية متقدمة حول أفضل أنواع <strong>طلمبات المياه</strong> التي تناسب عمق البئر وملوحة المياه في منطقتك.
            </p>
            <p>
              بفضل فريقنا الهندسي المتخصص، نجحنا في تحويل مئات المزارع للعمل بـ <strong>الطاقة الشمسية</strong> بالكامل، مما ساهم في زيادة الإنتاجية وتقليل التكاليف التشغيلية. التزامنا بتقديم خدمات <strong>صيانة الآبار</strong> الدورية يضمن لك عمراً افتراضياً أطول للمعدات وحماية استثماراتك المائية.
            </p>
          </div>
        </div>
      </section>

      <StartAction />
    </main>
  );
}