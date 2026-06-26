# Claude Code Prompt — Admin Dashboard

Aşağıdaki metni Claude Code'a kopyalayıp yapıştır.

---

## PROMPT (Kopyalanacak Kısım)

---

Sen bir senior full-stack Next.js geliştiricisisin. Aşağıdaki mevcut projeye sıfırdan bir admin yönetim paneli kuracaksın.

## PROJE HAKKINDA

Bu proje bir akademisyenin (Doç. Dr. Ahmet Ali Süzen) kişisel web sitesidir. Next.js 14 (App Router), TypeScript, Tailwind CSS kullanılmaktadır. Mevcut veriler statik TypeScript dosyalarında tutulmaktadır:

- `data/publications.ts` → Akademik yayınlar (~96 kayıt, `makale | bildiri | kitap` türleri)
- `data/press.ts` → Basın görselleri (19 adet, `/public/images/press/basin-01.jpg` formatında)
- `data/trainings.ts` → Eğitim katalogu (8 kayıt)
- `data/stats.ts` → İstatistik kartları (3 kayıt)
- `data/about.ts` → Hakkında sayfası metinleri

Mevcut sayfalar:
- `app/akademi/page.tsx` → Yayın listesi (`PublicationList` bileşeni)
- `app/basinda-biz/page.tsx` → Basın galerisi (`PressGallery`, `PressMarquee` bileşenleri)
- `components/press/PressGallery.tsx` → Galeri bileşeni
- `components/academy/PublicationList.tsx` → Yayın listesi bileşeni
- `components/layout/` → Navbar vs.

Navbar'da zaten bir arama simgesi mevcuttur.

## YAPILACAK İŞLER (SIRAYLA UYGULA)

### ADIM 1: Gerekli Paketleri Kur

```bash
npm install prisma @prisma/client bcryptjs jose
npm install -D @types/bcryptjs
npx prisma init --datasource-provider sqlite
```

### ADIM 2: Prisma Şeması Oluştur

`prisma/schema.prisma` dosyasını aşağıdaki gibi yaz:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Publication {
  id                 String   @id @default(cuid())
  baslik             String
  yazarlar           String
  dergiVeyaKonferans String
  yil                Int
  tur                String   // "makale" | "bildiri" | "kitap"
  doiUrl             String?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}

model PressItem {
  id          String   @id @default(cuid())
  tur         String   // "medya" | "haber"
  baslik      String
  aciklama    String?
  imageUrl    String   // medya için yüklenen dosya yolu, haber için kapak görseli URL'i
  haberUrl    String?  // sadece "haber" türünde dolu olur
  siraNo      Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model SiteContent {
  id    String @id
  value String
  updatedAt DateTime @updatedAt
}
```

### ADIM 3: .env.local Güncelle

`.env.local` dosyasına ekle:
```
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="aas-admin-gizli-anahtar-2024"
```

### ADIM 4: Prisma Client Singleton Oluştur

`lib/prisma.ts` dosyasını oluştur (Next.js hot-reload için singleton pattern kullan):

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### ADIM 5: Seed Scripti Yaz ve Çalıştır

`prisma/seed.ts` dosyasını yaz. Bu script mevcut statik TypeScript verilerini veritabanına aktarır:

- `data/publications.ts` içindeki tüm yayınları `Publication` tablosuna ekle
- `data/press.ts` içindeki 19 görseli `PressItem` tablosuna ekle (tur: "medya", imageUrl: "/images/press/basin-XX.jpg" formatında)
- `data/about.ts` içindeki `bioParagraphs` ve `expertiseAreas` metinlerini `SiteContent` tablosuna ekle
- `data/stats.ts` içindeki istatistikleri `SiteContent` tablosuna ekle

`package.json`'a ekle:
```json
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
}
```

Sonra çalıştır:
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### ADIM 6: Auth Sistemi Kur

`lib/auth.ts` dosyasını oluştur:

```typescript
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const ADMIN_USERNAME = 'aas'
const ADMIN_PASSWORD = 'aas123'
const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
const COOKIE_NAME = 'admin_token'

export async function signIn(username: string, password: string): Promise<boolean> {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = await new SignJWT({ username, role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(secret)
    
    cookies().set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    })
    return true
  }
  return false
}

export async function signOut() {
  cookies().delete(COOKIE_NAME)
}

export async function getSession() {
  try {
    const token = cookies().get(COOKIE_NAME)?.value
    if (!token) return null
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch {
    return null
  }
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    return null
  }
  return session
}
```

### ADIM 7: Admin Middleware Ekle

`middleware.ts` dosyasını proje root'una oluştur:
- `/admin` ile başlayan tüm path'leri `/admin/login` dışında koru
- Cookie yoksa `/admin/login`'e redirect et

### ADIM 8: API Route'ları Oluştur

#### `app/api/admin/auth/route.ts`
- POST: username + password al, `signIn` çağır, 200 veya 401 döndür
- DELETE: `signOut` çağır

#### `app/api/admin/publications/route.ts`
- GET: Tüm yayınları döndür (filtreleme: tur, arama: baslik/yazarlar)
- POST: Yeni yayın ekle (validation ile)

#### `app/api/admin/publications/[id]/route.ts`
- PUT: Yayın güncelle
- DELETE: Yayın sil

#### `app/api/admin/press/route.ts`
- GET: Tüm basın öğelerini döndür
- POST: Yeni öğe ekle

#### `app/api/admin/press/[id]/route.ts`
- PUT: Güncelle
- DELETE: Sil

#### `app/api/admin/upload/route.ts`
- POST: FormData ile resim dosyası kabul et, `/public/uploads/press/` klasörüne kaydet, dosya yolunu döndür
- Desteklenen formatlar: JPG, PNG, WEBP
- Maksimum boyut: 10MB

#### `app/api/admin/site-content/route.ts`
- GET: Tüm site içeriklerini döndür
- PUT: İçerik güncelle (id + value)

### ADIM 9: Herkese Açık Sayfaları Veritabanından Okuyacak Şekilde Güncelle

**`app/akademi/page.tsx`**: 
- `data/publications.ts` import'unu kaldır
- `prisma.publication.findMany({ orderBy: { yil: 'desc' } })` ile DB'den oku
- `export const dynamic = 'force-dynamic'` ekle (her istek canlı veri getirsin)

**`components/academy/PublicationList.tsx`**: Props'tan publication listesi alsın

**`app/basinda-biz/page.tsx`**:
- `data/press.ts` import'unu kaldır
- `prisma.pressItem.findMany({ orderBy: { siraNo: 'asc' } })` ile DB'den oku
- `export const dynamic = 'force-dynamic'` ekle

**`components/press/PressGallery.tsx`**: 
- Hem "medya" hem "haber" türlerini destekle
- Haber türündeyse: kapak görseli göster + üzerine gelince "Habere Git" butonu çıksın + tıklayınca `haberUrl`'e git
- Medya türündeyse: mevcut galeri davranışı korunsun

**`components/press/PressMarquee.tsx`**: DB'den gelen medya öğelerini kullan

### ADIM 10: Admin Dashboard UI Oluştur

Tasarım gereksinimleri:
- Koyu tema (arka plan: `#0a0f1e` veya benzeri derin lacivert/siyah)
- Sol kenar çubuk (sidebar) navigasyon
- Glassmorphism efektler (yarı saydam paneller)
- Framer Motion animasyonları (Proje zaten kullanıyor)
- Google Fonts: proje mevcut fontunu koru
- Lucide React ikonları (proje zaten kullanıyor)

#### `app/admin/login/page.tsx` — Giriş Sayfası
- Ekranın ortasında şık bir login kartı
- Koyu arka plan, cam efekti kart
- Kullanıcı adı + şifre alanları
- "Giriş Yap" butonu, loading state'i ile
- Hatalı girişte kırmızı hata mesajı
- Başarılı girişte `/admin` a yönlendir

#### `app/admin/layout.tsx` — Admin Layout
- Tüm admin sayfalarını saracak
- Sol sidebar (sabit): Logo/avatar alanı, menü linkleri (Ana Sayfa, Yayınlar, Basın & Medya, Site İçeriği), çıkış butonu
- Sağ içerik alanı (scrollable)
- Server component olarak session kontrol et, yoksa redirect et
- Sidebar'da aktif sayfa highlight

#### `app/admin/page.tsx` — Dashboard Ana Sayfa
- Karşılama mesajı: "Hoş geldiniz, Dr. Süzen"
- İstatistik kartları (4 adet): Toplam Yayın sayısı, Makale sayısı, Bildiri sayısı, Basın Öğesi sayısı (canlı DB'den)
- Son eklenen 5 yayın (tablo)
- Son eklenen 3 basın öğesi (küçük grid)

#### `app/admin/yayinlar/page.tsx` — Yayın Yönetimi

**ÜST KISIM:**
- "Yeni Yayın Ekle" butonu (sağ üst)
- Arama input'u (baslik veya yazarlara göre)
- Tür filtresi: Tümü / Makale / Bildiri / Kitap (buton grubu)
- Toplam yayın sayısı

**TABLO:**
- Sütunlar: Başlık (truncated), Yazarlar (truncated), Yıl, Tür (badge), DOI (var/yok ikonu), İşlemler
- Her satırda: Düzenle ikonu + Sil ikonu
- Silme işlemi: confirm modal açsın
- Sayfalama: Sayfa başına 20 kayıt

**YENİ YAYIN / DÜZENLEME MODALI:**
Modal içeriği dinamik olarak seçilen türe göre değişsin:

Ortak alanlar (her türde):
- Tür seçimi: `<select>` → makale / bildiri / kitap
- Başlık: `<textarea>` (geniş)
- Yazarlar: `<input>`
- Yıl: `<input type="number">`

Ek alan (opsiyonel, her türde):
- DOI / Kaynak Linki: `<input>` (opsiyonel) — label "DOI veya Erişim Linki"

Tür "makale" seçiliyse ekstra göster:
- Dergi / Konferans Adı: `<input>`

Tür "bildiri" seçiliyse ekstra göster:
- Dergi / Konferans Adı: `<input>` (label: "Konferans Adı ve Yeri")

Tür "kitap" seçiliyse ekstra göster:
- Yayınevi: `<input>` (label: "Yayınevi / Yayıncı")

Modal altı: İptal + Kaydet butonları, kayıt sırasında loading spinner

#### `app/admin/basin/page.tsx` — Basın & Medya Yönetimi

**ÜST KISIM:**
- "Yeni Öğe Ekle" butonu
- Tür filtresi: Tümü / Medya Görseli / Haber

**GRID GÖRÜNÜMÜ:**
- 4'lü grid kart görünümü
- Her kartta: küçük önizleme görseli, başlık, tür badge'i, düzenle ve sil ikonları
- Haber kartlarında haberUrl ikonu (dış link)

**YENİ ÖĞE / DÜZENLEME MODALI:**

Ortak alanlar:
- Tür seçimi (radio veya toggle): "📷 Medya Görseli" veya "📰 Haber"

"Medya Görseli" seçiliyse:
- Başlık: `<input>` (opsiyonel)
- Açıklama: `<textarea>` (opsiyonel)
- Görsel Yükleme: Drag & drop destekli file input alanı. Yüklenen resim önizlemesi göster.

"Haber" seçiliyse:
- Başlık: `<input>` (zorunlu) — haber başlığı
- Haber URL'i: `<input>` (zorunlu) — tam haber linki
- Kapak Görseli URL'i: `<input>` (opsiyonel) — harici bir görsel URL'i yapıştırılabilir VEYA "Dosya Yükle" seçeneği

**SİLME:**
- Onay modalı: "Bu öğeyi silmek istediğinizden emin misiniz?"
- Silinen medya görseli için `/public/uploads/press/` klasöründen de dosyayı sil (varsa)

#### `app/admin/site-icerigi/page.tsx` — Site İçeriği Yönetimi

Bölümler halinde düzenle, her bölüm collapsible kart olsun:

**"Hakkında" Bölümü:**
- Bio paragrafları (3 ayrı `<textarea>`)
- Uzmanlık alanları (etiket listesi, ekle/sil)

**"İstatistikler" Bölümü:**
- 3 istatistik kartı: değer (sayı) + son ek ("+") + etiket — inline düzenlenebilir

**"Eğitimler" Bölümü:**
- Her eğitim için: başlık, açıklama, ikon adı

Her bölümde "Değişiklikleri Kaydet" butonu ayrı ayrı bulunsun.

### ADIM 11: Navbar'a Admin İkonu Ekle

`components/layout/` klasöründeki Navbar bileşenini güncelle:

- Arama ikonunun hemen yanına `User` Lucide ikonu ekle
- İkona tıklayınca:
  - Kullanıcı giriş yapmışsa: küçük dropdown aç → "Admin Panel" linki + "Çıkış Yap" butonu
  - Kullanıcı giriş yapmamışsa: küçük login modal aç (aşağıda açıklanıyor)
- Login modal şık bir overlay ile orta/sağ üstte açılsın:
  - Başlık: "Yönetici Girişi"
  - Kullanıcı adı input
  - Şifre input
  - Giriş Yap butonu
  - Hatalı girişte kırmızı uyarı
  - Başarılıda `/admin`'e yönlendir

Login state kontrolü için: Client component'te `/api/admin/session` endpoint'i oluştur (GET → session varsa 200, yoksa 401). Navbar mount'unda bunu çağır, kullanıcı ikonunun görünümünü buna göre değiştir (giriş yapılmışsa ikon farklı renk/stil olsun).

### ADIM 12: Haber Görünümünü Siteye Yansıt

`components/press/PressGallery.tsx` bileşenini güncelle:

- Props olarak `PressItem[]` alsın (DB'den gelen)
- **Medya öğesi** (tur === "medya"): Mevcut galeri davranışı korunsun (lightbox veya büyütme)
- **Haber öğesi** (tur === "haber"): 
  - Kart şeklinde göster (galeri öğelerinden farklı/ayırt edici tasarım)
  - Kapak görseli (imageUrl) varsa büyük kapak olarak göster, yoksa placeholder
  - Üzerinde kırmızı/renkli "HABER" badge'i
  - Başlık metni altta
  - Tüm karta tıklayınca `haberUrl`'i yeni sekmede aç
  - Hover'da güzel bir scale/overlay animasyonu

## KRİTİK GEREKSİNİMLER

1. **TypeScript**: Her yerde strict TypeScript kullan, `any` tipi kullanma
2. **Error Handling**: Tüm API route'larında try-catch ve uygun HTTP status kodları
3. **Form Validation**: Zorunlu alanlar boş bırakılamaz, client-side validation ekle
4. **Loading States**: Tüm async işlemlerde (kaydet, sil, yükle) loading göster
5. **Toast Notifications**: Başarılı/hatalı işlem sonrası toast mesajı (CSS ile basit bir implementasyon yap, ek kütüphane kullanma)
6. **Responsive**: Admin paneli de mobile'da kullanılabilir olmalı (sidebar hamburger menüye dönüşmeli)
7. **`export const dynamic = 'force-dynamic'`**: Veritabanından okuyan tüm public sayfalara ekle
8. **Prisma Generate**: Her migration sonrası `npx prisma generate` çalıştır
9. **Dosya Yükleme**: `/public/uploads/press/` klasörünü oluştur (yoksa), server-side'da `fs.writeFile` ile kaydet
10. **Mevcut Bileşenler Korunsun**: `PressMarquee`, `FloatingBooks`, `ScholarLinks` gibi mevcut bileşenler çalışmaya devam etmeli

## UYGULAMA SIRASI

1. Paket kurulumu
2. Prisma schema + migrate + seed
3. lib/prisma.ts + lib/auth.ts
4. Middleware
5. API route'ları (auth, publications, press, upload, site-content)
6. Admin login sayfası
7. Admin layout + sidebar
8. Admin dashboard (ana sayfa)
9. Admin yayınlar sayfası
10. Admin basın sayfası  
11. Admin site içeriği sayfası
12. Public sayfaları DB'den okuyacak şekilde güncelle (akademi, basinda-biz)
13. Navbar'a admin ikonu + login modal ekle
14. Haber görünümü PressGallery güncellemesi
15. Test: her CRUD işlemini test et, public sayfaların doğru yansıdığını doğrula

---

**NOT**: Tüm bu adımları baştan sona sırayla uygula. Bir adımı bitirmeden diğerine geçme. Her adım sonrası kodun derlenmekte olduğundan emin ol (`npx tsc --noEmit`).
