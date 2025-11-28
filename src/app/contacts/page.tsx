'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { getCurrentUser, getContacts, addContact, editContact, removeContact, isValidEmail, isValidPhone } from '@/lib/db';
import { Contact } from '@/types';

export default function ContactsPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContacts();
  }, [router]);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const user = await getCurrentUser();
      if (!user) {
        router.push('/login');
        return;
      }
      const data = await getContacts();
      setContacts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = async () => {
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

    try {
      await addContact({ name, email, phone });
      loadContacts();
    } catch (error) {
      console.error(error);
      alert('Gagal menambahkan kontak');
    }
  };

  const handleEditContact = async (contact: Contact) => {
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

    try {
      await editContact(contact.id, { name, email, phone });
      loadContacts();
    } catch (error) {
      console.error(error);
      alert('Gagal mengedit kontak');
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (confirm('Hapus kontak ini?')) {
      try {
        await removeContact(id);
        loadContacts();
      } catch (error) {
        console.error(error);
        alert('Gagal menghapus kontak');
      }
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
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
              Loading...
            </div>
          ) : contacts.length === 0 ? (
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