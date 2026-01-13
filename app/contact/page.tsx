// app/contact/page.tsx
import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import ContactClient from './ContactClient';


export const metadata: Metadata = {
  // العنوان: تم تضمين (اتصل بنا، حفر، صيانة، توريد، طاقة شمسية)
  title: 'اتصل بنا | أبار جروب لحفر وصيانة الآبار وتوريد الطاقة الشمسية',
  
  // الوصف: صياغة واقعية تزيد من كثافة المحتوى النصي وتجذب عناكب البحث.
  description: 'تواصل مع أبار جروب لخدمات حفر وصيانة الآبار الجوفية، توريد طلمبات الأعماق، وتركيب محطات الطاقة الشمسية في مصر. فريقنا الهندسي متاح للإجابة على كافة استفساراتكم.',
  
  keywords: [
    'اتصل بنا أبار جروب', 
    'حفر آبار في مصر', 
    'صيانة طلمبات آبار', 
    'توريد مستلزمات الآبار', 
    'رقم شركة حفر آبار', 
    'أسعار حفر الآبار'
  ],

  // توحيد الرابط الأصلي (Canonical) لتقوية النطاق الرسمي .org.
  alternates: { 
    canonical: 'https://abaargroup.org/contact' 
  },

  openGraph: {
    title: 'تواصل مع خبراء أبار جروب - حلول المياه وتوريد الطاقة',
    description: 'فريق أبار جروب متاح للرد على استفساراتكم حول حفر وصيانة الآبار وأنظمة الطاقة الشمسية المتكاملة.',
    url: 'https://abaargroup.org/contact',
    siteName: 'أبار جروب',
    images: [
      {
        url: '/image/contact-og.jpg',
        width: 1200,
        height: 630,
        alt: 'اتصل بنا - أبار جروب لحفر الآبار',
      },
    ],
    locale: 'ar_EG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'اتصل بنا | أبار جروب لخدمات الآبار',
    description: 'خبراء حفر وصيانة الآبار وتوريد حلول الطاقة الشمسية في مصر.',
    images: ['/image/contact-og.jpg'],
  },
};

export default async function Page() {
  // 2. جلب بيانات الاتصال من السيرفر (SSR) لضمان الأرشفة الفورية للبيانات الرسمية
  const { data: configData } = await supabase.from('site_configuration').select('*');
  
  const config: any = {};
  configData?.forEach((item: any) => config[item.config_key] = item.config_value);

  /**
   * 3. البيانات المهيكلة (JSON-LD) المتقدمة
   * تعريف "نقطة اتصال" (ContactPoint) و "نشاط تجاري محلي" لزيادة الثقة لدى جوجل.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "أبار جروب",
    "url": "https://abaargroup.org",
    "logo": "https://abaargroup.org/image/icon.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": config.contact_phone || "+201211110240",
      "contactType": "technical support",
      "areaServed": "EG",
      "availableLanguage": ["Arabic", "English"]
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": config.office_address || "التجمع الثالث، القاهرة",
      "addressLocality": "Cairo",
      "addressCountry": "EG"
    }
  };

  return (
    <>
      {/* سكريبت السيو للبيانات المهيكلة */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* تمرير الإعدادات للمكون العميل لضمان سرعة الاستجابة */}
      <ContactClient initialConfig={config} />
    </>
  );
}