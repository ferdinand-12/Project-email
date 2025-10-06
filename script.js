document.addEventListener('DOMContentLoaded', function() {
  // Data kontak awal
  let contacts = [
    { id: 1, fullName: 'Budi Darmawan', email: 'budi.darmawan@example.com', phoneNumber: '081234567890' },
    { id: 2, fullName: 'Citra Lestari', email: 'citra.lestari@example.com', phoneNumber: '087654321098' }
  ];
  let nextId = 3;

  const contactList = document.getElementById('contactList');
  const contactForm = document.getElementById('contactForm');
  const contactIdInput = document.getElementById('contactId');
  const fullNameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const phoneNumberInput = document.getElementById('phoneNumber');
  const cancelButton = document.getElementById('cancelButton');

  //  Render daftar kontak dengan tampilan rapi (Outlook style)
  function renderContacts() {
    contactList.innerHTML = '';

    if (contacts.length === 0) {
      contactList.innerHTML = '<p style="color:#aaa;">Tidak ada kontak tersimpan.</p>';
      return;
    }

    contacts.forEach(contact => {
      const avatarLetter = contact.fullName.charAt(0).toUpperCase();
      const item = document.createElement('div');
      item.className = 'contact-item';
      item.innerHTML = `
        <div class="contact-avatar">${avatarLetter}</div>
        <div class="contact-info">
          <p class="contact-name">${contact.fullName}</p>
          <p class="contact-email">${contact.email}</p>
          <p class="contact-phone">${contact.phoneNumber}</p>
        </div>
        <div class="contact-actions">
          <button class="btn btn-compose" data-email="${contact.email}">Compose</button>
          <button class="btn btn-edit" data-id="${contact.id}">Edit</button>
          <button class="btn btn-delete" data-id="${contact.id}">Hapus</button>
        </div>
      `;

      contactList.appendChild(item);
    });
  }

  //  Edit kontak
  function editContact(id) {
    const contact = contacts.find(c => c.id === id);
    if (contact) {
      contactIdInput.value = contact.id;
      fullNameInput.value = contact.fullName;
      emailInput.value = contact.email;
      phoneNumberInput.value = contact.phoneNumber;
      cancelButton.style.display = 'inline-block';
    }
  }

  //  Hapus kontak
  function deleteContact(id) {
    if (confirm('Apakah Anda yakin ingin menghapus kontak ini?')) {
      contacts = contacts.filter(c => c.id !== id);
      renderContacts();
    }
  }

  // Reset form
  function resetForm() {
    contactForm.reset();
    contactIdInput.value = '';
    cancelButton.style.display = 'none';
  }

  // Simpan kontak (tambah / edit)
  contactForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const id = contactIdInput.value;
    const newContact = {
      fullName: fullNameInput.value,
      email: emailInput.value,
      phoneNumber: phoneNumberInput.value
    };

    if (id) {
      const index = contacts.findIndex(c => c.id == id);
      if (index !== -1) {
        contacts[index] = { ...contacts[index], ...newContact };
      }
    } else {
      newContact.id = nextId++;
      contacts.push(newContact);
    }

    resetForm();
    renderContacts();
  });

  cancelButton.addEventListener('click', resetForm);

  // Delegasi event untuk tombol edit & hapus
  contactList.addEventListener('click', function(event) {
    const id = parseInt(event.target.dataset.id);
    if (event.target.classList.contains('edit-btn')) editContact(id);
    if (event.target.classList.contains('delete-btn')) deleteContact(id);
  });

  // Tampilkan daftar kontak saat awal
  renderContacts();
});
