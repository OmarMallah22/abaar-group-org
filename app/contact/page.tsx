// app/contact/page.tsx
import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import ContactClient from './ContactClient';

// 1. ميتاداتا محسنة للسيو لضمان ظهور احترافي في جوجل ومواقع التواصل
export const metadata: Metadata = {
  title: 'اتصل بنا | أبار جروب لصيانة الآبار والطاقة الشمسية',
  description: 'تواصل مع أبار جروب لخدمات حفر وصيانة الآبار الجوفية، تركيب الطلمبات، وحلول الطاقة الشمسية. نحن هنا للإجابة على استفساراتكم في كافة محافظات مصر.',
  keywords: ['اتصل بنا أبار جروب', 'حفر آبار في مصر', 'صيانة طلمبات آبار', 'عنوان شركة أبار جروب', 'رقم شركة حفر آبار'],
  alternates: { canonical: 'https://www.abaargroup.com/contact' },
  openGraph: {
    title: 'تواصل مع خبراء أبار جروب - حلول المياه والطاقة',
    description: 'فريقنا متاح للرد على استفساراتكم الفنية حول حفر الآبار وأنظمة الطاقة الشمسية.',
    url: 'https://www.abaargroup.com/contact',
    siteName: 'أبار جروب',
    images: [
      {
        url: '/image/contact-og.jpg', // تأكد من وجود صورة بهذا الاسم في مجلد public
        width: 1200,
        height: 630,
        alt: 'اتصل بنا - أبار جروب',
      },
    ],
    locale: 'ar_EG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'اتصل بنا | أبار جروب',
    description: 'خدمات حفر وصيانة الآبار والطاقة الشمسية في مصر.',
    images: ['/image/contact-og.jpg'],
  },
};

export default async function Page() {
  // 2. جلب بيانات الاتصال من السيرفر (SSR) لضمان ظهور الأرقام والعناوين في الـ HTML الأولي
  const { data: configData } = await supabase.from('site_configuration').select('*');
  
  const config: any = {};
  configData?.forEach((item: any) => config[item.config_key] = item.config_value);

  /**
   * 3. البيانات المهيكلة (JSON-LD)
   * تخبر جوجل أن هذا "نقطة اتصال" (ContactPoint) رسمية للشركة لتظهر في الـ Knowledge Panel
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "أبار جروب",
    "url": "https://www.abaargroup.com",
    "logo": "https://www.abaargroup.com/f.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": config.contact_phone || "+201211110240",
      "contactType": "technical support",
      "areaServed": "EG",
      "availableLanguage": ["Arabic", "English"]
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": config.office_address || "القاهرة والجيزة",
      "addressLocality": "Giza",
      "addressCountry": "EG"
    }
  };

  return (
    <>
      {/* سكريبت السيو الموجه لمحركات البحث */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* تمرير الإعدادات للمكون العميل لضمان سرعة العرض وعدم تكرار الطلبات */}
      <ContactClient initialConfig={config} />
    </>
  );
}