import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'أبار جروب | حفر وصيانة آبار وطلمبات أعماق', 
    
    short_name: 'أبار جروب', 
    
    description: 'متخصصون في حفر وصيانة آبار المياه الجوفية، توريد وتركيب طلمبات الأعماق (Shakti, Ferat, Grundfos,kurlar,poldap,kps)، حلول الطاقة الشمسية، والجسات الجيوفيزيائية في مصر.',
    
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0284c7', // لون العلامة التجارية (السماء/الماء)
    
    // تصنيفات الموقع لمساعدة المتاجر والمتصفحات
    categories: ['business', 'infrastructure', 'energy'],
    
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}