'use client';

import React, { useState, FormEvent, ChangeEvent, useEffect, useMemo } from 'react';
import { 
  MapPin, Phone, Mail, Clock, MessageSquare, ChevronDown, 
  ArrowLeft, Zap, CheckCircle
} from 'lucide-react'; 
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

/**
 * الواجهة البرمجية للخصائص (Props Interface)
 * لاستقبال البيانات من السيرفر (Server Component)
 */
interface ContactClientProps {
  initialConfig?: any;
}

// --- الثوابت وروابط التواصل الأساسية ---
const CONTACT_LINKS = {
  whatsapp: "https://wa.me/201211110240",
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://www.linkedin.com/company/abaargroupegy/",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/abaargroup?igsh=aGNnaWplaGRrMDl5",
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://www.facebook.com/share/1GkJntrBik/?mibextid=qi2Omg",
  youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || "https://www.youtube.com/channel/UCkRxwwv_7Q3zr17LQoYzBKg?sub_confirmation=1",
  pinterest: process.env.NEXT_PUBLIC_PINTEREST_URL || "https://www.pinterest.com/abaargroupegy/",
  twitter: process.env.NEXT_PUBLIC_X_URL || "https://x.com/abaar_group",
  tiktok: process.env.NEXT_PUBLIC_tiktok || "https://www.tiktok.com/@abaar_group?_r=1&_d=ef5fhigc76e6ec&sec_uid=MS4wLjABAAAAW6tt9vRDMELerVX8VWhfLimkz1f7SsHMYF17tHY_3n-TRbUqyLAxgKWP38qi5IQS&share_author_id=7461541408743195654&sharer_language=ar&source=h5_m&u_code=ef5fi88m6c0gde&timestamp=1766671355&user_id=7390646957821789190&sec_user_id=MS4wLjABAAAAlRh26u6Wvz3-ugoiwWW5ws_zBzQUD_tcklDAp_6hd7g8dcN4ZBncXjegqa024VFd&utm_source=whatsapp&utm_campaign=client_share&utm_medium=android&share_iid=7390646870919939845&share_link_id=a599dc59-735f-4b74-9f4b-a1401403509c&share_app_id=1233&ugbiz_name=Account&ug_btm=b6880%2Cb2878&social_share_type=5"
};

// --- بيانات الأيقونات الاجتماعية المحدثة ---
const socialData = [
  {
    id: "facebook",
    imgSrc: "/icons/facebook.png",
    label: "Facebook",
    href: CONTACT_LINKS.facebook,
    hoverClass: "hover:drop-shadow-[0_0_15px_rgba(24,119,242,0.8)]",
  },
  {
    id: "instagram",
    imgSrc: "/icons/instagram.png",
    label: "Instagram",
    href: CONTACT_LINKS.instagram,
    hoverClass: "hover:drop-shadow-[0_0_15px_rgba(228,64,95,0.8)]",
  },
  {
    id: "youtube",
    imgSrc: "/icons/youtube.png",
    label: "Youtube",
    href: CONTACT_LINKS.youtube,
    hoverClass: "hover:drop-shadow-[0_0_15px_rgba(255,0,0,0.8)]",
  },
  {
    id: "tiktok",
    imgSrc: "/icons/tik-tok.png",
    label: "Tiktok",
    href: CONTACT_LINKS.tiktok,
    hoverClass: "hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]",
  },
  {
    id: "linkedin",
    imgSrc: "/icons/lin-removebg-preview.png",
    label: "linkedin",
    href: CONTACT_LINKS.linkedin,
    hoverClass: "hover:drop-shadow-[0_0_15px_rgba(0,119,181,0.8)]",
  },
  {
    id: "X",
    imgSrc: "/icons/X-removebg-preview (1).png",
    label: "X",
    href: CONTACT_LINKS.twitter,
    hoverClass: "hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.5)]",
  },
  {
    id: "pinterest",
    imgSrc: "/icons/pinterest-removebg-preview.png",
    label: "pinterest",
    href: CONTACT_LINKS.pinterest,
    hoverClass: "hover:drop-shadow-[0_0_15px_rgba(189,8,28,0.8)]",
  },
];

const FORM_STATUS = { IDLE: 'idle', SENDING: 'sending', SUCCESS: 'success', ERROR: 'error' };

export default function ContactClient({ initialConfig }: ContactClientProps) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [formStatus, setFormStatus] = useState(FORM_STATUS.IDLE);
  const [services, setServices] = useState<{id: string, title: string}[]>([]);

  // البيانات المهيكلة المحلية كنسخة احتياطية
  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "أبار جروب لحفر الآبار والطاقة الشمسية",
    "telephone": initialConfig?.contact_phone || "01211110240",
    "email": initialConfig?.contact_email || "info@abaargroup.com",
    "url": "https://www.abaargroup.com/contact"
  }), [initialConfig]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await supabase.from("services").select("id, title").order("title", { ascending: true });
        if (data) setServices(data);
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };
    fetchServices();
  }, []);

  const validateForm = () => {
    const newErrors: Partial<typeof formData> = {};
    if (!formData.name.trim()) newErrors.name = 'الاسم مطلوب';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'بريد إلكتروني غير صحيح';
    if (!formData.subject) newErrors.subject = 'يرجى اختيار الخدمة';
    if (!formData.message.trim()) newErrors.message = 'الرسالة مطلوبة';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setFormStatus(FORM_STATUS.SENDING);
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || '', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setFormStatus(FORM_STATUS.SUCCESS);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else throw new Error();
    } catch { setFormStatus(FORM_STATUS.ERROR); }
    setTimeout(() => setFormStatus(FORM_STATUS.IDLE), 5000);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name as keyof typeof errors]) setErrors(prev => ({ ...prev, [e.target.name]: undefined }));
  };

  return (
    <main className="bg-slate-50 min-h-screen font-arabic pb-20" dir="rtl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* --- 1. Hero Section (Video Background) --- */}
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
            تواصل مع أبار جروب
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl"
          >
            تواصل <span className="text-emerald-400">معنا</span>
          </motion.h1>
          <p className="text-sky-100 text-lg md:text-2xl max-w-3xl mx-auto mt-6 font-medium opacity-90 leading-relaxed">
            خبراء حفر الآبار وحلول الطاقة الشمسية في خدمتكم على مدار الساعة
          </p>
        </div>
      </section>

      {/* --- 2. Main Content Section (Form & Info) --- */}
      <section className="max-w-7xl mx-auto px-6 -translate-y-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Side: نموذج إرسال البيانات */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <motion.div 
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-white p-8 md:p-16 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(8,112,184,0.1)] border border-slate-100 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-bl-[100px] -z-0 opacity-50" />
              <div className="relative z-10">
                <h2 className="text-3xl font-black text-slate-800 mb-8">ابدأ مشروعك معنا</h2>
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputField label="الاسم" name="name" value={formData.name} onChange={handleChange} error={errors.name} placeholder="أحمد محمد..." />
                    <InputField label="البريد الإلكتروني" name="email" value={formData.email} onChange={handleChange} error={errors.email} placeholder="example@mail.com" type="email" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputField label="رقم الهاتف" name="phone" value={formData.phone} onChange={handleChange} placeholder="+20 1xxx xxxx" type="tel" />
                    <div className="space-y-3">
                      <label className="text-sm font-black text-slate-700 mr-2">نوع الخدمة المطلوبة</label>
                      <div className="relative">
                        <select name="subject" value={formData.subject} onChange={handleChange} className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-sky-500 focus:bg-white outline-none appearance-none transition-all cursor-pointer text-slate-700 font-bold">
                          <option value="">اختر من القائمة</option>
                          {services.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
                          <option value="استفسار عام">استفسار عام</option>
                        </select>
                        <ChevronDown className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                      {errors.subject && <p className="text-red-500 text-xs mt-1 mr-2">{errors.subject}</p>}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-black text-slate-700 mr-2">تفاصيل رسالتك</label>
                    <textarea name="message" rows={5} value={formData.message} onChange={handleChange} className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-sky-500 focus:bg-white outline-none resize-none transition-all font-medium text-slate-700" placeholder="كيف يمكننا مساعدتك؟" />
                    {errors.message && <p className="text-red-500 text-xs mt-1 mr-2">{errors.message}</p>}
                  </div>

                  <AnimatePresence>
                    {formStatus === FORM_STATUS.SUCCESS && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="p-6 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center gap-4 border border-emerald-100">
                        <CheckCircle className="shrink-0" /> تم الإرسال بنجاح، سنتواصل معك قريباً.
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button type="submit" disabled={formStatus === FORM_STATUS.SENDING} className="w-full relative overflow-hidden bg-slate-900 text-white py-6 rounded-2xl text-xl font-black transition-all hover:bg-sky-600 disabled:bg-slate-300 shadow-xl shadow-slate-200 group">
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {formStatus === FORM_STATUS.SENDING ? 'جاري الإرسال...' : 'قدم طلبك الآن'}
                    </span>
                  </button>
                </form>
              </div>
            </motion.div>
          </div>

          {/* Info Side: قنوات التواصل ومعلومات المقر */}
          <div className="lg:col-span-5 order-1 lg:order-2 space-y-8">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-sky-950 text-white p-10 md:p-14 rounded-[3rem] shadow-2xl relative overflow-hidden">
              <Zap className="absolute -bottom-10 -left-10 w-48 h-48 text-white/5 rotate-12" />
              <h3 className="text-3xl font-black mb-10 border-r-4 border-emerald-500 pr-4">قنوات التواصل</h3>
              
              <div className="space-y-10">
                <InfoBox icon={<MapPin />} label="المقر الرئيسي" value={initialConfig?.office_address || "عمارة 250, شارع الشباب, محلية 7, التجمع الثالث, القاهرة."} />
                <InfoBox icon={<MapPin />} label="فرع الجيزة" value={initialConfig?.branch_address || "الرهاوي، منشأة القناطر، جيزة."} />
                
                <InfoBox 
                  icon={<Clock />} 
                  label="ساعات العمل" 
                  value={
                    <div className="space-y-4">
                      <div>
                        <p className="text-sky-300 text-sm mb-1 font-bold">فرع التجمع:</p>
                        <p className="text-white text-base leading-tight font-black">{initialConfig?.working_hours_main || "الأحد - الخميس (08:30 ص - 04:30 م)"}</p>
                      </div>
                      <div className="pt-2 border-t border-white/10">
                        <p className="text-sky-300 text-sm mb-1 font-bold">فرع الرهاوي:</p>
                        <p className="text-white text-base leading-tight font-black">{initialConfig?.working_hours_branch || "السبت - الأربعاء (08:00 ص - 05:00 م)"}</p>
                      </div>
                    </div>
                  } 
                />

                <InfoBox icon={<Phone />} label="الخط الساخن" value={initialConfig?.contact_phone || "01211110240"} isLink href={`tel:${initialConfig?.contact_phone || "01211110240"}`} />
                <InfoBox icon={<Mail />} label="البريد الإلكتروني" value={initialConfig?.contact_email || "info@abaargroup.com"} />
              </div>

              {/* --- قسم الأيقونات الاجتماعية المطور مع تأثيرات التوهج --- */}
              <div className="mt-16 pt-10 border-t border-white/10 text-center">
                <p className="font-black text-sky-300 mb-8 text-sm tracking-tighter uppercase">تابعنا على منصاتنا الاجتماعية</p>
                <div className="flex flex-wrap items-center justify-center gap-6">
                  {socialData.map((social) => (
                    <a
                      key={social.id}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className={`
                        relative w-12 h-12 flex items-center justify-center 
                        transition-all duration-300 ease-out p-1
                        hover:scale-125
                        ${social.hoverClass}
                      `}
                      aria-label={social.label}
                    >
                      <Image
                        src={social.imgSrc}
                        alt={social.label}
                        width={40}
                        height={40}
                        className="object-contain w-full h-full"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}

// --- المكونات المساعدة (Helper Components) لضمان نظافة الكود ---

function InputField({ label, name, value, onChange, error, placeholder, type = "text" }: any) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-black text-slate-700 mr-2">{label}</label>
      <input 
        type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
        className={`w-full p-5 bg-slate-50 rounded-2xl border-2 outline-none transition-all text-slate-700 font-bold ${error ? 'border-red-200 bg-red-50' : 'border-transparent focus:border-sky-500 focus:bg-white'}`}
      />
      {error && <p className="text-red-500 text-xs mt-1 mr-2 font-bold">{error}</p>}
    </div>
  );
}

function InfoBox({ icon, label, value, isLink, href }: any) {
  return (
    <div className="flex items-start gap-5 group">
      <div className="p-4 bg-sky-900 rounded-2xl text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-lg">
        {React.cloneElement(icon as React.ReactElement, { size: 24 })}
      </div>
      <div className="flex-1">
        <p className="text-sky-400 text-xs font-black mb-1 uppercase tracking-wider">{label}</p>
        {isLink ? (
          <a href={href} className="text-xl font-black hover:text-emerald-400 transition-colors ltr inline-block">{value}</a>
        ) : (
          <div className="font-black leading-tight text-white">{value}</div>
        )}
      </div>
    </div>
  );
}