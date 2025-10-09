# 📧 PingMe - Email Application

[![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## 📌 Deskripsi

**PingMe** adalah aplikasi email berbasis web yang dibangun menggunakan **HTML, CSS, dan JavaScript murni** tanpa framework eksternal. Aplikasi ini dirancang dengan antarmuka yang sederhana dan intuitif, menyediakan fitur-fitur email lengkap seperti inbox, sent mail, drafts, trash, compose, reply, dan manajemen kontak.

Project ini dibuat sebagai bagian dari **Ujian Tengah Semester - Front-End Programming**.

---

## ✨ Fitur Utama

### 🔐 Autentikasi
- **Login** - Masuk dengan akun yang sudah terdaftar
- **Sign Up** - Pendaftaran akun baru dengan validasi
- **Logout** - Keluar dari akun dengan aman

### 📬 Email Management
- **Inbox** - Melihat email yang masuk dengan fitur pencarian
- **Sent Mail** - Melihat email yang telah terkirim
- **Drafts** - Menyimpan dan mengedit draft email
- **Trash** - Mengelola email yang dihapus (restore/delete permanent)
- **Starred** - Email yang ditandai penting
- **Compose** - Menulis dan mengirim email baru
- **Reply** - Membalas email dengan quoted message
- **Forward** - Meneruskan email ke penerima lain

### 👤 User Management
- **Profile** - Edit informasi profil (nama, telepon)
- **Change Password** - Ubah kata sandi dengan validasi
- **Contacts** - Manajemen daftar kontak (tambah, edit, hapus)

### 🎨 UI/UX Features
- Dark theme yang modern dan nyaman di mata
- Responsive layout dengan sidebar navigation
- Real-time search pada inbox
- Email preview dan detail view
- Form validation untuk semua input

---

## 🗂️ Struktur Halaman

```
├── index.html          # Login page
├── signup.html         # Sign up page
├── inbox.html          # Dashboard / Inbox (Home)
├── sent.html           # Sent mail page
├── drafts.html         # Drafts page
├── trash.html          # Trash page
├── starred.html        # Starred emails page
├── compose.html        # Compose new email
├── email_detail.html   # Email detail view
├── reply.html          # Reply to email
├── profile.html        # User profile settings
├── contacts.html       # Contact management
├── css/
│   └── style.css       # Main stylesheet
└── js/
    └── app.js          # Core JavaScript logic
```

---

## 🛠️ Teknologi yang Digunakan

| Teknologi | Deskripsi |
|-----------|-----------|
| **HTML5** | Struktur dan markup halaman |
| **CSS3** | Styling dan layout dengan custom dark theme |
| **JavaScript (ES6+)** | Logika aplikasi, DOM manipulation, dan localStorage |
| **LocalStorage API** | Penyimpanan data user dan email di browser |

---

## 🚀 Cara Menjalankan Website

### Langsung dengan Browser (Recommended)

1. **Download/Clone Repository**
   ```bash
   git clone https://github.com/ferdinand-12/Project-email.git
   cd pingme-email
   ```

2. **Buka File HTML**
   - Klik kanan pada file `index.html`
   - Pilih "Open with" → Browser pilihan Anda (Chrome, Firefox, Edge, dll)
   - Atau drag & drop file `index.html` ke browser

3. **Selesai!**
   - Website akan langsung berjalan
   - Gunakan akun demo atau buat akun baru

---

## 👤 Akun Demo

Untuk testing, gunakan akun demo yang sudah tersedia:

```
Email: alice@example.com
Password: password123
```

Atau Anda bisa membuat akun baru melalui halaman **Sign Up**.

---

## 📋 Validasi Form

### Sign Up
- **Nama lengkap**: 3-32 karakter, hanya huruf
- **Email**: Format email valid (example@domain.com)
- **Telepon**: Format Indonesia (08xxxxxxxxxx, 10-16 digit)
- **Password**: Minimal 8 karakter

### Compose Email
- **To**: Email valid, bisa multiple (pisahkan dengan koma)
- **Body**: Wajib diisi

### Profile
- Validasi sama dengan sign up
- Password lama harus benar untuk ganti password

---

## 🎯 Fitur Unggulan

1. **🔍 Real-time Search** - Pencarian email di inbox secara real-time
2. **⭐ Star/Unstar** - Tandai email penting
3. **📝 Draft Auto-save** - Simpan draft dan edit kapan saja
4. **↩️ Reply with Quote** - Balas email dengan kutipan pesan asli
5. **➡️ Forward** - Teruskan email dengan header lengkap
6. **🗑️ Trash Management** - Restore atau hapus permanen
7. **📇 Contact Management** - Kelola kontak dengan mudah
8. **🔒 Secure Login** - Validasi login dan session management

---

## 🎨 Design Features

- **Dark Theme** - Tema gelap yang modern dan nyaman
- **Gradient Accents** - Aksen warna biru gradient
- **Clean Layout** - Layout yang rapi dan mudah dinavigasi
- **Responsive Design** - Menyesuaikan dengan ukuran layar
- **Smooth Transitions** - Animasi halus pada interaksi
- **Custom Scrollbar** - Scrollbar yang stylish

---

## 🐛 Known Issues & Limitations

- Data hanya tersimpan di browser (tidak persistent antar device)
- Tidak ada enkripsi password (hanya untuk demo)
- Email hanya bisa dikirim antar user dalam aplikasi yang sama
- Tidak mendukung attachment file
- Belum ada fitur search di halaman lain selain inbox

---

## 👥 Tim Pengembang

| Nama | NIM | Role |
|------|-----|------|
| **James William Wijaya** | 535240082 | Frontend Developer |
| **Kyeth Fernando** | 535240084 | Frontend Developer |
| **Priscilla Rebekah Tedja** | 535240086 | UI/UX Designer |
| **Ferdinand Gouwadi** | 535240087 | JavaScript Developer |
| **Nicholas Isaiah** | 535240144 | Frontend Developer |
| **Juan Christian Handoko** | 535240179 | Quality Assurance |

---

## 📄 Lisensi

Project ini dibuat untuk keperluan akademik - **Ujian Tengah Semester Front-End Programming**.

---

## 🙏 Acknowledgments

- Icons: [Icons8](https://icons8.com/)
- Font: Inter, Segoe UI
- Inspiration: Gmail, Outlook

---

**⭐ Don't forget to star this repository if you find it useful!**

---

*Last Updated: October 2025*
