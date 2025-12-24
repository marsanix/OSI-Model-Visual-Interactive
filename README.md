# OSI & TCP/IP Model Visual Interactive

Aplikasi web interaktif untuk memvisualisasikan dan mempelajari 7 Layer OSI Model serta perbandingannya dengan TCP/IP Model. Dirancang untuk mahasiswa, pelajar, dan penggiat IT agar lebih mudah memahami konsep jaringan komputer secara visual.

🔗 **Link Demo:** [https://marsanix.github.io/OSI-Model-Visual-Interactive/](https://marsanix.github.io/OSI-Model-Visual-Interactive/)

## 🚀 Fitur Utama

- **Visualisasi Interaktif**: Klik setiap layer untuk melihat detail mendalam, termasuk deskripsi, PDU (Protocol Data Unit), dan fungsi utamanya.
- **Perbandingan OSI vs TCP/IP**: Tampilan berdampingan yang menunjukkan bagaimana kedua model jaringan ini saling memetakan.
- **Data Protokol Lengkap**: Informasi detail tentang protokol umum (HTTP, DNS, TCP, UDP, IP, dll) beserta nomor port dan penggunaannya.
- **Mode Simulasi**: (Fitur beta/mendatang) Visualisasi aliran data dari pengirim ke penerima melalui setiap layer (Enkapsulasi & Dekapsulasi).
- **Multi-Bahasa**: Mendukung Bahasa Indonesia 🇮🇩 dan Bahasa Inggris 🇬🇧.
- **Desain Modern**: Antarmuka responsif dengan efek glassmorphism dan animasi halus.

## 💻 Penggunaan Terbaik

> [!IMPORTANT]
> **Optimized for Desktop**
> 
> Aplikasi ini dirancang dan dioptimalkan untuk penggunaan pada layar **Desktop atau Laptop**. 
> Pengalaman pengguna pada perangkat mobile (HP/Tablet) mungkin terbatas karena kompleksitas visualisasi diagram layer yang membutuhkan ruang layar yang lebih luas.

## 🛠️ Instalasi & Menjalankan Lokal

Pastikan Anda telah menginstal [Node.js](https://nodejs.org/) di komputer Anda.

1.  **Clone repositori ini**
    ```bash
    git clone https://github.com/marsanix/OSI-Model-Visual-Interactive.git
    cd OSI-Model-Visual-Interactive
    ```

2.  **Install dependensi**
    ```bash
    npm install
    ```

3.  **Jalankan mode development**
    ```bash
    npm run dev
    ```
    Buka browser di alamat yang muncul (biasanya `http://localhost:5173`).

## 📦 Deployment ke GitHub Pages

Proyek ini sudah dikonfigurasi untuk berjalan di GitHub Pages.
Jika Anda melakukan fork atau ingin men-deploy versi Anda sendiri:

1.  Jalankan perintah build:
    ```bash
    npm run build
    ```
2.  Push folder `dist` atau gunakan workflow GitHub Actions yang tersedia.

## 📚 Teknologi

- **Vite**: Build tool yang cepat.
- **Vanilla JavaScript**: Logic interaktif tanpa framework berat.
- **CSS3 Variables & Flexbox/Grid**: Styling modern dan responsif.
- **GSAP**: Untuk animasi yang halus.

---
*Dibuat untuk tujuan edukasi dan pembelajaran jaringan komputer.*
