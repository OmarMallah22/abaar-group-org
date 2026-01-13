// app/about/page.tsx
import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import AboutClient from './AboutClient';

/**
 * 1. مكونات السيو (Metadata) لرفع التقييم إلى A+
 * تم تحسين الطول والكلمات المفتاحية لضمان الأرشفة المثالية
 */
export const metadata: Metadata = {
    // العنوان (58 حرفاً): يتضمن الكلمات المفتاحية الأساسية
    title: 'من نحن | أبار جروب لحفر وصيانة الآبار وتوريد الطاقة الشمسية',
    
    // الوصف (158 حرفاً): يغطي كافة جوانب الخدمة ويزيد من كثافة المحتوى النصي
    description: 'تعرف على أبار جروب، الشركة الرائدة في حفر وصيانة آبار المياه الجوفية وتوريد طلمبات الأعماق وحلول الطاقة الشمسية المتكاملة في مصر بخبرة تمتد منذ عام 1999.',
    
    // الكلمات المفتاحية لتسهيل تصنيف الصفحة
    keywords: [
        'أبار جروب', 
        'حفر آبار مياه مصر', 
        'صيانة آبار جوفية', 
        'توريد طلمبات أعماق', 
        'طاقة شمسية للآبار', 
        'تطهير آبار المياه'
    ],

    // توحيد الرابط الأصلي لمنع تكرار المحتوى وتقوية النطاق .org
    alternates: { 
        canonical: 'https://abaargroup.org/about' 
    },

    openGraph: {
        title: 'أبار جروب - ريادة في حلول المياه وتوريد الطاقة المستدامة',
        description: 'نروي المستقبل بإمكانيات اليوم. اكتشف تاريخنا وفريقنا المتخصص في حفر وصيانة الآبار.',
        url: 'https://abaargroup.org/about',
        siteName: 'أبار جروب',
        images: [
            {
                url: '/image/about.jpeg',
                width: 1200,
                height: 630,
                alt: 'فريق عمل أبار جروب لحفر الآبار',
            },
        ],
        locale: 'ar_EG',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'من نحن | أبار جروب لخدمات الآبار',
        description: 'خبراء حفر وصيانة الآبار وتوريد حلول الطاقة الشمسية في مصر.',
        images: ['/image/about.jpeg'],
    },
};

export default async function Page() {
    // 2. جلب البيانات من السيرفر (SSR) لضمان القراءة الفورية من عناكب البحث
    const { data: teamData } = await supabase
        .from('team_members')
        .select('*')
        .order('display_order', { ascending: true });

    const { data: configData } = await supabase.from('site_configuration').select('*');
    
    const config: any = {};
    configData?.forEach((item: any) => config[item.config_key] = item.config_value);

    const currentYear = new Date().getFullYear();
    const startYear = parseInt(config.experience_start_year) || 1999;
    
    const statsData = {
        years: `${currentYear - startYear}+`,
        projects: `${config.base_projects_count || 600}+`,
        clients: `${config.base_clients_count || 600}+`,
        solar: `${config.base_solar_stations_count || 150}+`
    };

    /**
     * 3. البيانات المهيكلة (JSON-LD) لتعريف "صفحة من نحن" برمجياً لجوجل
     */
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "mainEntity": {
            "@type": "Organization",
            "name": "أبار جروب",
            "url": "https://abaargroup.org",
            "logo": "https://abaargroup.org/image/icon.png",
            "description": "شركة متخصصة في حفر وصيانة آبار المياه وتوريد الطلمبات وحلول الطاقة الشمسية.",
            "address": {
                "@type": "PostalAddress",
                "addressCountry": "EG"
            }
        }
    };

    return (
        <>
            {/* حقن الـ Schema في رأس الصفحة */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            
            <AboutClient 
                initialTeam={teamData || []} 
                initialStats={statsData} 
            />
        </>
    );
}