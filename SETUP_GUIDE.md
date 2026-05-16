# 🛠 STORIED SETUP GUIDE
## MacBook Pro — Sıfırdan Çalışır Hale Getirme

> **Bu rehber kim için yazıldı?**
> Yeni bir MacBook Pro'da, terminal/komut satırı deneyimi sınırlı bir geliştirici için.
> Her komut açıklamalı. Her hesap neden gerekli, anlatılmış.
> Sıralı git — atlama yapma. Her adımdan sonra "Tamam mı?" diye duracak şekilde tasarlandı.

> **Toplam süre tahmini:** 4-6 saat (mola dahil).
> Bunu **tek seferde** yapma. Bölüm bölüm git.

---

## 📋 GENEL BAKIŞ

Storied'in çalışması için 4 büyük şey gerekiyor:

1. **MacBook'ta development environment** (Node.js, Git, terminal araçları)
2. **8 farklı servisin hesabı** (Supabase, Stripe, Anthropic, OpenAI, Resend, Vercel, GitHub, PostHog)
3. **Antigravity** (kod yazacak AI agent)
4. **Storied projesinin lokal kopyası** (docs + boş klasör)

Hepsini bu sırayla kuracağız. Atlamak yok.

---

## 💰 TOPLAM MALİYET ÖNGÖRÜSÜ

İlk lansman için (ilk 50 kullanıcıya kadar):

| Servis | Aylık | Notlar |
|---|---|---|
| Supabase | $0 | Free tier yeterli |
| Vercel | $0 | Free tier (Hobby) yeterli |
| Stripe | $0 | Sadece satıştan %2.9 + 30¢ komisyon alır |
| OpenAI (Whisper) | ~$5-15 | Kullanım bazlı, kullanıcı sayısına göre |
| Anthropic (Claude) | ~$10-30 | Kullanım bazlı |
| Resend | $0 | Free tier (3.000 email/ay) yeterli |
| PostHog | $0 | Free tier (1M event/ay) yeterli |
| Sentry | $0 | Free tier yeterli |
| GitHub | $0 | Free tier yeterli |
| **TOPLAM AYLIK** | **~$15-45** | Kullanım bazlı |

**Bir kerelik ödemeler:**
- Domain (storied.app): ~$15-30/yıl — şimdilik **almıyoruz**, sonra alacağız
- Google Workspace (hello@storied.app email için): ~$6/ay — domain aldıktan sonra

**İlk 50 müşteriden gelir:** 50 × $29 = $1,450
**İlk 6 ay tahmini gider:** ~$200-300

Yani: **karlı olacaksın.** Test sonrası bile.

---

# BÖLÜM 1: MACBOOK KURULUMU
## (1-1.5 saat sürer)

## 1.1 — Terminal'i Tanı

**Ne yapıyoruz:** macOS'taki Terminal'i açıyoruz. Bu siyah ekran tüm kurulumun yapılacağı yer.

**Nasıl:**
1. Spotlight'ı aç: `Cmd + Space`
2. Yaz: `Terminal`
3. Enter'a bas

Açıldığında şöyle bir şey görürsün:
```
orkun@MacBook-Pro ~ %
```

Bu **prompt**. Buraya komutları yazacağız. Asla **panik yapma** — terminal sadece komut bekliyor, bir şey kıramaz.

**✅ Tamam mı?** Terminal açıksa devam.

---

## 1.2 — Xcode Command Line Tools Yükle

**Ne yapıyoruz:** Apple'ın geliştirici araçlarını yüklüyoruz. Bu olmadan hiçbir şey çalışmaz.

**Komut:**
```bash
xcode-select --install
```

**Ne olacak:**
- Bir popup açılır, "Install" tıkla
- 10-20 dakika sürer (internet hızına göre)
- Bittiğinde kendi kendine kapanır

**Doğrulama:**
```bash
xcode-select -p
```
Bu komut bir yol göstermeli (örnek: `/Library/Developer/CommandLineTools`). Eğer hata verirse, yükleme tamamlanmamış demektir — bekle.

**✅ Tamam mı?** Yukarıdaki komut hatasız çalışırsa devam.

---

## 1.3 — Homebrew Yükle

**Ne yapıyoruz:** macOS için "paket yöneticisi" kuruyoruz. Homebrew, App Store gibi ama terminal için. Sonradan Node, Git gibi araçları bununla yükleyeceğiz.

**Komut (tek satır, tamamını kopyala):**
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Ne olacak:**
- Sistem şifrenı isteyebilir (Mac'ine giriş yaptığın şifre — yazdığında **görünmez**, bu normal)
- 5-15 dakika sürer
- Sonunda PATH'e ekleme talimatları verir

**Sonunda çıkan komutları çalıştır:**
M1/M2/M3 Mac'lerde (yeni Mac'in büyük ihtimalle bunlardan biri):
```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

**Doğrulama:**
```bash
brew --version
```
Şöyle bir çıktı görmelisin: `Homebrew 4.x.x`

**✅ Tamam mı?** `brew --version` çalışıyorsa devam.

---

## 1.4 — Git Yükle

**Ne yapıyoruz:** Versiyon kontrol sistemi kuruyoruz. Tüm kod değişikliklerin kaydını tutacak.

**Komut:**
```bash
brew install git
```

**Doğrulama:**
```bash
git --version
```
Şöyle bir şey görmelisin: `git version 2.x.x`

**Git'i Yapılandır:**
```bash
git config --global user.name "Orkun"
git config --global user.email "your-email@gmail.com"
git config --global init.defaultBranch main
```

⚠️ İkinci satırdaki email'i kendi email'inle değiştir.

**✅ Tamam mı?** Git çalışıyorsa devam.

---

## 1.5 — Node.js Yükle

**Ne yapıyoruz:** JavaScript runtime kuruyoruz. Next.js bununla çalışır.

**Komut:**
```bash
brew install node@22
```

Bu Node v22'yi yükler (Storied bunu istiyor).

**PATH'e ekle:**
```bash
echo 'export PATH="/opt/homebrew/opt/node@22/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

**Doğrulama:**
```bash
node --version
```
`v22.x.x` görmeli.

```bash
npm --version
```
`10.x.x` görmeli.

**✅ Tamam mı?** Hem `node` hem `npm` çalışıyorsa devam.

---

## 1.6 — Yararlı Mac Araçları Yükle (Opsiyonel ama Önerilir)

**Ne yapıyoruz:** Hayatını kolaylaştıracak küçük araçlar:

```bash
# JSON dosyalarını terminalde okumak için
brew install jq

# Görsel git arayüzü (opsiyonel)
brew install --cask github

# Daha iyi terminal (zsh shortcuts için)
brew install zsh-autosuggestions
```

**✅ Tamam mı?** Hatasız çalıştıysa devam.

---

## 1.7 — VS Code Yükle (Kod Editörü)

**Ne yapıyoruz:** Kod yazmak/okumak için profesyonel bir editör kuruyoruz. Antigravity'nin önerdiği editörlerden biri.

**Yükleme:**
1. https://code.visualstudio.com/download adresine git
2. "Apple Silicon" sürümünü indir (yeni Mac'in bunu istiyor)
3. `.zip` dosyasını çift tıkla, açılan `Visual Studio Code.app`'i `Applications` klasörüne sürükle
4. Aç

**Önerilen eklentileri yükle (sol kenar çubuğundan Extensions, Cmd+Shift+X):**
- **ESLint** — kod hatalarını yakalar
- **Prettier** — kodu otomatik formatlar
- **Tailwind CSS IntelliSense** — Tailwind'i hızlandırır
- **GitLens** — Git geçmişini görselleştirir
- **TypeScript Vue Plugin (Volar)** — TypeScript desteği

**✅ Tamam mı?** VS Code açıldıysa devam.

---

## 1.8 — Antigravity Yükle

**Ne yapıyoruz:** Storied'i inşa edecek AI ajanı yüklüyoruz.

**Yükleme (Antigravity'nin official sitesi/install dokümantasyonu üzerinden):**

Antigravity yükleme komutu (resmi belgelerden alınmalı — şu an genel komut):
```bash
# Anthropic'in Antigravity dokümanını kontrol et:
# https://docs.anthropic.com/antigravity
```

⚠️ **Not:** Antigravity'nin spesifik yükleme komutları zaman içinde değişiyor. Resmi dokümandan en güncel adımları takip et.

**Yapılması gerekenler:**
1. Antigravity hesabı oluştur (Anthropic'in sitesinden)
2. CLI aracını yükle
3. Login ol: `antigravity login` (ya da benzer komut)
4. API key'ini al, terminale ekle

**✅ Tamam mı?** Antigravity komutunu terminalde çağırabiliyorsan devam.

---

## 🎉 BÖLÜM 1 TAMAM!

Mac'in artık geliştirici bir makine. Şimdi mola ver. Kahve iç. 30 dakika sonra Bölüm 2'ye geç.

---

# BÖLÜM 2: HESAP AÇMA TURU
## (2-3 saat sürer — siparişle açma + email doğrulama dahil)

Bu bölümde 8 servise hesap açacağız. **Hepsi ücretsiz başlangıçta.**

⚠️ **Önemli ipucu:** Her hesap için aynı email kullan (örneğin `orkun@gmail.com`). Şifreler için **1Password** veya benzeri bir şifre yöneticisi kullan — her servis için **farklı** şifre.

## 2.1 — GitHub Hesabı (varsa atla)

**Neden:** Kodumuzu burada saklayacağız.

**Adımlar:**
1. https://github.com/signup adresine git
2. Email'ini gir
3. Şifre seç (güçlü olsun — şifre yöneticine kaydet)
4. Username seç (örnek: `orkunsabaci`, `orkunbuilds`)
5. Email doğrula

**SSH anahtarı ekle (terminal'in GitHub'a "merhaba" demesi için):**

Terminal'de:
```bash
ssh-keygen -t ed25519 -C "your-email@gmail.com"
```

Sorulan her şeye Enter (default'lar iyi).

Sonra anahtarı kopyala:
```bash
pbcopy < ~/.ssh/id_ed25519.pub
```

GitHub'da:
1. Sağ üstte profil → Settings → SSH and GPG keys
2. "New SSH key"
3. Title: "MacBook Pro"
4. Key alanına yapıştır (yukarıdaki `pbcopy` zaten clipboard'a koydu — sadece Cmd+V)
5. "Add SSH key"

**Doğrulama:**
```bash
ssh -T git@github.com
```
Şöyle bir cevap görmeli: `Hi orkunsabaci! You've successfully authenticated...`

**✅ Tamam mı?**

---

## 2.2 — Supabase Hesabı

**Neden:** Database + Auth + Audio storage + Realtime — hepsi tek serviste.

**Adımlar:**
1. https://supabase.com adresine git
2. "Start your project" → GitHub ile sign in (en kolay)
3. Authorize Supabase
4. İlk organizasyonu oluştur:
   - Name: `Storied`
   - Type: `Personal`
   - Plan: `Free` (şimdilik)

**Yeni proje oluştur:**
1. "New Project"
2. Name: `storied-production`
3. Database password: **GÜÇLÜ bir şifre seç** — bunu **şifre yöneticine kaydet**, kaybedersen DB'ye erişemezsin
4. Region: `Europe (Ireland) (eu-west-1)` ← Sen Dublin'desin, bu en yakın
5. Pricing: `Free`
6. "Create new project"
7. **2-3 dakika bekle** — proje setup oluyor

**Önemli: API Anahtarlarını Kaydet**

Proje hazır olunca, sol menüden:
- Settings → API
- Şu değerleri bir nota kaydet (şimdi VS Code'da yeni bir dosya aç, `storied-secrets.txt` olarak kaydet — bu dosyayı **asla** Git'e ekleme):

```
SUPABASE_URL: https://xxxxx.supabase.co
SUPABASE_ANON_KEY: eyJ... (uzun bir key)
SUPABASE_SERVICE_ROLE_KEY: eyJ... (başka uzun bir key — bu GİZLİ)
```

⚠️ **Service role key**'i kimseyle paylaşma. Database'in tam yetkisi onda.

**✅ Tamam mı?** Supabase dashboard görünüyorsa devam.

---

## 2.3 — Stripe Hesabı

**Neden:** Ödeme almak için.

**Adımlar:**
1. https://stripe.com adresine git
2. "Start now" → Email + şifre
3. Email doğrula
4. **Business profile** doldur:
   - Country: `Ireland`
   - Business structure: `Individual / sole proprietor` (şimdilik)
   - Business address: senin adresin
   - Tax ID: boş bırak (sole trader registration yapana kadar)
   - Industry: `SaaS / software`
   - Website: `https://storied.app` (henüz almadık ama yaz — sonra güncellersin)
   - Bank account: senin **İrlanda banka hesabın** (Stripe payout'lar buraya gelecek)
   - Phone: senin numaran

**TEST MODE'da Başla:**

Stripe ilk başta otomatik **test mode**'da olacak. Bu iyi — gerçek para alamadan önce her şeyi test edebilirsin.

Sağ üstte "Test mode" toggle'ı var. Açık tut.

**Ürünü Oluştur:**

1. Sol menü → "Products"
2. "Add product"
3. Name: `Storied — Storytelling 30-Day Practice`
4. Description: `Daily storytelling practice. Thirty practices. The methods you know, finally practiced.`
5. **Pricing:**
   - Type: `One-time`
   - Price: `29.00 USD`
   - "Add another price" (3 fiyat tier'ı için):
     - Founding: $29
     - Standard: $39
     - Premium: $49
6. "Save product"

**API Anahtarlarını Kaydet:**

Sol menü → Developers → API keys

Şunları `storied-secrets.txt`'e ekle:
```
STRIPE_PUBLISHABLE_KEY: pk_test_xxxxx (test mode key)
STRIPE_SECRET_KEY: sk_test_xxxxx (test mode key — GİZLİ)
STRIPE_PRICE_ID_FOUNDING: price_xxxxx
STRIPE_PRICE_ID_STANDARD: price_xxxxx
STRIPE_PRICE_ID_PREMIUM: price_xxxxx
```

**Stripe CLI'yi Yükle (Webhook test için):**
```bash
brew install stripe/stripe-cli/stripe
stripe login
```

Bu komut bir tarayıcı açar, Stripe'a girip authorize et.

**✅ Tamam mı?** Test mode aktif, ürün eklendi, anahtarlar kaydedildi.

⚠️ **Live mode**'a geçmek için Stripe ek dokümantasyon ve identity verification ister — bunu **launch öncesi** yaparız.

---

## 2.4 — OpenAI Hesabı (Whisper için)

**Neden:** Ses kayıtlarını yazıya çevirmek için.

**Adımlar:**
1. https://platform.openai.com/signup adresine git
2. Hesap oluştur (Google ile sign-in en kolay)
3. Email doğrula, telefon doğrula

**Kredi yükle:**
1. Sol menü → Settings → Billing
2. "Add payment method" — kart ekle
3. "Buy credits" — başlangıç için **$10** yeterli (Whisper çok ucuz, $10 ile binlerce kayıt yapabilirsin)

**Auto-recharge** aç (kredi bitince otomatik dolsun):
- Threshold: $5
- Recharge to: $10

Böylece bir gece uyanıp "API'm çalışmıyor!" demezsin.

**API Anahtarı Oluştur:**
1. Sol menü → API keys → "Create new secret key"
2. Name: `storied-production`
3. Permissions: `All`
4. "Create"
5. Açılan key'i **HEMEN KOPYALA** — bir daha gösterilmez

`storied-secrets.txt`'e ekle:
```
OPENAI_API_KEY: sk-proj-xxxxx
```

**✅ Tamam mı?**

---

## 2.5 — Anthropic Hesabı (Claude için)

**Neden:** AI feedback üretmek için.

**Adımlar:**
1. https://console.anthropic.com adresine git
2. Sign up
3. Email doğrula

**Kredi yükle:**
1. Settings → Plans & Billing
2. "Buy credits" — başlangıç için **$20** yeterli
3. Auto-recharge aç ($5 threshold, $20 recharge)

**API Anahtarı Oluştur:**
1. Sol menü → API keys → "Create Key"
2. Name: `storied-production`
3. "Create"
4. Açılan key'i kopyala

`storied-secrets.txt`'e ekle:
```
ANTHROPIC_API_KEY: sk-ant-xxxxx
```

**✅ Tamam mı?**

---

## 2.6 — Resend Hesabı (Email için)

**Neden:** Welcome email, receipt, magic link'ler için.

**Adımlar:**
1. https://resend.com adresine git
2. GitHub ile sign in
3. **Free tier** seç (3000 email/ay yeterli)

⚠️ **Önemli:** Resend domain doğrulama gerektirir. Henüz `storied.app` almadığımız için, **şimdilik test email'leri ile başlayacağız**. Domain alındıktan sonra (Phase 6'da) gerçek domain'i doğrularız.

Şimdilik:
1. Sol menü → API Keys → "Create API Key"
2. Name: `storied-development`
3. Permission: `Full access`
4. "Add"

`storied-secrets.txt`'e ekle:
```
RESEND_API_KEY: re_xxxxx
RESEND_FROM_EMAIL: onboarding@resend.dev (geçici — domain alınca değişecek)
```

**✅ Tamam mı?**

---

## 2.7 — Vercel Hesabı (Hosting için)

**Neden:** Storied'i internete koymak için. Next.js'in resmi hosting partneri.

**Adımlar:**
1. https://vercel.com/signup adresine git
2. GitHub ile sign in (recommended)
3. Authorize Vercel
4. Plan: `Hobby` (free) — şimdilik yeterli

Vercel CLI'yi yükle (terminal'den deploy için):
```bash
npm install -g vercel
vercel login
```

Açılan tarayıcıda Vercel'e giriş yap, terminale dön.

**Henüz proje deploy etme** — kod hazır olduğunda yaparız.

**✅ Tamam mı?** `vercel --version` çalışıyorsa devam.

---

## 2.8 — PostHog Hesabı (Analytics için)

**Neden:** Kullanıcı davranışlarını anlamak için. Privacy-respecting.

**Adımlar:**
1. https://posthog.com adresine git
2. "Get started — free"
3. Email + şifre
4. **Cloud region:** `US` veya `EU` — sen EU seç (Dublin)
5. Project name: `Storied`

API anahtarını kaydet:
1. Settings → Project → Project API Key
2. `storied-secrets.txt`'e ekle:

```
POSTHOG_API_KEY: phc_xxxxx
POSTHOG_HOST: https://eu.i.posthog.com (EU seçtiysen)
```

**✅ Tamam mı?**

---

## 2.9 — Sentry Hesabı (Error tracking için)

**Neden:** Hata yakalamak için. Sen uyurken bir kullanıcı hata yaşarsa, sabah email görürsün.

**Adımlar:**
1. https://sentry.io/signup adresine git
2. GitHub ile sign in
3. Platform: `Next.js` seç
4. Project name: `storied-web`
5. Setup wizard atla (kod yazarken otomatik configure olacak)

DSN'i kaydet:
1. Settings → Projects → storied-web → Client Keys (DSN)
2. `storied-secrets.txt`'e ekle:

```
SENTRY_DSN: https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

**✅ Tamam mı?**

---

## 🎉 BÖLÜM 2 TAMAM!

Şu an **8 servise hesabın var** ve tüm gizli anahtarlar `storied-secrets.txt`'de.

⚠️ **CRITICAL:** Bu dosyayı **asla** Git'e push etme. Git'in görmediğine emin olmak için sonraki bölümde göstereceğim.

Şimdi başka bir mola ver. Bir sonraki bölüm projenin gerçek kurulumu.

---

# BÖLÜM 3: PROJEYİ HAZIRLAMA
## (30 dakika sürer)

## 3.1 — Proje Klasörünü Oluştur

**Komut:**
```bash
cd ~/Documents
mkdir storied
cd storied
```

Şimdi `~/Documents/storied/` klasöründesin.

## 3.2 — Dokümanları Buraya Koy

Sana verdiğim **10 doküman + master prompt** dosyasını bu klasöre kopyala:

1. Finder'ı aç (`Cmd + Space` → "Finder")
2. `Documents/storied/` klasörünü aç
3. Yeni bir alt klasör oluştur: `docs`
4. İndirdiğin 10 markdown dosyasını `docs/` klasörüne sürükle:
   - `00-master-vibe.md`
   - `01-product-vision.md`
   - `02-brand-voice.md`
   - `03-user-journey.md`
   - `04-curriculum-30-days.md`
   - `05-ai-feedback-system.md`
   - `06-audio-pipeline.md`
   - `07-technical-architecture.md`
   - `08-screens-and-flows.md`
   - `09-progression-graduation.md`
5. `ANTIGRAVITY_MASTER_PROMPT.md`'yi **kök** klasöre koy (`storied/` içine, `docs/` değil)

Şimdi klasör yapısı şöyle:
```
~/Documents/storied/
├── ANTIGRAVITY_MASTER_PROMPT.md
└── docs/
    ├── 00-master-vibe.md
    ├── 01-product-vision.md
    ├── ... (8 tane daha)
    └── 09-progression-graduation.md
```

**Doğrulama:**
```bash
cd ~/Documents/storied
ls
```

Şunu görmeli:
```
ANTIGRAVITY_MASTER_PROMPT.md   docs
```

```bash
ls docs/
```

10 markdown dosyasını görmeli.

**✅ Tamam mı?** Devam.

---

## 3.3 — Git'i Başlat

**Komut:**
```bash
git init
```

**`.gitignore` Oluştur** (Git'e "bu dosyaları görme" demek için):
```bash
cat > .gitignore <<EOF
# Dependencies
node_modules/
.pnp.*

# Environment files (GİZLİ)
.env
.env.local
.env*.local
storied-secrets.txt

# Build
.next/
out/
build/
dist/

# Logs
*.log
npm-debug.log*

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Vercel
.vercel/

# TypeScript
*.tsbuildinfo
next-env.d.ts

# Test
coverage/
EOF
```

**Bu komutu çalıştır** — `storied-secrets.txt` dosyasının Git tarafından izlenmemesini sağlar.

**İlk commit:**
```bash
git add .
git commit -m "Initial commit: Storied docs and master prompt"
```

**✅ Tamam mı?**

---

## 3.4 — GitHub'da Private Repo Oluştur

**Neden:** Storied'i privatе bir GitHub repo'sunda tutacağız.

**Adımlar:**
1. https://github.com/new adresine git
2. Repository name: `storied`
3. Description: `Daily voice practice for becoming a storyteller`
4. Visibility: **Private** (önemli)
5. **Hiçbir şey ekleme** (README, .gitignore vs.) — zaten lokalde var
6. "Create repository"

GitHub size komutlar gösterecek, **"push an existing repository"** kısmındakileri kopyala. Şuna benzer:

```bash
git remote add origin git@github.com:USERNAME/storied.git
git branch -M main
git push -u origin main
```

⚠️ `USERNAME`'i kendi GitHub username'inle değiştir.

Çalıştır.

**Doğrulama:** GitHub repo sayfasını yenile — dosyaları görmeli.

**✅ Tamam mı?** Devam.

---

## 3.5 — `storied-secrets.txt`'i Güvenli Yere Taşı

Şu an bu dosya `Documents/storied/`'de ama Git ignore ediyor. Yine de **lokalde başka bir yere de yedek alalım**:

1. `storied-secrets.txt`'i 1Password'a (veya benzer şifre yöneticine) **bir secure note** olarak kopyala
2. Lokaldeki dosya kalsın — Antigravity'nin proje setup'ı sırasında ihtiyaç olacak
3. Asla email, Slack, Discord, GitHub vs.'ye paylaşma

**✅ Tamam mı?**

---

# BÖLÜM 4: ANTIGRAVITY'Yİ BAŞLAT
## (15 dakika sürer)

## 4.1 — Antigravity'yi Proje Klasörüne Yönlendir

Antigravity'nin spesifik komutları sürüm bazlı değişebilir, ama genel akış:

```bash
cd ~/Documents/storied
antigravity init
```

Veya VS Code içinde Antigravity eklentisinden başlat.

## 4.2 — Master Prompt'u Antigravity'ye Ver

Antigravity'nin başlangıç ekranında veya konfigürasyonunda **`ANTIGRAVITY_MASTER_PROMPT.md`** dosyasının içeriğini sistem prompt'u olarak gir.

**Önemli:** Antigravity'nin **önce dökümanları okuduğundan** emin ol. Master prompt onu bu sırayla yönlendirecek:

1. `docs/00-master-vibe.md` — constitution
2. `docs/01-product-vision.md` — strategic
3. `docs/02-brand-voice.md` — voice
4. `docs/07-technical-architecture.md` — stack
5. Sonra Phase 1'i (landing page) inşa etmeye başla

## 4.3 — İlk Build'i Başlat

Antigravity'ye şu komutu ver:

> **"Read ANTIGRAVITY_MASTER_PROMPT.md and the documents in docs/. Then begin Phase 1 — build the landing page and Stripe Checkout integration. Use the environment variables from storied-secrets.txt for setup."**

Antigravity şimdi:
1. Tüm dökümanları okuyacak (~5 dakika)
2. Next.js 15 projesini başlatacak
3. Tailwind, shadcn/ui kuracak
4. Landing page'i inşa etmeye başlayacak

Sen ne yapacaksın? **İzleyeceksin.** Her major karar sonrası "vibe check" yapacak — sen "tamam" ya da "şu farklı olsun" diyeceksin.

**✅ Tamam mı?** Antigravity çalışıyorsa BAŞARDIN.

---

# 🎯 GENEL TIMELINE — NE ZAMAN NE YAPACAĞIN

İşte önümüzdeki haftaların tahmini:

## Hafta 1 — Setup + Phase 1 (Landing)
- **Gün 1-2:** Bu rehber (kurulum)
- **Gün 3-4:** Antigravity Phase 1'i inşa eder (landing + Stripe test)
- **Gün 5-7:** Vibe check, küçük revizyonlar, test

## Hafta 2 — Phase 2 (Auth) + Phase 3 (Day 1 MVP)
- **Gün 8-10:** Auth (Google OAuth + Magic Link)
- **Gün 11-14:** Audio recording + Whisper + Claude feedback

## Hafta 3 — Phase 4 (Progression)
- **Gün 15-18:** Day 2-29 unlocking, streak, archive
- **Gün 19-21:** Weekly transitions, dashboard polish

## Hafta 4 — Phase 5 (Graduation) + Polish
- **Gün 22-25:** Day 30 flow, certificate, shareable card
- **Gün 26-28:** PWA setup, error tracking, mobile testing

## Hafta 5 — Test & Launch
- **Gün 29-31:** Beta test (kendin Day 1-30'u tamamla)
- **Gün 32-35:** Domain al, Resend domain doğrula, Stripe live mode'a geç
- **Gün 36:** İlk müşteriye sat

**Toplam: ~5 hafta solo build.**

---

# 🚨 ÖNEMLİ HATIRLATMALAR

## Bunu Yapma:
- ❌ `storied-secrets.txt`'i Git'e ekleme
- ❌ API key'leri kimseyle paylaşma (Slack, email, ChatGPT, Twitter...)
- ❌ Stripe'ı live mode'a geçirme (test bitene kadar)
- ❌ Domain almadan Resend'i production'a koyma
- ❌ Antigravity bir şey yaparken araya girip "şunu da yap" deme — vibe check beklent

## Bunu Yap:
- ✅ Her phase'in vibe check'inde dur, gerçekten beğendin mi sor
- ✅ Acele etme — Storied "30 günde kuruldu" demek istemiyor, "kraliyet işi gibi yapıldı" demek istiyor
- ✅ Sıkıştığında kendi dökümanlarına geri dön — cevap orada
- ✅ Phase 3'te (audio recording) gerçek iPhone'una test ettir
- ✅ Day 1'i kendin tamamla, gerçek bir hikaye anlat — sonraki günlerin AI feedback'i bunu temel alacak

---

# 🆘 SORUN OLURSA

## "Komut çalışmıyor" hatası:
1. Komutu **tam olarak** kopyaladığından emin ol (her boşluk önemli)
2. Hata mesajını oku — genelde ne yapacağını söyler
3. Hatayı Google'a yapıştır — %95 ihtimal başkası yaşamış, çözüm var
4. Çözüm yoksa Claude'a (bana) sor, ekran görüntüsüyle

## "Antigravity bir şey kıramazsa":
1. Sakin ol — Antigravity geri alabilir
2. "Undo last change" veya benzer komut var
3. Git en güçlü güvenlik ağın — `git checkout .` ile son commit'e dönersin

## "Hesabımdan para çekildi panik":
1. OpenAI/Anthropic kullanım bazlı çalışır, **$10-30/ay**dan fazla beklenmez ilk 50 kullanıcıya kadar
2. Eğer beklenmedik bir miktar gördüysen, dashboard'larındaki "Usage" sekmesini kontrol et
3. Şüpheli aktivite varsa API key'i hemen rotate et (sil, yeni oluştur)

---

# 📞 İLETİŞİM SEKMESİ

Sana yardım eden 3 ana kaynak:

1. **Bu dökümanlar** — her sorunun cevabı `docs/` içinde
2. **Antigravity** — kod sorularını çözer
3. **Claude (web/Claude.ai)** — strateji + debug + duvara takıldığında

Sıkışırsan:
- Önce dökümanı oku
- Sonra Antigravity'ye sor
- Hâlâ çözülmediyse Claude'a sor (bana — ekran görüntüleriyle)

---

# ✅ FINAL CHECKLIST

Tüm kurulum bitince bu listeyi çalıştır:

```
Mac Setup:
☐ Xcode Command Line Tools yüklü
☐ Homebrew yüklü ve PATH'te
☐ Git yüklü ve config'lendi
☐ Node 22 yüklü
☐ VS Code yüklü, eklentiler kurulu
☐ Antigravity yüklü ve login'li

Hesaplar:
☐ GitHub — repo private
☐ Supabase — proje EU (Ireland) region
☐ Stripe — test mode, ürün eklendi, 3 fiyat tier'ı
☐ OpenAI — $10 kredi, auto-recharge açık
☐ Anthropic — $20 kredi, auto-recharge açık
☐ Resend — API key (domain sonra)
☐ Vercel — CLI yüklü ve login'li
☐ PostHog — EU region
☐ Sentry — Next.js projesi

Proje:
☐ ~/Documents/storied/ klasörü var
☐ docs/ içinde 10 markdown
☐ ANTIGRAVITY_MASTER_PROMPT.md kök klasörde
☐ .gitignore içinde secrets var
☐ Git init yapıldı, GitHub'a push edildi
☐ storied-secrets.txt güvenli (1Password'da yedek)

Antigravity:
☐ Master prompt verildi
☐ Phase 1 başlatıldı
☐ Landing page ilk versiyonu deploy edildi (Vercel preview URL)
```

Hepsi ✅ ise: **Sen artık bir indie hacker'sın.** 🌒

Bir mola ver. Kahve iç. Pencereden bak. Sonra Antigravity'ye bak ve "Şimdi yapalım" de.

---

*Setup guide bitti. Bir sorun olursa, "şu adımda takıldım" diye yazın, yardım ederim.*
