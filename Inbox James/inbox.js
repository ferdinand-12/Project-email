document.querySelectorAll('.email-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelector('.email-detail').innerHTML = `
      <div class="opened-email">
        <h2>${item.querySelector('.sender').innerText}</h2>
        <h4>${item.querySelector('.subject').innerText}</h4>
        <p>Isi detail email bisa ditampilkan di sini...</p>
      </div>
    `;
  });
});

document.querySelector('.add-account').addEventListener('click', () => {
  window.location.href = 'signup.html'; 
});
// Ambil elemen untuk menampilkan email user
const userEmailDisplay = document.getElementById('userEmail');

// Cek apakah user sudah login (ada di localStorage)
const savedEmail = localStorage.getItem('userEmail');
if (savedEmail) {
  userEmailDisplay.textContent = savedEmail; 
} else {
  userEmailDisplay.textContent = "Sign / Log"; 
}

// Event klik untuk Add Account
document.querySelector('.add-account').addEventListener('click', () => {
  // Kalau user belum login → arahkan ke signup/login
  if (!savedEmail) {
    window.location.href = 'login.html'; 
  } else {
    alert("Anda sudah login sebagai " + savedEmail);
  }
});
