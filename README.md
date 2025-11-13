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

Ini adalah arsitektur wajib untuk memastikan anonimitas. **Logika GEA 2024 DITOLAK**.

```mermaid
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
