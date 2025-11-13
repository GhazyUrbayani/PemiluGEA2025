<p align="center">
  <img src="https://raw.githubusercontent.com/mahesa005/mahesa005/output/github-snake-dark.svg" alt="Kontribusi GitHub" />
</p>

<p align="center">
  <a href="https://git.io/typing-svg">
    <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=28&pause=1000&color=E3C45E&center=true&vCenter=true&width=500&lines=PEMILU+GEA+2025;GDV+Theme%3A+Star+Wars;May+the+votes+be+with+you." alt="Animated Typing Header" />
  </a>
</p>

# 🚀 PEMILU GEA 2025: "Star Wars"

Ini adalah repositori resmi untuk *codebase* website **PEMILU GEA 2025**. Proyek ini merupakan implementasi dari **Grand Design Visual (GDV) 2025** dengan tema "Star Wars".

Tantangan teknis utama proyek ini adalah **perombakan total arsitektur** dari sistem GEA 2024. Mandat utama kami adalah mengimplementasikan arsitektur "Kotak Suara Terpisah" untuk menjamin **anonimitas pemilih 100%** dan memutus hubungan antara identitas pemilih dengan surat suara mereka.

### 💻 Tech Stack (Diusulkan)

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/NextAuth.js-000000?style=for-the-badge&logo=nextauth.js&logoColor=white" alt="NextAuth.js">
  <img src="https://img.shields.io/badge/Azure_AD-0078D4?style=for-the-badge&logo=microsoftazure&logoColor=white" alt="Azure AD SSO">
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel">
</p>

---

### 🎯 Fitur Inti & Persyaratan Logika

Berdasarkan spesifikasi, sistem ini harus memenuhi persyaratan fungsional kritis berikut:

* **Arsitektur Anonim "Kotak Suara Terpisah"**: Sistem wajib memisahkan data pemilih (`VoterRegistry`) dari data suara (`BallotBox`).
* **Otentikasi Hibrida**: Mendukung login online (Microsoft SSO) untuk pemilih jarak jauh dan login offline (Token Unik) untuk voting di kios (on-site).
* **Instant Runoff Voting (IRV)**: Jika terdapat 2+ kandidat, sistem harus menggunakan mekanisme IRV.
* **Kotak Kosong (KK) sebagai Kandidat**: Opsi "Kotak Kosong" diperlakukan sebagai kandidat penuh yang dapat diurutkan dalam preferensi IRV.

---

### 🏛️ Arsitektur "Kotak Suara Terpisah"

Ini adalah arsitektur wajib untuk memastikan anonimitas

```
graph TD
    A[Pemilih] -->|Login via| B(Opsi Login);
    B --> C{SSO (Email)};
    B --> D{Token (Offline)};
    
    subgraph "Validasi Identitas"
        C --> E[Cek VoterRegistry];
        D --> F[Hash Token];
        F --> E;
        E -- Valid --> G[hasVoted == false?];
        G -- Ya --> H(Izinkan Voting);
        G -- Tidak --> I(Blokir: Sudah Memilih);
        E -- Tidak Valid --> J(Blokir: Tidak Terdaftar);
    end

    subgraph "Proses Voting Anonim"
        H --> K[Tampilkan Halaman /vote];
        K --> L(Pemilih Mengisi Suara IRV);
        L --> M[Submit Suara];
        M --> N(Sistem Mengenkripsi Suara);
        N --> O[Simpan ke BallotBox];
        M --> P(Sistem Update hasVoted=true);
        P --> Q[Update VoterRegistry];
    end
    
    style O fill:#951518,color:#fff
    style E fill:#1D222F,color:#fff
    style Q fill:#1D222F,color:#fff
```
#### 1. Tabel `VoterRegistry` (DPT)
* **Tujuan**: Hanya untuk memvalidasi siapa yang berhak memilih dan melacak status (sudah/belum).
* **Kolom**:
    * `email` (Kunci Primer, untuk SSO)
    * `hashedToken` (Untuk login offline)
    * `hasVoted` (Boolean, default: `false`)
    * `isEligible` (Boolean)

#### 2. Tabel `BallotBox` (Kotak Suara)
* **Tujuan**: Menyimpan surat suara secara anonim.
* > **PERHATIAN**: TIDAK BOLEH ada `email`, `token`, `userId`, atau *foreign key* apa pun ke `VoterRegistry` di tabel ini.
* **Kolom**:
    * `id` (Kunci Unik)
    * `encryptedBallotData` (Data JSON suara terenkripsi)
    * `timestamp`

### 🗺️ Struktur Halaman (Pages)

* **`/` (Landing Page)**: Halaman utama, visual Star Wars, tombol "Mulai Voting", kontak panitia.
* **`/login` (Halaman Login)**: Pilihan antara "Login dengan Microsoft" (SSO) atau "Masukkan Token" (Offline).
* **`/kandidat` (Galeri Kandidat)**: Halaman publik menampilkan profil (Visi, Misi, Foto) semua kandidat Ketua dan Senator.
* **`/vote` (Halaman Voting)**: Halaman terproteksi. Menampilkan UI voting:
    * *1 Calon*: Radio button (Kandidat A vs Kotak Kosong).
    * *2+ Calon*: Antarmuka IRV (Drag-and-drop/dropdown) untuk Pilihan 1, 2, 3 (termasuk Kotak Kosong).
* **`/selesai` (Halaman Sukses)**: Ditampilkan setelah suara berhasil dikirim.
* **`/hasil` (Hasil Voting)**: Halaman publik yang hanya bisa diakses setelah voting ditutup oleh Admin.
* **`/admin/dashboard` (Dasbor Admin)**: Halaman terproteksi (via NextAuth Role) untuk memantau, menutup, dan mempublikasikan hasil.

### 🎨 Panduan GDV & Branding (Star Wars)
<details>
  <summary>Klik untuk melihat Color Palette dan Tipografi GDV 2025</summary>
  
  #### Aset Logo
  * **Logo Acara**: `pemilu logo fix.jpg` (Header/Navbar)
  * **Logo Institusi**: `hmtg-gea-itb.jpg` (Footer)

  #### Color Palette
  | Warna | Hex | Penggunaan |
  | :--- | :--- | :--- |
  | Krem (Latar Netral) | `#F5EAD9` | Latar belakang utama |
  | Biru Sangat Tua | `#1D222F` | Latar belakang sekunder, footer |
  | Hitam | `#201D20` | Teks utama, UI gelap |
  | Abu-abu (Metalik) | `#848A9D` | Teks sekunder, border |
  | Emas Pudar | `#D1A56E` | Tombol primer, aksen |
  | Merah Tua (Sith) | `#951518` | Tombol "Pilih", aksen bahaya |
  | Kuning (Lightsaber) | `#E3C45E` | Aksen terang |
  | Biru Muda (R2-D2) | `#5D9FAF` | Aksen info |
  | Oranye (X-Wing) | `#E16E4B` | Aksen |
  | Hijau (Yoda) | `#6FC36D` | Aksen sukses |
  | Cyan (Lightsaber) | `#2BCAE0` | Aksen |
  | Ungu (Mace Windu) | `#A16DA8` | Aksen |

  #### Tipografi
  * **Judul Utama**: `DEATH STAR REGULAR` (Fallback: `Staatliches`, `Impact`, sans-serif)
  * **Sub-Judul**: `HELVETICA BLACK ORIGINAL` (Fallback: `Arial Black`, `Helvetica`, sans-serif)
  * **Body Text**: `Trade Gothic Bold #2` (Fallback: `Roboto Condensed`, `Arial Narrow`, sans-serif)
  
  *(Catatan: Font GDV mungkin berlisensi. Gunakan font web-safe atau Google Fonts yang paling mirip sebagai fallback).*
</details>

### 🚀 Menjalankan Proyek Secara Lokal
Panduan ini untuk developer yang akan berkontribusi pada codebase ini.

#### 1. Kebutuhan Aset (Wajib)
Sebelum memulai, Anda harus mendapatkan aset berikut dari Panitia dan menyimpannya dalam file `.env.local`:

```bash
# Kredensial Database (Contoh: PostgreSQL)
DATABASE_URL="postgresql://user:password@host:port/database"

# Kunci Enkripsi (Wajib untuk BallotBox)
# Hasilkan satu kunci rahasia (min. 32 karakter)
BALLOT_ENCRYPTION_KEY="RAHASIA_ANDA_UNTUK_ENKRIPSI_SUARA"

# Kredensial Microsoft SSO
AZURE_AD_CLIENT_ID="CLIENT_ID_DARI_AZURE_PORTAL"
AZURE_AD_CLIENT_SECRET="CLIENT_SECRET_DARI_AZURE_PORTAL"
AZURE_AD_TENANT_ID="TENANT_ID_ANDA"

# Kunci NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="BUAT_KUNCI_RAHASIA_UNTUK_NEXTAUTH"
```

### 2. Instalasi
Clone repositori ini:
```bash
git clone [https://github.com/](https://github.com/)[USERNAME]/[NAMA_REPO].git
cd [NAMA_REPO]
```
Install dependensi:

```bash
npm install
# atau
yarn install
# atau
pnpm install
```

### 3. Migrasi Database
Setelah `.env.local` terisi, jalankan migrasi database (jika menggunakan Prisma/Drizzle):

```bash
npx prisma migrate dev
```

#### 4. Menjalankan Server

Jalankan server development:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.
