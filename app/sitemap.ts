import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://abaargroup.org'

  // 1. جلب كافة البيانات الفنية من Supabase بالتوازي لضمان السرعة
  const [
    { data: services },
    { data: articles },
    { data: products },
    { data: categories },
    { data: subcategories }
  ] = await Promise.all([
    supabase.from('services').select('slug, updated_at'),
    supabase.from('articles').select('slug, updated_at').eq('status', 'published'),
    supabase.from('products').select('id, created_at'),
    supabase.from('categories_du').select('id'),
    supabase.from('subcategories_du').select('id, category_id')
  ])

  // --- أ: الروابط الثابتة (Static Routes) ---
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/service`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/store`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]

  // --- ب: روابط الخدمات الديناميكية ---
  const serviceRoutes: MetadataRoute.Sitemap = (services || []).map((item) => ({
    url: `${baseUrl}/service/${encodeURIComponent(item.slug)}`,
    lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  // --- ج: روابط المدونة (المقالات) ---
  const blogRoutes: MetadataRoute.Sitemap = (articles || []).map((item) => ({
    url: `${baseUrl}/blog/${encodeURIComponent(item.slug)}`,
    lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // --- د: روابط المنتجات التفصيلية ---
  const productRoutes: MetadataRoute.Sitemap = (products || []).map((item) => ({
    url: `${baseUrl}/product/${item.id}`,
    lastModified: item.created_at ? new Date(item.created_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // --- هـ: روابط أقسام المتجر الرئيسية ---
  const categoryRoutes: MetadataRoute.Sitemap = (categories || []).map((item) => ({
    url: `${baseUrl}/store/${item.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // --- و: روابط الأقسام الفرعية للمتجر ---
  const subCategoryRoutes: MetadataRoute.Sitemap = (subcategories || []).map((item) => ({
    url: `${baseUrl}/store/${item.category_id}/${item.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  // دمج كافة الروابط في مصفوفة واحدة ضخمة
  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...blogRoutes,
    ...productRoutes,
    ...categoryRoutes,
    ...subCategoryRoutes,
  ]
}