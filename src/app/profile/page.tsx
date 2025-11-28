'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { currentUser, updateProfile, changePassword, isValidFullName, isValidPhone, logoutUser } from '@/lib/db';

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const user = currentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone || '');
  }, [router]);

  const handleSaveProfile = () => {
    setError('');
    setSuccess('');

    if (!name) {
      setError('Nama lengkap wajib diisi.');
      return;
    }

    if (!isValidFullName(name)) {
      setError('Nama lengkap 3-32 karakter, hanya huruf.');
      return;
    }

    if (phone && !isValidPhone(phone)) {
      setError('Nomor HP harus format 08xx, panjang 10-16 digit.');
      return;
    }

    updateProfile({ name, phone });
    setSuccess('Profile berhasil diupdate!');
    
    setTimeout(() => {
      router.refresh();
    }, 1000);
  };

  const handleChangePassword = () => {
    setError('');
    setSuccess('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Semua field password wajib diisi.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Kata sandi baru minimal 8 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    const ok = changePassword(oldPassword, newPassword);
    if (!ok) {
      setError('Kata sandi lama salah.');
      return;
    }

    alert('Password berhasil diubah. Silakan login kembali.');
    logoutUser();
    router.push('/login');
  };

  return (
    <div className="layout">
      <Sidebar />

      <div style={{ flex: 1 }}>
        <div className="topbar">
          <h2 style={{ margin: 0 }}>Profile Settings</h2>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Personal Information</h3>

          <div className="form-group">
            <label className="small">Email Address (cannot be changed)</label>
            <input
              type="text"
              value={email}
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
          </div>

          <div className="form-group">
            <label className="small">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
          </div>

          <div className="form-group">
            <label className="small">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08xxxxxxxxxx"
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="button" onClick={handleSaveProfile}>
              Save Changes
            </button>
          </div>

          <hr
            style={{
              border: 'none',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              margin: '30px 0',
            }}
          />

          <h3>Change Password</h3>

          <div className="form-group">
            <label className="small">Current Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter current password"
            />
          </div>

          <div className="form-group">
            <label className="small">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min 8 characters)"
            />
          </div>

          <div className="form-group">
            <label className="small">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-ghost" onClick={handleChangePassword}>
              Change Password
            </button>
          </div>

          {error && (
            <p className="error" style={{ display: 'block', marginTop: '10px' }}>
              {error}
            </p>
          )}
          {success && (
            <p style={{ color: '#4ade80', fontSize: '13px', marginTop: '10px' }}>
              {success}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}