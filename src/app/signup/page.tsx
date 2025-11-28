'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUser, isValidEmail, isValidFullName, isValidPhone } from '@/lib/db';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !phone || !password || !confirmPassword) {
      setError('Semua field wajib diisi.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Email tidak valid.');
      return;
    }

    if (password.length < 8) {
      setError('Kata sandi minimal 8 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    if (!isValidFullName(name)) {
      setError('Nama lengkap 3-32 karakter, tanpa angka.');
      return;
    }

    if (!isValidPhone(phone)) {
      setError('Nomor HP harus format 08xx, panjang 10-16 digit.');
      return;
    }

    try {
      await createUser({ email, password, name, phone });
      alert('Registrasi berhasil. Silakan login.');
      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Registrasi gagal.');
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

      <h1 className="title">Create account</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="small">Full name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="small">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="small">Phone (08xx)</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="small">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="small">Confirm password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <button type="submit" className="button">
            Sign up
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '12px', color: 'var(--muted)' }}>
          Already have account?{' '}
          <a href="/login" className="link">
            Sign in
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