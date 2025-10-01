document.addEventListener('DOMContentLoaded', () => {
  const inputs = document.querySelectorAll('.input-group input');

  // cek awal (untuk autofill)
  setTimeout(() => {
    inputs.forEach(input => {
      if (input.value.trim() !== '') {
        input.parentElement.classList.add('filled');
      }
    });
  }, 200);

  inputs.forEach(input => {
    input.addEventListener('input', () => {
      if (input.value.trim() !== '') {
        input.parentElement.classList.add('filled');
      } else {
        input.parentElement.classList.remove('filled');
      }
    });
    input.addEventListener('blur', () => {
      if (input.value.trim() !== '') {
        input.parentElement.classList.add('filled');
      }
    });
  });
});
