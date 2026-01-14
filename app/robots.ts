import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/service/',
        '/blog/',
        '/store/',
        '/about',
        '/contact',
        '/projects/', // تأكد من مطابقة الاسم (Project vs Projects) مع الـ Sitemap
      ],
      disallow: [
        '/api/',          // منع أرشفة ملفات الخلفية (Backend)
        '/admin/',        // منع أرشفة لوحة الإدارة
        '/cart',          // سلة المشتريات (محتوى متغير لا يفيد البحث)
        '/checkout',      // صفحات الدفع (حساسة وخصوصية)
        '/login',         // صفحات تسجيل الدخول
        '/register',      // صفحات التسجيل
        '/*?*',           // منع أرشفة روابط البحث والفلترة العشوائية لتجنب المحتوى المكرر
      ],
    },
    // ربط ملف خريطة الموقع الرسمي الذي أنشأناه ديناميكياً
    sitemap: 'https://abaargroup.org/sitemap.xml',
  }
}