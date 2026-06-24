export const siteConfig = {
  name: 'Ahmet Ali Süzen',
  title: 'Doç. Dr.', 
  role: [
    'Siber Güvenlik Uzmanı',
    'Akademisyen',
    'Bilgisayar Mühendisliği Öğretim Üyesi',
  ],
  university: 'Isparta Uygulamalı Bilimler Üniversitesi', 
  department: 'Bilgisayar Mühendisliği', 
  email: 'ahmetsuzen@isparta.edu.tr', 
  social: {
    linkedin: 'https://www.linkedin.com/in/ahmet-ali-s%C3%BCzen-2306a7167/',
    instagram: 'https://www.instagram.com/dr.ahmetalisuzen/',
    scholar: 'https://scholar.google.com/citations?user=9C6l9i4AAAAJ&hl=tr',
  },
  verkosisUrl: 'https://www.verkosis.com',
  url: 'https://www.ahmetalisuzen.com',
} as const;

export type SiteConfig = typeof siteConfig;
