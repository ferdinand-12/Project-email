document.addEventListener('DOMContentLoaded', function() {
    // Data kontak awal untuk simulasi
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

    // Fungsi untuk menampilkan daftar kontak
    function renderContacts() {
        contactList.innerHTML = '';
        if (contacts.length === 0) {
            contactList.innerHTML = '<p>Tidak ada kontak tersimpan.</p>';
            return;
        }

        const table = document.createElement('table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Nama Lengkap</th>
                    <th>Email</th>
                    <th>Nomor HP</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `;
        
        const tableBody = table.querySelector('tbody');

        contacts.forEach(contact => {
            const row = tableBody.insertRow();
            row.innerHTML = `
                <td>${contact.fullName}</td>
                <td>${contact.email}</td>
                <td>${contact.phoneNumber}</td>
                <td>
                    <button class="edit-btn" data-id="${contact.id}">Edit</button>
                    <button class="delete-btn" data-id="${contact.id}">Hapus</button>
                </td>
            `;
        });
        contactList.appendChild(table);
    }

    // Fungsi untuk mengedit kontak
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

    // Fungsi untuk menghapus kontak
    function deleteContact(id) {
        if (confirm('Apakah Anda yakin ingin menghapus kontak ini?')) {
            contacts = contacts.filter(c => c.id !== id);
            renderContacts();
        }
    }
    
    // Fungsi untuk mereset form
    function resetForm() {
        contactForm.reset();
        contactIdInput.value = '';
        cancelButton.style.display = 'none';
    }

    // Event listener untuk form submission (tambah/update)
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const id = contactIdInput.value;
        const newContact = {
            fullName: fullNameInput.value,
            email: emailInput.value,
            phoneNumber: phoneNumberInput.value
        };

        if (id) {
            // Update kontak yang ada
            const index = contacts.findIndex(c => c.id == id);
            if (index !== -1) {
                contacts[index] = { ...contacts[index], ...newContact };
            }
        } else {
            // Tambah kontak baru
            newContact.id = nextId++;
            contacts.push(newContact);
        }

        resetForm();
        renderContacts();
    });
    
    // Event listener untuk tombol batal
    cancelButton.addEventListener('click', function() {
        resetForm();
    });

    // Event listener untuk tombol edit dan hapus (menggunakan event delegation)
    contactList.addEventListener('click', function(event) {
        if (event.target.classList.contains('edit-btn')) {
            const id = parseInt(event.target.dataset.id);
            editContact(id);
        }
        if (event.target.classList.contains('delete-btn')) {
            const id = parseInt(event.target.dataset.id);
            deleteContact(id);
        }
    });

    // Tampilkan kontak saat halaman dimuat
    renderContacts();
});