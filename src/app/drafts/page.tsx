'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { currentUser, moveToTrash } from '@/lib/db';
import { Email } from '@/types';

export default function DraftsPage() {
  const router = useRouter();
  const [emails, setEmails] = useState<Email[]>([]);

  useEffect(() => {
    const user = currentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setEmails(user.emails.drafts);
  }, [router]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Hapus draft ini?')) {
      moveToTrash(id, 'drafts');
      router.refresh();
      // Reload emails
      const user = currentUser();
      if (user) setEmails(user.emails.drafts);
    }
  };

  return (
    <div className="layout">
      <Sidebar />

      <div style={{ flex: 1 }}>
        <div className="topbar">
          <h2 style={{ margin: 0 }}>Drafts</h2>
        </div>

        <div className="card">
          <ul className="email-list">
            {emails.length === 0 ? (
              <li className="small" style={{ padding: '20px', textAlign: 'center' }}>
                Tidak ada draft
              </li>
            ) : (
              emails.map((email) => (
                <li
                  key={email.id}
                  onClick={() => router.push(`/compose?draft=${email.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>
                      {email.to.length > 0 ? `To: ${email.to.join(', ')}` : '(no recipient)'}
                    </div>
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
                      onClick={(e) => handleDelete(email.id, e)}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      Delete
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