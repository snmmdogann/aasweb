# Ahmet Ali Süzen — Kişisel Web Sitesi

Dr. Öğr. Üyesi Ahmet Ali Süzen için kişisel akademik / siber güvenlik web sitesi.

> ⚠️ Unvan teyidi: Bazı kayıtlarda unvan **"Doç. Dr."** olarak geçiyor. Yayına almadan önce `data/site-config.ts` içindeki `title` alanını doğru unvanla güncelleyin. Tüm taslak içerikler `[DÜZENLE]` yorumuyla işaretlidir.

## Teknolojiler

- **Next.js 14+** (App Router) + **TypeScript** (strict mode)
- **Tailwind CSS** (özel design token'lar)
- **Framer Motion** (animasyon)
- **react-hook-form + zod** (form / validasyon)
- **Resend** (iletişim formu e-posta gönderimi)
- **lucide-react** (ikonlar)
- **Inter** (next/font/google)

## Kurulum

```bash
npm install
npm run dev
```

Geliştirme sunucusu: <http://localhost:3000>

### Ortam değişkenleri

`.env.example` dosyasını `.env.local` olarak kopyalayın ve doldurun:

```bash
cp .env.example .env.local
```

| Değişken | Açıklama |
|---|---|
| `CONTACT_RECEIVER_EMAIL` | İletişim formundan gelen mesajların gönderileceği e-posta adresi. |

#### İletişim formu (FormSubmit.co) kurulumu — ücretsiz, anahtar gerekmez

E-posta gönderimi [FormSubmit.co](https://formsubmit.co) ile yapılır: **kayıt yok, API anahtarı yok, ücretsiz.**

1. `.env.local` içine mesajların düşmesini istediğiniz adresi yazın:
   `CONTACT_RECEIVER_EMAIL=ornek@adresiniz.com`
2. Formdan ilk mesajı gönderin. FormSubmit, bu adrese bir **aktivasyon (onay) e-postası** yollar.
3. O e-postadaki bağlantıya **bir kez** tıklayın. Bu adımdan sonra tüm mesajlar doğrudan gelir.

> `CONTACT_RECEIVER_EMAIL` ayarlı değilken form, kullanıcıya nazik bir hata mesajı gösterir (API route 500 döner).

## Komutlar

| Komut | Açıklama |
|---|---|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Production derlemesi |
| `npm run start` | Production sunucusu |
| `npm run lint` | ESLint |
| `npm run format` | Prettier ile biçimlendirme |

## Klasör Yapısı

```
app/                  # App Router rotaları
  layout.tsx          # Kök layout, Inter font, global metadata
  globals.css         # Tailwind direktifleri + temel stiller
  page.tsx            # Anasayfa
  hakkimda/           # /hakkimda
  akademi/            # /akademi
  basinda-biz/        # /basinda-biz
  iletisim/           # /iletisim
  api/contact/route.ts# İletişim formu POST endpoint'i (FAZ 6)
components/           # UI bileşenleri (alanlara göre gruplu)
  layout/ home/ about/ academy/ press/ contact/ ui/
data/                 # Tüm metin/veri — component'lerden ayrı
  site-config.ts      # Site geneli yapılandırma
  stats.ts            # İstatistik kartları
  trainings.ts        # Kurumsal eğitimler
  publications.ts     # Akademik yayınlar
  press.ts            # Basın kayıtları
lib/                  # Yardımcılar & custom hook'lar
  utils.ts            # cn() + ortak sınıflar
  validations.ts      # zod şemaları
  email.ts            # FormSubmit.co e-posta gönderimi
  useCountUp.ts       # Sayaç animasyonu hook'u
  useInViewOnce.ts    # IntersectionObserver hook'u
  useTypewriter.ts    # Daktilo (rol rotasyonu) hook'u
  useReducedMotion.ts # Hareketi azalt tercihini merkezi okuma
public/images/        # Görseller
```

## İçerik Mimarisi

Gerçek içerikler (biyografi, yayın listesi, basın haberleri, fotoğraflar, kesin istatistikler) geldiğinde yalnızca `data/*.ts` dosyalarını güncellemek yeterlidir — bileşen kodu değişmez.

## Docker ile Yayınlama

> Docker yalnızca siteyi bir sunucuya **yayınlarken** gerekir. Yerel geliştirme için (`npm run dev`) Docker gerekmez.

Proje, çok aşamalı (multi-stage) bir `Dockerfile` ve `output: 'standalone'` ile minimal bir imaj üretecek şekilde hazırdır.

```bash
# 1) Ortam değişkenleri için bir .env oluşturun
cp .env.example .env   # içine CONTACT_RECEIVER_EMAIL değerini yazın

# 2) İmajı derleyin ve çalıştırın
docker compose up --build
```

Site `http://localhost:3000` üzerinde yayınlanır. Tek başına imaj derlemek için:

```bash
docker build -t ahmet-ali-suzen-web .
docker run -p 3000:3000 --env-file .env ahmet-ali-suzen-web
```
