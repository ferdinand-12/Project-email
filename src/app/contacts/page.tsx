'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { currentUser, addContact, editContact, removeContact, isValidEmail, isValidPhone } from '@/lib/db';
import { Contact } from '@/types';

export default function ContactsPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    const user = currentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setContacts(user.contacts);
  }, [router]);

  const handleAddContact = () => {
    const name = prompt('Nama');
    const email = prompt('Email');
    const phone = prompt('Telepon (format: 08xxxxxxxxxx)');

    if (!name || !email || !phone) {
      alert('Semua field wajib diisi');
      return;
    }

    if (!isValidEmail(email)) {
      alert('Format email tidak valid');
      return;
    }

    if (!isValidPhone(phone)) {
      alert('Format telepon tidak valid (harus dimulai dengan 08, 10-16 digit)');
      return;
    }

    addContact({ name, email, phone });
    
    // Reload contacts
    const user = currentUser();
    if (user) setContacts(user.contacts);
  };

  const handleEditContact = (contact: Contact) => {
    const name = prompt('Nama', contact.name);
    const email = prompt('Email', contact.email);
    const phone = prompt('Telepon', contact.phone);

    if (!name || !email || !phone) return;

    if (!isValidEmail(email)) {
      alert('Format email tidak valid');
      return;
    }

    if (!isValidPhone(phone)) {
      alert('Format telepon tidak valid');
      return;
    }

    editContact(contact.id, { name, email, phone });
    
    // Reload contacts
    const user = currentUser();
    if (user) setContacts(user.contacts);
  };

  const handleDeleteContact = (id: string) => {
    if (confirm('Hapus kontak ini?')) {
      removeContact(id);
      
      // Reload contacts
      const user = currentUser();
      if (user) setContacts(user.contacts);
    }
  };

  return (
    <div className="layout">
      <Sidebar />

      <div style={{ flex: 1 }}>
        <div className="topbar" style={{ justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0 }}>Contacts</h2>
          <button className="button" onClick={handleAddContact}>
            + Add Contact
          </button>
        </div>

        <div className="card">
          {contacts.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
              Belum ada kontak. Tambahkan kontak pertama Anda!
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {contacts.map((contact) => (
                  <tr
                    key={contact.id}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.03)',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <td style={{ padding: '14px' }}>
                      <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                        {contact.name}
                      </div>
                      <div className="small">
                        {contact.email} • {contact.phone}
                      </div>
                    </td>
                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      <button
                        className="btn-ghost"
                        onClick={() => handleEditContact(contact)}
                        style={{ marginRight: '8px', padding: '8px 16px' }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-ghost"
                        onClick={() => handleDeleteContact(contact.id)}
                        style={{ color: 'var(--danger)', padding: '8px 16px' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}