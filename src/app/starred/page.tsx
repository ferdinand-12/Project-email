'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { getCurrentUser, getEmails, toggleStar } from '@/lib/db';
import { Email } from '@/types';

export default function StarredPage() {
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
      const data = await getEmails('starred');
      setEmails(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnstar = async (e: React.MouseEvent, email: Email) => {
    e.stopPropagation();
    // Optimistic update
    setEmails(prev => prev.filter(em => em.id !== email.id));
    await toggleStar(email.id, true); // true because it was starred
  };

  return (
    <div className="layout">
      <Sidebar />

      <div style={{ flex: 1 }}>
        <div className="topbar">
          <h2 style={{ margin: 0 }}>Starred</h2>
        </div>

        <div className="card">
          {loading ? (
            <div className="small" style={{ padding: '20px', textAlign: 'center' }}>
              Loading...
            </div>
          ) : (
            <ul className="email-list">
              {emails.length === 0 ? (
                <li className="small" style={{ padding: '20px', textAlign: 'center' }}>
                  Tidak ada pesan berbintang
                </li>
              ) : (
                emails.map((email) => (
                  <li
                    key={email.id}
                    onClick={() => router.push(`/email/${email.id}?folder=inbox`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{email.from}</div>
                      <div className="meta">
                        {email.subject || '(no subject)'} — {email.body.slice(0, 60)}...
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleUnstar(e, email)}
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