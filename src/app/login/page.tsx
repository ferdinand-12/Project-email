'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/db';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Semua field wajib diisi.');
      return;
    }

    try {
      await loginUser(email, password);
      router.push('/inbox');
    } catch (err: any) {
      setError(err.message || 'Login gagal.');
    }
  };

  return (
    <div className="center-card">
      <div className="logo">
        <div className="mark">P</div>
        <div style={{ color: '#7dd3fc', fontWeight: 700, fontSize: '20px' }}>
          PingMe
        </div>
      </div>

      <h1 className="title">Sign in</h1>
      <p className="small" style={{ textAlign: 'center', color: 'var(--muted)' }}>
        to continue to your account
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="small">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label className="small">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <button type="submit" className="button">
            Sign in
          </button>
        </div>

        <p style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px', fontSize: '13px', color: 'var(--muted)' }}>
          <span>Demo: alice@example.com / password123</span>
          <a href="/signup" className="link">
            Create account
          </a>
        </p>

        {error && (
          <p className="error" style={{ display: 'block', marginTop: '10px' }}>
            {error}
          </p>
        )}
      </form>
    </div>
  );
}