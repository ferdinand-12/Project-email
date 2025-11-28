'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { currentUser } from '@/lib/db';
import { Email } from '@/types';

export default function SentPage() {
  const router = useRouter();
  const [emails, setEmails] = useState<Email[]>([]);

  useEffect(() => {
    const user = currentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setEmails(user.emails.sent);
  }, [router]);

  return (
    <div className="layout">
      <Sidebar />

      <div style={{ flex: 1 }}>
        <div className="topbar">
          <h2 style={{ margin: 0 }}>Sent Mail</h2>
        </div>

        <div className="card">
          <ul className="email-list">
            {emails.length === 0 ? (
              <li className="small" style={{ padding: '20px', textAlign: 'center' }}>
                Tidak ada pesan terkirim
              </li>
            ) : (
              emails.map((email) => (
                <li
                  key={email.id}
                  onClick={() => router.push(`/email/${email.id}?folder=sent`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>To: {email.to.join(', ')}</div>
                    <div className="meta">
                      {email.subject || '(no subject)'} — {email.body.slice(0, 60)}...
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="small" style={{ minWidth: '80px' }}>
                      {new Date(email.time).toLocaleDateString()}
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