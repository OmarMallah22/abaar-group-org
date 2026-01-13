import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import ProductContent from './ProductContent'; // سنقوم بإنشائه الآن

// جلب الـ Metadata ديناميكياً (بدون أخطاء)
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { data: product } = await supabase
    .from('products')
    .select('name, Description, image') // أضفنا image لتجنب خطأ TypeScript السابق
    .eq('id', params.id)
    .single();

  return {
    title: `${product?.name || 'منتج'} | أبار جروب`,
    description: product?.Description?.substring(0, 160) || "وصف المنتج في أبار جروب",
    openGraph: {
      images: [product?.image || '/og-image.jpg'],
    },
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  // جلب بيانات المنتج هنا وتمريرها للمكون العميل
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single();

  return <ProductContent product={product} params={params} />;
}