// src/app/email/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { currentUser, moveToTrash, toggleStar } from '@/lib/db';
import { Email } from '@/types';

export default function EmailDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams(); // Use useParams hook instead
  const emailId = params.id as string; // Get ID from params
  const folder = (searchParams.get('folder') as any) || 'inbox';
  const [email, setEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!emailId) return;

    console.log('Loading email with ID:', emailId);
    console.log('Folder:', folder);

    const user = currentUser();
    if (!user) {
      router.push('/login');
      return;
    }

    // Search email by ID in ALL folders
    let foundEmail: Email | null = null;

    // Check all folders
    const allFolders: Array<keyof typeof user.emails> = ['inbox', 'sent', 'drafts', 'trash', 'starred'];

    for (const folderName of allFolders) {
      const emailsInFolder = user.emails[folderName];
      console.log(`Checking ${folderName}, count:`, emailsInFolder.length);

      foundEmail = emailsInFolder.find(e => {
        console.log('Comparing:', e.id, 'with', emailId);
        return e.id === emailId;
      }) || null;

      if (foundEmail) {
        console.log(`✅ Found email in ${folderName}:`, foundEmail);
        break;
      }
    }

    if (!foundEmail) {
      console.error('❌ Email not found in any folder. ID:', emailId);
      console.log('Available emails:', user.emails);
      alert('Email tidak ditemukan');
      router.push('/inbox');
      return;
    }

    setEmail(foundEmail);
    setLoading(false);
  }, [emailId, folder, router]);

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

  const handleDelete = () => {
    if (confirm('Pindahkan ke Trash?')) {
      moveToTrash(emailId, folder);
      alert('Email dipindahkan ke Trash');
      router.push('/inbox');
    }
  };

  const handleToggleStar = () => {
    toggleStar(emailId, folder);
    // Reload email
    const user = currentUser();
    if (user) {
      const allFolders: Array<keyof typeof user.emails> = ['inbox', 'sent', 'drafts', 'trash', 'starred'];
      let updated: Email | null = null;

      for (const f of allFolders) {
        updated = user.emails[f].find(e => e.id === emailId) || null;
        if (updated) break;
      }

      if (updated) setEmail(updated);
    }
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