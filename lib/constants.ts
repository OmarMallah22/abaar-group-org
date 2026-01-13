export const SOCIAL_LINKS = {
  // استخدام process.env والتأكد من وجود القيم
  whatsapp: `https://wa.me/2${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''}`,
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || '',
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '',
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || '',
  youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || '',
  pinterest: process.env.NEXT_PUBLIC_PINTEREST_URL || '',
  x: process.env.NEXT_PUBLIC_X_URL || '',
};

export const CONTACT_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';