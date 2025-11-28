'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { currentUser, logoutUser } from '@/lib/db';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const u = currentUser();
    if (!u) {
      router.push('/login');
    } else {
      setUser(u);
    }
  }, [router]);

  const handleLogout = () => {
    if (confirm('Logout dari PingMe?')) {
      logoutUser();
      router.push('/login');
    }
  };

  if (!user) return null;

  return (
    <div className="sidebar card">
      <button
        className="compose-btn"
        onClick={() => router.push('/compose')}
      >
        ✉ Compose
      </button>

      <div className="menu">
        <Link
          href="/inbox"
          className={pathname === '/inbox' ? 'active' : ''}
        >
          Inbox
          <span className="badge">{user.emails.inbox.length}</span>
        </Link>
        <Link
          href="/starred"
          className={pathname === '/starred' ? 'active' : ''}
        >
          Starred
        </Link>
        <Link
          href="/drafts"
          className={pathname === '/drafts' ? 'active' : ''}
        >
          Drafts
          <span className="badge">{user.emails.drafts.length}</span>
        </Link>
        <Link href="/sent" className={pathname === '/sent' ? 'active' : ''}>
          Sent Items
        </Link>
        <Link href="/trash" className={pathname === '/trash' ? 'active' : ''}>
          Deleted Items
        </Link>
        <Link
          href="/contacts"
          className={pathname === '/contacts' ? 'active' : ''}
        >
          Contacts
        </Link>
        <Link
          href="/profile"
          className={pathname === '/profile' ? 'active' : ''}
        >
          Profile
        </Link>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ fontWeight: 700, color: '#bfe9ff' }}>{user.name}</div>
        <div className="small">{user.email}</div>
        <button
          onClick={handleLogout}
          className="link"
          style={{
            fontSize: '12px',
            marginTop: '8px',
            display: 'block',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}