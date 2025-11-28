'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { getCurrentUser, getEmails, restoreFromTrash, deletePermanently } from '@/lib/db';
import { Email } from '@/types';

export default function TrashPage() {
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
      const data = await getEmails('trash');
      setEmails(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await restoreFromTrash(id);
    loadEmails();
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Hapus permanen?')) {
      await deletePermanently(id);
      loadEmails();
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
          {loading ? (
            <div className="small" style={{ padding: '20px', textAlign: 'center' }}>
              Loading...
            </div>
          ) : (
            <ul className="email-list">
              {emails.length === 0 ? (
                <li className="small" style={{ padding: '20px', textAlign: 'center' }}>
                  Sampah kosong
                </li>
              ) : (
                emails.map((email) => (
                  <li
                    key={email.id}
                    onClick={() => router.push(`/email/${email.id}?folder=trash`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{email.from}</div>
                      <div className="meta">
                        {email.subject || '(no subject)'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={(e) => handleRestore(e, email.id)} className="button" style={{ padding: '4px 8px', fontSize: '12px' }}>
                        Restore
                      </button>
                      <button onClick={(e) => handleDelete(e, email.id)} className="button" style={{ padding: '4px 8px', fontSize: '12px', background: '#ef4444' }}>
                        Delete
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