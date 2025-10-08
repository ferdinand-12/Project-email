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

function sendMail() {
  const to = document.getElementById("to").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  if (!to || !subject || !message) {
    alert("Please fill all fields!");
    return;
  }

  const mail = { to, subject, message, date: new Date().toLocaleString() };
  let sent = JSON.parse(localStorage.getItem("sent")) || [];
  sent.push(mail);
  localStorage.setItem("sent", JSON.stringify(sent));

  alert("Email sent!");
  window.location.href = "sent.html"; 
}

function showSent() {
  if (!document.getElementById("sentList")) return;

  const sentList = document.getElementById("sentList");
  const sent = JSON.parse(localStorage.getItem("sent")) || [];
  sentList.innerHTML = "";

  sent.forEach((mail, index) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p><strong>To:</strong> ${mail.to}<br>
      <strong>Subject:</strong> ${mail.subject}<br>
      <strong>Message:</strong> ${mail.message}<br>
      <small>${mail.date}</small></p>
      <button onclick="deleteMail(${index})">Delete</button>
      <hr>
    `;
    sentList.appendChild(div);
  });
}

function deleteMail(index) {
  let sent = JSON.parse(localStorage.getItem("sent")) || [];
  let trash = JSON.parse(localStorage.getItem("trash")) || [];

  const deletedMail = sent.splice(index, 1)[0];
  trash.push(deletedMail);

  localStorage.setItem("sent", JSON.stringify(sent));
  localStorage.setItem("trash", JSON.stringify(trash));

  showSent();
  alert("Email moved to Trash!");
}

function showTrash() {
  if (!document.getElementById("trashList")) return;

  const trashList = document.getElementById("trashList");
  const trash = JSON.parse(localStorage.getItem("trash")) || [];
  trashList.innerHTML = "";

  trash.forEach((mail, index) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p><strong>To:</strong> ${mail.to}<br>
      <strong>Subject:</strong> ${mail.subject}<br>
      <strong>Message:</strong> ${mail.message}<br>
      <small>${mail.date}</small></p>
      <button onclick="restoreMail(${index})">Restore</button>
      <button onclick="deleteForever(${index})">Delete Permanently</button>
      <hr>
    `;
    trashList.appendChild(div);
  });
}

function restoreMail(index) {
  let trash = JSON.parse(localStorage.getItem("trash")) || [];
  let sent = JSON.parse(localStorage.getItem("sent")) || [];

  const restoredMail = trash.splice(index, 1)[0];
  sent.push(restoredMail);

  localStorage.setItem("trash", JSON.stringify(trash));
  localStorage.setItem("sent", JSON.stringify(sent));

  showTrash();
  alert("Email restored to Sent!");
}

function deleteForever(index) {
  let trash = JSON.parse(localStorage.getItem("trash")) || [];
  trash.splice(index, 1);
  localStorage.setItem("trash", JSON.stringify(trash));

  showTrash();
  alert("Email deleted permanently!");
}

showSent();
showTrash();