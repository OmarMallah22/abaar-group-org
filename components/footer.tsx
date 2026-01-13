'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  MapPin, Phone, Mail, Send, ArrowUp, 
  Code2, MessageSquare, Lock 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePathname } from 'next/navigation';

// --- الثوابت وروابط التواصل الخاصة بالشركة ---
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

const navLinks = [
    { key: 'home', label: 'الرئيسية', href: '/' },
    { key: 'about', label: 'من نحن', href: '/about' },
    { key: 'service', label: 'خدماتنا', href: '/service' },
    { key: 'projects', label: 'المشاريع', href: '/project' },
    { key: 'store', label: 'المتجر', href: '/store' },
    { key: 'blog', label: 'المدونة', href: '/blog' },
    { key: 'contact', label: 'اتصل بنا', href: '/contact' },
];

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
    bgClass: "bg-black border border-white/10", 
    iconClass: "invert brightness-200 scale-75", 
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

const Footer = () => {
  const pathname = usePathname(); 
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // حل احترافي: تشفير البريد الإلكتروني ومنع الروبوتات من قراءته تماماً
  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // تجميع الإيميل برمجياً فقط عند الضغط (لا يوجد mailto صريح في الكود)
    const user = "info";
    const domain = "abaargroup.com";
    window.location.href = `mailto:${user}@${domain}`;
  };

  const renderSafeEmail = () => {
    return (
      <button 
        onClick={handleEmailClick}
        className="hover:text-emerald-500 transition-colors inline-flex items-center gap-0 text-sm"
        style={{ direction: 'ltr' }} // لضمان الترتيب الصحيح من اليسار لليمين
      >
        <span>info</span>
        <span>@</span>
        <span>abaargroup.com</span>
      </button>
    );
  };

// داخل الـ JSX في قسم تواصل معنا:
<li className="flex items-center gap-3 text-sm text-slate-400">
  <Mail className="w-5 h-5 shrink-0 text-green-500" />
  {renderSafeEmail()}
</li>

  return (
    <footer className="bg-[#020617] text-slate-300 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* العمود الأول: الهوية والتعريف */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <Image src="/image/black.png" alt="Abar Group" fill className="object-contain" />
              </div>
              <span className="text-xl font-bold text-white font-arabic">أبار جروب</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed font-arabic">
              أبار جروب شركة مصرية رائدة في حفر وصيانة وتأهيل آبار المياه الجوفية، وتقديم حلول متكاملة للطاقة الشمسية، مع الالتزام بأعلى معايير الجودة.
            </p>
           <div className="flex flex-wrap gap-4"> 
 {socialData.map((social) => (
  <a
    key={social.id}
    href={social.href}
    target="_blank"
    rel="noopener noreferrer"
    className={`
      w-10 h-10 rounded-full flex items-center justify-center 
      transition-all duration-300 hover:shadow-lg hover:-translate-y-1
      ${social.bgClass || ""} 
      ${social.hoverClass} group
    `}
  >
    <span className="sr-only">{social.label}</span>
    <Image 
      src={social.imgSrc} 
      alt={social.label} 
      width={22} 
      height={22} 
      className={`
        transition-all duration-300
        ${social.iconClass || "opacity-90 group-hover:opacity-100 brightness-110"}
        group-hover:scale-110
      `}
    />
  </a>
))}
</div>
          </div>

          {/* العمود الثاني: روابط سريعة */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white font-arabic">روابط سريعة</h3>
            <ul className="flex flex-col gap-2 font-arabic">
              {navLinks.map(({ key, href, label }) => {
                const active = pathname === href;
                return (
                  <li key={key}>
                    <Link
                      href={href}
                      className={`block px-4 rounded-xl text-sm font-bold transition-all duration-200 ${
                        active 
                          ? 'bg-emerald-500/10 text-emerald-500' 
                          : 'text-slate-400 hover:text-emerald-500 hover:bg-white/5'
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* العمود الثالث: خدماتنا */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white font-arabic">خدماتنا</h3>
            <ul className="space-y-3 font-arabic">
              {[
                'صيانة وتطهير ابار المياة الجوفية', 
                'توريد طلمبات و مواتير أعماق', 
                'توريد مواسير الآبار: سيملس وحديد',
                'توريد ألواح الطاقة الشمسية',
                'توريد إنفرترات الطاقة الشمسية'
              ].map((service) => (
                <li key={service}>
                  <Link
                    href="#"
                    className="text-slate-400 hover:text-blue-500 text-sm transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* العمود الرابع: التواصل والنشرة البريدية */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white font-arabic">تواصل معنا</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-slate-400 font-arabic">
                <MapPin className="w-5 h-5 shrink-0 text-green-500" />
                <span>القاهرة – جمهورية مصر العربية</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Phone className="w-5 h-5 shrink-0 text-green-500" />
                <span dir="ltr">+201211110240</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Mail className="w-5 h-5 shrink-0 text-green-500" />
                {renderSafeEmail()}
              </li>
            </ul>
          </div>
        </div>

        {/* الشريط السفلي: الحقوق والمطور */}
        <div className="border-t border-white/5 mt-5 pt-5 flex flex-col md:flex-row justify-center items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 w-64 
                              opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                              transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                <div className="bg-[#0f172a] border border-white/10 rounded-xl shadow-2xl p-3">
                  <h5 className="text-white font-bold text-xs text-center border-b border-white/5 pb-2 mb-2">Omar Mallah</h5>
                  <div className="space-y-1">
                    <a href="tel:01101040740" className="flex flex-row-reverse items-center gap-2 p-2 rounded-lg hover:bg-white/5 text-slate-300 text-xs">
                      <Phone size={12} className="text-emerald-500" /> 01101040740
                    </a>
                    <a href="https://wa.me/201101040740" target="_blank" className="flex flex-row-reverse items-center gap-2 p-2 rounded-lg hover:bg-white/5 text-slate-300 text-xs">
                      <MessageSquare size={12} className="text-green-500" /> واتساب مباشرة
                    </a>
                  </div>
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-[#0f172a]"></div>
              </div>

              <span className="flex items-center gap-2 text-xs text-slate-500 cursor-help">
                <Code2 size={14} className="text-green-500" />
                <span>تصميم وتطوير:</span>
                <strong className="text-slate-300 hover:text-green-400 transition-colors">Omar Mallah</strong>
              </span>
            </div>

            <Link href="/admin/login" className="text-slate-700 hover:text-slate-400 transition-colors">
              <Lock size={14} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;