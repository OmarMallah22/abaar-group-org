// app/page.tsx
import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import HomeClient from './HomeClient';

// 1. ميتاداتا الصفحة الرئيسية (ممنوع وجود use client هنا)
export const metadata: Metadata = {
  title: 'أبار جروب | ريادة حفر وصيانة آبار المياه والطاقة الشمسية في مصر',
  description: 'أبار جروب هي الشركة الرائدة في حفر وصيانة الآبار الجوفية وتوريد حلول الطاقة الشمسية المتكاملة منذ عام 1999.',
  keywords: ['حفر آبار مياه', 'صيانة آبار جوفية', 'طلمبات أعماق', 'طاقة شمسية'],
  alternates: { canonical: 'https://www.abaargroup.com' },
  openGraph: {
    title: 'أبار جروب - خبراء حلول المياه والطاقة المستدامة',
    description: 'نروي المستقبل بإمكانيات اليوم.',
    url: 'https://www.abaargroup.com',
    siteName: 'أبار جروب',
    images: [{ url: '/image/home-og.jpg', width: 1200, height: 630, alt: 'أبار جروب' }],
    locale: 'ar_EG',
    type: 'website',
  },
};

export default async function Page() {
  // جلب البيانات في السيرفر وتمريرها للمكون العميل
  const { data: clientsData } = await supabase.from('our_clients').select('id, logo_url');
  const initialClients = (clientsData || []).filter(c => c.logo_url);

  return <HomeClient initialClients={initialClients} />;
}