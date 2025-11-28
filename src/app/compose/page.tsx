'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { currentUser, sendEmail, saveDraft } from '@/lib/db';

export default function ComposePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const draftId = searchParams.get('draft');

  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const user = currentUser();
    if (!user) {
      router.push('/login');
      return;
    }

    // Load draft if editing
    if (draftId) {
      const draft = user.emails.drafts.find((d) => d.id === draftId);
      if (draft) {
        setTo(draft.to.join(', '));
        setSubject(draft.subject);
        setBody(draft.body);
      }
    }
  }, [draftId, router]);

  const handleSend = () => {
    setError('');
    const user = currentUser();
    if (!user) return;

    if (!to) {
      setError('Penerima wajib diisi.');
      return;
    }

    const tos = to.split(',').map((s) => s.trim());
    if (!body) {
      setError('Isi email wajib diisi.');
      return;
    }

    sendEmail(user.email, tos, subject, body);
    alert('Pesan berhasil dikirim!');
    router.push('/sent');
  };

  const handleSaveDraft = () => {
    const tos = to ? to.split(',').map((s) => s.trim()) : [];
    saveDraft(subject, body, tos);
    alert('Draft tersimpan.');
    router.push('/drafts');
  };

  return (
    <div className="layout">
      <Sidebar />

      <div style={{ flex: 1 }}>
        <div className="topbar">
          <h2 style={{ margin: 0 }}>Compose Email</h2>
        </div>

        <div className="card">
          <div className="form-group">
            <label className="small">To (comma separated)</label>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
            />
          </div>

          <div className="form-group">
            <label className="small">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
            />
          </div>

          <div className="form-group">
            <label className="small">Body</label>
            <textarea
              rows={12}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your message here..."
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
            <button className="button" onClick={handleSend}>
              Send
            </button>
            <button className="btn-ghost" onClick={handleSaveDraft}>
              Save Draft
            </button>
            <button className="btn-ghost" onClick={() => router.push('/inbox')}>
              Cancel
            </button>
          </div>

          {error && <p className="error" style={{ display: 'block' }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}