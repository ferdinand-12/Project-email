'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { getCurrentUser, getEmails } from '@/lib/db';
import { Email } from '@/types';

export default function SentPage() {
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
      const data = await getEmails('sent');
      setEmails(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      <Sidebar />

      <div style={{ flex: 1 }}>
        <div className="topbar">
          <h2 style={{ margin: 0 }}>Sent Mail</h2>
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
          )}
        </div>
      </div>
    </div>
  );
}