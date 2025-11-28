// src/app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { currentUser } from '@/lib/db';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const user = currentUser();

    if (user) {
      // If logged in, redirect to inbox
      router.push('/inbox');
    } else {
      // If not logged in, redirect to login
      router.push('/login');
    }
  }, [router]);

  // Show loading while redirecting
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(180deg, #0b1115, #0f1720)',
      color: '#e6eef6'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div className="logo" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
          <div className="mark">P</div>
          <div style={{ color: '#7dd3fc', fontWeight: 700, fontSize: '28px' }}>
            PingMe
          </div>
        </div>
        <p>Loading...</p>


      </div>
    </div>
  );
}