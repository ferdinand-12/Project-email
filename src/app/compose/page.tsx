'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { getCurrentUser, sendEmail, saveDraft, getEmail } from '@/lib/db';

export default function ComposePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const draftId = searchParams.get('draftId') || searchParams.get('draft'); // Handle both query params

  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkAuthAndLoadDraft();
  }, [draftId, router]);

  const checkAuthAndLoadDraft = async () => {
    const user = await getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }

    if (draftId) {
      const draft = await getEmail(draftId);
      if (draft) {
        setTo(draft.to.join(', '));
        setSubject(draft.subject);
        setBody(draft.body);
      }
    }
  };

  const handleSend = async () => {
    setError('');
    const user = await getCurrentUser();
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

    setLoading(true);
    try {
      await sendEmail(user.email, tos, subject, body);
      alert('Pesan berhasil dikirim!');
      router.push('/sent');
    } catch (err: any) {
      setError(err.message || 'Gagal mengirim pesan.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    const tos = to ? to.split(',').map((s) => s.trim()) : [];
    setLoading(true);
    try {
      await saveDraft(subject, body, tos);
      alert('Draft tersimpan.');
      router.push('/drafts');
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan draft.');
    } finally {
      setLoading(false);
    }
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
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="small">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
            <button className="button" onClick={handleSend} disabled={loading}>
              {loading ? 'Sending...' : 'Send'}
            </button>
            <button className="btn-ghost" onClick={handleSaveDraft} disabled={loading}>
              Save Draft
            </button>
            <button className="btn-ghost" onClick={() => router.push('/inbox')} disabled={loading}>
              Cancel
            </button>
          </div>

          {error && <p className="error" style={{ display: 'block' }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}