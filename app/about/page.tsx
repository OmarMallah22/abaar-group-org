import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import AboutClient from './AboutClient';

// --- مكونات السيو (Metadata) لضمان الفهم السريع من جوجل ---
export const metadata: Metadata = {
    title: 'من نحن | أبار جروب - خبراء حفر الآبار والطاقة الشمسية في مصر',
    description: 'تعرف على أبار جروب، الشركة الرائدة في حفر وصيانة آبار المياه الجوفية وحلول الطاقة الشمسية المتكاملة منذ عام 1999. خبرة تتجاوز 25 عاماً في خدمة الأراضي المصرية.',
    alternates: { canonical: '/about' },
    openGraph: {
        title: 'أبار جروب - ريادة في حلول المياه والطاقة المستدامة',
        description: 'نروي المستقبل بإمكانيات اليوم. اكتشف تاريخنا وفريقنا القيادي.',
        images: ['/image/about.jpeg'],
    }
};

export default async function Page() {
    // جلب البيانات من السيرفر (SSR) لضمان ظهورها في الـ HTML الأولي
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

    return (
        <AboutClient 
            initialTeam={teamData || []} 
            initialStats={statsData} 
        />
    );
}