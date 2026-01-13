import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// هذا السطر للتأكد من أن المفاتيح تعمل (سيظهر في الكونسول إذا كانت مفقودة)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("تحذير: مفاتيح Supabase مفقودة! تأكد من ملف .env وإعادة تشغيل السيرفر.");
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');