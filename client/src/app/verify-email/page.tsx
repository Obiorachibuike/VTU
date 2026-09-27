'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function VerifyEmail() {
  const [message, setMessage] = useState('Verifying your email…');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (!token) { setMessage('Invalid or missing verification link.'); setLoading(false); return; }
    axios.get(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then(({ data }) => {
        setMessage(data.message || 'Email verified. Redirecting to sign in…');
        window.setTimeout(() => window.location.assign('/login'), 1800);
      })
      .catch(() => setMessage('Email verification failed. The link may be invalid or expired.'))
      .finally(() => setLoading(false));
  }, []);
  return <main style={{ maxWidth: 560, margin: '12vh auto', padding: 24, fontFamily: 'sans-serif' }}><h1>Email verification</h1><p role="status">{loading ? 'Please wait…' : message}</p><a href="/login">Go to sign in</a></main>;
}
