'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { getCurrentUser, getEmails, toggleStar } from '@/lib/db';
import { Email } from '@/types';

export default function InboxPage() {
  const router = useRouter();
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmails();
  }, [router]);

  const loadEmails = async () => {
    setLoading(true);
    try {
      const user = await getCurrentUser();
      if (!user) {
        router.push('/login');
        return;
      }
      const data = await getEmails('inbox');
      setEmails(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStar = async (email: Email, e: React.MouseEvent) => {
    e.stopPropagation();
    // Optimistic update
    const newStatus = !email.starred;
    setEmails(prev => prev.map(em => em.id === email.id ? { ...em, starred: newStatus } : em));

    await toggleStar(email.id, email.starred);
    // No need to reload all emails, optimistic update is enough
  };

  return (
    <div className="layout">
      <Sidebar />

      <div style={{ flex: 1 }}>
        <div className="topbar">
          <h2 style={{ margin: 0, color: '#fff' }}>Inbox</h2>
        </div>

        <div className="card">
          {loading ? (
            <div className="small" style={{ padding: '20px', textAlign: 'center', color: '#9aa3ad' }}>
              Loading...
            </div>
          ) : (
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
                        onClick={(e) => handleStar(email, e)}
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
          )}
        </div>
      </div>
    </div>
  );
}