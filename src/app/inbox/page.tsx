'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { currentUser, toggleStar } from '@/lib/db';
import { Email } from '@/types';

export default function InboxPage() {
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
    setEmails(user.emails.inbox);
  };

  const handleStar = (emailId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleStar(emailId, 'inbox');
    loadEmails(); // Reload to reflect changes
  };

  return (
    <div className="layout">
      <Sidebar />

      <div style={{ flex: 1 }}>
        <div className="topbar">
          <h2 style={{ margin: 0, color: '#fff' }}>Inbox</h2>
        </div>

        <div className="card">
          <ul className="email-list">
            {emails.length === 0 ? (
              <li className="small" style={{ padding: '20px', textAlign: 'center', color: '#9aa3ad' }}>
                Inbox kosong
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
                      {email.from}
                    </div>
                    <div className="meta" style={{ color: '#9aa3ad' }}>
                      <span style={{ color: '#e6eef6' }}>{email.subject || '(no subject)'}</span> — {email.body.slice(0, 60)}...
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="small" style={{ minWidth: '80px', color: '#9aa3ad' }}>
                      {new Date(email.time).toLocaleDateString()}
                    </div>
                    <button
                      onClick={(e) => handleStar(email.id, e)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '18px',
                        color: email.starred ? '#fbbf24' : '#4b5563',
                        padding: '4px 8px'
                      }}
                      title={email.starred ? "Unstar" : "Star"}
                    >
                      {email.starred ? '★' : '☆'}
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