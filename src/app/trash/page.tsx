'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { currentUser, restoreFromTrash, deletePermanently } from '@/lib/db';
import { Email } from '@/types';

export default function TrashPage() {
  const router = useRouter();
  const [emails, setEmails] = useState<Email[]>([]);

  useEffect(() => {
    const user = currentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setEmails(user.emails.trash);
  }, [router]);

  const handleRestore = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    restoreFromTrash(id);
    alert('Email dipulihkan ke Inbox');
    // Reload emails
    const user = currentUser();
    if (user) setEmails(user.emails.trash);
  };

  const handleDeletePermanent = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Hapus email ini secara permanen? Tindakan ini tidak dapat dibatalkan.')) {
      deletePermanently(id);
      // Reload emails
      const user = currentUser();
      if (user) setEmails(user.emails.trash);
    }
  };

  return (
    <div className="layout">
      <Sidebar />

      <div style={{ flex: 1 }}>
        <div className="topbar">
          <h2 style={{ margin: 0 }}>Trash</h2>
        </div>

        <div className="card">
          <ul className="email-list">
            {emails.length === 0 ? (
              <li className="small" style={{ padding: '20px', textAlign: 'center' }}>
                Trash kosong
              </li>
            ) : (
              emails.map((email) => (
                <li key={email.id}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{email.from}</div>
                    <div className="meta">
                      {email.subject || '(no subject)'} — {email.body.slice(0, 60)}...
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="small" style={{ minWidth: '80px' }}>
                      {new Date(email.time).toLocaleDateString()}
                    </div>
                    <div
                      className="small link"
                      onClick={(e) => handleRestore(email.id, e)}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      Restore
                    </div>
                    <div
                      className="small link"
                      onClick={(e) => handleDeletePermanent(email.id, e)}
                      style={{ whiteSpace: 'nowrap', color: 'var(--danger)' }}
                    >
                      Delete Forever
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}