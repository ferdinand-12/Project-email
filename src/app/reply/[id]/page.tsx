'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { currentUser, sendEmail } from '@/lib/db';
import { Email } from '@/types';

export default function ReplyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams(); // Use useParams hook
  const emailId = params.id as string; // Get ID from params
  const folder = (searchParams.get('folder') as any) || 'inbox';
  
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [originalEmail, setOriginalEmail] = useState<Email | null>(null);

  useEffect(() => {
    if (!emailId) return;
    
    const user = currentUser();
    if (!user) {
      router.push('/login');
      return;
    }

    // Find email in all folders
    let email: Email | null = null;
    const allFolders: Array<keyof typeof user.emails> = ['inbox', 'sent', 'drafts', 'trash', 'starred'];
    
    for (const f of allFolders) {
      email = user.emails[f].find(e => e.id === emailId) || null;
      if (email) break;
    }

    if (!email) {
      alert('Email tidak ditemukan');
      router.push('/inbox');
      return;
    }

    setOriginalEmail(email);
    
    // Pre-fill reply data
    setTo(email.from);
    setSubject('Re: ' + (email.subject || ''));
    setBody(
      `\n\n------- Original Message -------\nFrom: ${email.from}\nDate: ${new Date(email.time).toLocaleString()}\nSubject: ${email.subject || '(no subject)'}\n\n${email.body}`
    );
  }, [emailId, router]);

  const handleSend = () => {
    setError('');
    const user = currentUser();
    if (!user) return;

    if (!body.trim()) {
      setError('Isi balasan wajib diisi.');
      return;
    }

    sendEmail(user.email, [to], subject, body);
    alert('Balasan berhasil dikirim!');
    router.push('/sent');
  };

  const handleCancel = () => {
    router.push(`/email/${emailId}?folder=${folder}`);
  };

  return (
    <div className="layout">
      <Sidebar />

      <div style={{ flex: 1 }}>
        <div className="topbar">
          <h2 style={{ margin: 0 }}>Reply to Email</h2>
        </div>

        <div className="card">
          {originalEmail && (
            <div
              style={{
                background: 'rgba(255,255,255,0.03)',
                padding: '12px',
                borderRadius: '6px',
                marginBottom: '16px',
              }}
            >
              <div className="small">
                Replying to: <span style={{ color: '#bfe9ff' }}>{to}</span>
              </div>
              <div className="small" style={{ marginTop: '4px' }}>
                Subject: {subject}
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="small">To</label>
            <input
              type="text"
              value={to}
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
          </div>

          <div className="form-group">
            <label className="small">Your Reply</label>
            <textarea
              rows={12}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your reply..."
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
            <button className="button" onClick={handleSend}>
              Send Reply
            </button>
            <button className="btn-ghost" onClick={handleCancel}>
              Cancel
            </button>
          </div>

          {error && <p className="error" style={{ display: 'block' }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}