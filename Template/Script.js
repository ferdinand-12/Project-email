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
