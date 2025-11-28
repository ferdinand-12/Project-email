// src/app/email/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { getCurrentUser, moveToTrash, toggleStar, getEmail } from '@/lib/db';
import { Email } from '@/types';

export default function EmailDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const emailId = params.id as string;
  const folder = (searchParams.get('folder') as any) || 'inbox';
  const [email, setEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmail();
  }, [emailId, router]);

  const loadEmail = async () => {
    setLoading(true);
    try {
      const user = await getCurrentUser();
      if (!user) {
        router.push('/login');
        return;
      }

      if (!emailId) return;

      const foundEmail = await getEmail(emailId);
      if (!foundEmail) {
        alert('Email tidak ditemukan');
        router.push('/inbox');
        return;
      }
      setEmail(foundEmail);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = () => {
    router.push(`/reply/${emailId}?folder=${folder}`);
  };

  const handleForward = () => {
    if (!email) return;
    const fwd = {
      subject: 'Fwd: ' + (email.subject || ''),
      body: `\n\n---------- Forwarded message ---------\nFrom: ${email.from}\nDate: ${new Date(email.time).toLocaleString()}\nSubject: ${email.subject || '(no subject)'}\n\n${email.body}`,
    };
    sessionStorage.setItem('pingme_forward', JSON.stringify(fwd));
    router.push('/compose');
  };

  const handleDelete = async () => {
    if (confirm('Pindahkan ke Trash?')) {
      await moveToTrash(emailId);
      alert('Email dipindahkan ke Trash');
      router.push('/inbox');
    }
  };

  const handleToggleStar = async () => {
    if (!email) return;
    const newStatus = !email.starred;
    // Optimistic update
    setEmail({ ...email, starred: newStatus });
    await toggleStar(emailId, email.starred);
  };

  if (loading) {
    return (
      <div className="layout">
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Loading email...</p>
        </div>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="layout">
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Email tidak ditemukan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="layout">
      <Sidebar />

      <div style={{ flex: 1 }}>
        <div className="topbar">
          <h2 style={{ margin: 0, color: '#fff' }}>{email.subject || '(no subject)'}</h2>
        </div>

        <div className="card">
          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              padding: '16px',
              borderRadius: '6px',
              marginBottom: '20px',
            }}
          >
            <div style={{ marginBottom: '8px', color: '#e6eef6' }}>
              <strong style={{ color: '#9aa3ad' }}>From:</strong> {email.from}
            </div>
            <div style={{ marginBottom: '8px', color: '#e6eef6' }}>
              <strong style={{ color: '#9aa3ad' }}>To:</strong> {email.to.join(', ')}
            </div>
            <div style={{ color: '#e6eef6' }}>
              <strong style={{ color: '#9aa3ad' }}>Date:</strong> {new Date(email.time).toLocaleString('id-ID')}
            </div>
          </div>

          <div
            style={{
              lineHeight: '1.7',
              fontSize: '14px',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              color: '#e6eef6',
            }}
          >
            {email.body}
          </div>

          {email.attachments && email.attachments.length > 0 && (
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '13px', color: '#9aa3ad', marginBottom: '10px' }}>
                {email.attachments.length} Attachments
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {email.attachments.map((att, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      fontSize: '13px',
                      color: '#e6eef6',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>📎</span>
                    {att}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div
            style={{
              marginTop: '30px',
              display: 'flex',
              gap: '8px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <button className="button" onClick={handleReply}>
              Reply
            </button>
            <button className="btn-ghost" onClick={handleForward}>
              Forward
            </button>
            <button
              className="btn-ghost"
              onClick={handleToggleStar}
              style={{ color: email.starred ? '#fbbf24' : 'var(--muted)' }}
            >
              {email.starred ? '★ Unstar' : '☆ Star'}
            </button>
            <button
              className="btn-ghost"
              onClick={handleDelete}
              style={{ color: 'var(--danger)', marginLeft: 'auto' }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}