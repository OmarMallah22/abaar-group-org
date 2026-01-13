import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/service',
        '/blog',
        '/store',
        '/about',
        '/contact',
        '/project',
      ],
      disallow: [
        '/api/',          // ملفات الواجهة البرمجية الداخلية
        '/admin/',        // لوحة التحكم (إذا وجدت)
        '/*?*',           // منع أرشفة روابط البحث أو التصفية (Filter) لمنع التكرار
        '/cart',          // سلة المشتريات (لا قيمة لها في البحث)
        '/checkout',      // صفحات الدفع
      ],
    },
    // ربط ملف خريطة الموقع الرسمي الذي أنشأناه ديناميكياً
    sitemap: 'https://abaargroup.org/sitemap.xml',
  }
}