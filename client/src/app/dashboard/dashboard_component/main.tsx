'use client';
import React from 'react';
import Link from 'next/link';
import { useUserContext } from '../Context/UserContext';

const money = (value: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(value || 0);
const actions = [
  { title: 'Add money or withdraw', description: 'Manage your NGN wallet', href: '/dashboard/wallet', icon: '₦' },
  { title: 'Buy airtime & data', description: 'Top up any supported network', href: '/dashboard/airtime', icon: '◉' },
  { title: 'TV & electricity', description: 'Pay subscriptions and bills', href: '/dashboard/subscription', icon: '▣' },
  { title: 'Request a flight', description: 'Ask our travel desk for options', href: '/dashboard/flights', icon: '✈' },
];

export default function Main() {
  const { user, isLoading } = useUserContext();
  return <main style={{ maxWidth: 1100, margin: '28px auto', padding: '0 18px 48px', color: '#173044' }}>
    <section style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, alignItems: 'center', background: '#123747', color: '#fff', padding: 28, borderRadius: 18 }}>
      <div><p style={{ color: '#9fe0cf', margin: 0 }}>YOUR SUBHUB247 ACCOUNT</p><h1 style={{ margin: '8px 0' }}>Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</h1><p style={{ margin: 0, opacity: .8 }}>Airtime, bills, wallet, and travel requests in one place.</p></div>
      <div><span style={{ opacity: .75 }}>Wallet balance</span><h2 style={{ margin: '6px 0' }}>{isLoading ? 'Loading…' : money(user?.wallet?.balance || 0)}</h2><Link href="/dashboard/wallet" style={{ color: '#a4eddb' }}>Manage wallet →</Link></div>
    </section>
    <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 15, marginTop: 22 }}>
      {actions.map(action => <Link key={action.href} href={action.href} style={{ textDecoration: 'none', color: 'inherit', background: '#fff', border: '1px solid #e2e9ef', borderRadius: 14, padding: 20, minHeight: 115, boxShadow: '0 6px 22px #102a3b0a' }}><span style={{ color: '#087965', fontSize: 25 }}>{action.icon}</span><h3 style={{ margin: '10px 0 4px' }}>{action.title}</h3><p style={{ color: '#718094', margin: 0 }}>{action.description}</p></Link>)}
    </section>
    <p style={{ fontSize: 13, color: '#7a8797', marginTop: 20 }}>Demo mode is simulated and does not deliver real services or move real money.</p>
  </main>;
}
