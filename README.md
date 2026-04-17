# Seziyy Portfolio - Modern Minimalist Portfolio

Modern ve minimalist bir portfolyo sitesi. Next.js 14, TypeScript, Tailwind CSS ve Framer Motion ile geliştirildi.

## ✨ Özellikler

### 🎨 Tasarım
- **Gece Teması**: Derin lacivert ve koyu mavi tonlarında profesyonel tasarım
- **Sarı Papatya Hakkımda Bölümü**: Canlı sarı ve turuncu tonlarında özel About section
- **Özel Cursor Efekti**: Framer Motion ile zarif ve parıltılı cursor takibi
- **Responsive Design**: Tüm cihazlarda mükemmel görünüm

### 🚀 Sayfalar ve Bileşenler
- **Ana Sayfa**: Dinamik Spotify Now Playing ve GitHub Activity widget'ları
- **Deneyimler**: Profesyonel geçmiş ve kariyerinizi sergileyebileceğiniz bölüm
- **Projeler**: Teknik projelerinizin detaylı sunumu
- **Blog**: Minimalist yazı listesi ve okuma deneyimi
- **Galeri**: Kategori filtreleme (UI/UX, İllüstrasyon, 3D) ve tam ekran lightbox
- **İletişim Formu**: Minimalist ve kullanıcı dostu iletişim formu

### 💫 Animasyonlar
- Framer Motion ile akıcı geçişler
- Hover efektleri ve micro-interactions
- Sayfa geçişlerinde smooth animasyonlar

## 🛠️ Teknolojiler

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Font**: Inter (Google Fonts)

## 📦 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build

# Production sunucusunu başlat
npm start
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## 🎯 Yapılandırma

### Renk Teması
Tailwind konfigürasyonunda özel renkler tanımlı:
- `night`: Gece teması renkleri (50-950 arası tonlar)
- `daisy`: Sarı papatya renkleri (50-900 arası tonlar)

### API Entegrasyonları
Spotify ve GitHub widget'ları için API endpoint'leri hazır. Kendi API anahtarlarınızı ekleyerek aktif hale getirebilirsiniz:

1. `.env.local` dosyası oluşturun
2. Gerekli API anahtarlarını ekleyin:
```env
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REFRESH_TOKEN=your_refresh_token

GITHUB_USERNAME=your_username
GITHUB_TOKEN=your_token
```

### Spotify Now Playing'i Canli Yapma
Spotify kartinin calismasi icin sadece client id/secret yetmez, refresh token da gerekli.

Refresh token nedir: Spotify'dan yeni access token almak icin kullanilan uzun omurlu bir anahtardir. Access token kisa sureli olur; refresh token ise onu yenilemek icin saklanir.

1. [Spotify Dashboard](https://developer.spotify.com/dashboard) uzerinde bir app olusturun.
2. Redirect URI olarak su adresi ekleyin:
	- `http://127.0.0.1:3000/callback`
3. Bu authorize URL'sini tarayicida acin (client id'yi degistirin):
	- `https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Fcallback&scope=user-read-currently-playing%20user-read-playback-state`
4. Login sonrasi adres cubugundaki `?code=...` degerini alin.
5. Kodu refresh token'a cevirmek icin proje icindeki yardimci script'i calistirin:
	- `node scripts/get-spotify-refresh-token.js`
6. Script, sizden authorization code'u ister ve refresh token'i ekrana basar.
7. `.env.local` dosyasina bu 3 degeri yazin:
	- `SPOTIFY_CLIENT_ID`
	- `SPOTIFY_CLIENT_SECRET`
	- `SPOTIFY_REFRESH_TOKEN`
8. Uygulamayi yeniden baslatin ve ana sayfada Spotify kartini kontrol edin.

Not: Projede `next.config.js` icindeki `output: 'export'` ayari statik cikti uretir. Bu modda `app/api/*` route'lari production'da calismaz. Canli Spotify verisi icin iki secenek vardir:

1. Siteyi Vercel gibi server-side route destekleyen bir ortama deploy etmek.
2. GitHub Pages'te kalacaksaniz Spotify endpoint'ini ayri bir serverless backend'de barindirip frontend'den o URL'e istek atmak.

## 📁 Proje Yapısı

```
seziyy.github.io/
├── app/
│   ├── blog/           # Blog sayfası
│   ├── experiences/    # Deneyimler sayfası
│   ├── gallery/        # Galeri sayfası
│   ├── projects/       # Projeler sayfası
│   ├── globals.css     # Global stiller
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Ana sayfa
├── components/
│   ├── AboutSection.tsx      # Hakkımda bileşeni
│   ├── ContactForm.tsx       # İletişim formu
│   ├── CustomCursor.tsx      # Özel cursor
│   ├── GitHubActivity.tsx    # GitHub widget
│   ├── Navbar.tsx            # Navigasyon
│   └── SpotifyNowPlaying.tsx # Spotify widget
├── public/             # Statik dosyalar
├── next.config.js      # Next.js konfigürasyonu
├── tailwind.config.ts  # Tailwind konfigürasyonu
└── tsconfig.json       # TypeScript konfigürasyonu
```

## 🎨 Özelleştirme

### İçerik Güncelleme
1. **Kişisel Bilgiler**: `app/page.tsx` ve `components/AboutSection.tsx` dosyalarını düzenleyin
2. **Deneyimler**: `app/experiences/page.tsx` içindeki `experiences` dizisini güncelleyin
3. **Projeler**: `app/projects/page.tsx` içindeki `projects` dizisini güncelleyin
4. **Blog**: `app/blog/page.tsx` içindeki `blogPosts` dizisini güncelleyin
5. **Galeri**: `app/gallery/page.tsx` içindeki `galleryItems` dizisini güncelleyin

### Renk Değişiklikleri
`tailwind.config.ts` dosyasından tema renklerini özelleştirebilirsiniz.

## 📝 Lisans

Bu proje kişisel kullanım için geliştirilmiştir.

## 🤝 Katkıda Bulunma

Önerileriniz ve katkılarınız için Issues açabilir veya Pull Request gönderebilirsiniz.

---

**Geliştirici**: Seziyy  
**İletişim**: [GitHub](https://github.com/seziyy)
