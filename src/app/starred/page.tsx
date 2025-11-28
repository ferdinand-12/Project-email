'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { currentUser, toggleStar } from '@/lib/db';
import { Email } from '@/types';

export default function StarredPage() {
  const router = useRouter();
  const [emails, setEmails] = useState<Email[]>([]);

  useEffect(() => {
    loadEmails();
  }, [router]);

  const loadEmails = () => {
    const user = currentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setEmails(user.emails.starred);
  };

  const handleUnstar = (emailId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleStar(emailId, 'starred');
    // Reload emails after unstar
    loadEmails();
  };

  return (
    <div className="layout">
      <Sidebar />

      <div style={{ flex: 1 }}>
        <div className="topbar">
          <h2 style={{ margin: 0, color: '#fff' }}>Starred</h2>
        </div>

        <div className="card">
          <ul className="email-list">
            {emails.length === 0 ? (
              <li className="small" style={{ padding: '20px', textAlign: 'center', color: '#9aa3ad' }}>
                Tidak ada email yang di-star
              </li>
            ) : (
              emails.map((email) => (
                <li
                  key={email.id}
                  onClick={() => router.push(`/email/${email.id}?folder=inbox`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: '#fff' }}>
                      {email.subject || '(no subject)'}
                    </div>
                    <div className="meta" style={{ color: '#9aa3ad' }}>
                      From: {email.from} — {email.body.slice(0, 60)}...
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="small" style={{ minWidth: '80px', color: '#9aa3ad' }}>
                      {new Date(email.time).toLocaleDateString()}
                    </div>
                    <button
                      onClick={(e) => handleUnstar(email.id, e)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '18px',
                        color: '#fbbf24',
                        padding: '4px 8px'
                      }}
                      title="Unstar"
                    >
                      ★
                    </button>
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