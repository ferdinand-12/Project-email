document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Ambil semua user dari localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Cek kecocokan email & password
    const foundUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (foundUser) {
      // Simpan info user yang login (untuk session)
      localStorage.setItem("loggedInUser", JSON.stringify(foundUser));

      alert("Login berhasil!");
      window.location.href = "index.html"; // ✅ Redirect ke halaman utama
    } else {
      alert("Email atau password salah!");
    }
  });
});
