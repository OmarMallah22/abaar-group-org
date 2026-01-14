import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://abaargroup.org'

  // 1. جلب كافة البيانات من Supabase بالتوازي لضمان أقصى سرعة استجابة
  const [
    { data: services },
    { data: articles },
    { data: products },
    { data: categories },
    { data: subcategories },
    { data: projects } // إضافة المشاريع السابقة
  ] = await Promise.all([
    supabase.from('services').select('slug, updated_at'),
    supabase.from('articles').select('slug, updated_at').eq('status', 'published'),
    supabase.from('products').select('id, created_at'),
    supabase.from('categories_du').select('id'),
    supabase.from('subcategories_du').select('id, category_id'),
    supabase.from('projects').select('slug, updated_at') // نفترض وجود جدول مشاريع
  ])

  // --- أ: الروابط الثابتة (Static Routes) مع إضافة صفحات الثقة ---
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/service`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/store`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/projects`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 }, // صفحة معرض المشاريع
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 }, // سياسة الخصوصية
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 }, // الشروط والأحكام
  ]

  // --- ب: روابط الخدمات الديناميكية (الأولوية عالية لأنها جوهر العمل) ---
  const serviceRoutes: MetadataRoute.Sitemap = (services || []).map((item) => ({
    url: `${baseUrl}/service/${encodeURIComponent(item.slug)}`,
    lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.9,
  }))

  // --- ج: روابط المدونة (تحديثات يومية/أسبوعية تجذب جوجل) ---
  const blogRoutes: MetadataRoute.Sitemap = (articles || []).map((item) => ({
    url: `${baseUrl}/blog/${encodeURIComponent(item.slug)}`,
    lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // --- د: روابط المشاريع (Case Studies) ---
  const projectRoutes: MetadataRoute.Sitemap = (projects || []).map((item) => ({
    url: `${baseUrl}/projects/${encodeURIComponent(item.slug)}`,
    lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // --- هـ: روابط المنتجات (المتجر) ---
  const productRoutes: MetadataRoute.Sitemap = (products || []).map((item) => ({
    url: `${baseUrl}/product/${item.id}`,
    lastModified: item.created_at ? new Date(item.created_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // --- و: روابط التصنيفات والتصنيفات الفرعية ---
  const categoryRoutes: MetadataRoute.Sitemap = (categories || []).map((item) => ({
    url: `${baseUrl}/store/${item.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  const subCategoryRoutes: MetadataRoute.Sitemap = (subcategories || []).map((item) => ({
    url: `${baseUrl}/store/${item.category_id}/${item.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.5,
  }))

  // دمج كافة الروابط في مصفوفة واحدة ضخمة لتقديمها لجوجل
  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...blogRoutes,
    ...projectRoutes,
    ...productRoutes,
    ...categoryRoutes,
    ...subCategoryRoutes,
  ]
}