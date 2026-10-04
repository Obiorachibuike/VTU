'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import '../styles/overview.css';
import api, { apiErrorMessage, formatNaira } from '../../utils/api';
import { useUserContext } from '../Context/UserContext';

interface WalletData {
  balance: number;
  currency: string;
  stats: { totalDeposited: number; totalWithdrawn: number; totalSpent: number; transactionCount: number };
  recent: any[];
}

const QUICK_ACTIONS = [
  { href: '/dashboard/airtime', label: 'Airtime', icon: '📱', desc: 'Top up any network' },
  { href: '/dashboard/data', label: 'Data', icon: '🌐', desc: 'Cheap data bundles' },
  { href: '/dashboard/subscription', label: 'TV Subs', icon: '📺', desc: 'DStv • GOtv • Startimes' },
  { href: '/dashboard/pay_bills', label: 'Electricity', icon: '💡', desc: 'Prepaid & postpaid' },
  { href: '/dashboard/flights', label: 'Flights', icon: '✈️', desc: 'Book & pay from wallet' },
  { href: '/dashboard/wallet', label: 'Fund Wallet', icon: '💳', desc: 'Deposit or withdraw' },
];

const STATUS_STYLES: Record<string, string> = {
  completed: 'ov-badge success',
  pending: 'ov-badge pending',
  failed: 'ov-badge failed',
  refunded: 'ov-badge failed',
};

const CATEGORY_LABELS: Record<string, string> = {
  deposit: 'Wallet Deposit',
  withdrawal: 'Withdrawal',
  airtime: 'Airtime',
  data: 'Data Purchase',
  tv: 'TV Subscription',
  electricity: 'Electricity',
  flight: 'Flight Booking',
  referral: 'Referral Bonus',
  refund: 'Refund',
};

const Overview = () => {
  const { user } = useUserContext();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get('/wallet');
        if (mounted) setWallet(res.data);
      } catch (err) {
        if (mounted) setError(apiErrorMessage(err, 'Could not load wallet'));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const balance = wallet?.balance ?? user?.wallet?.balance ?? 0;

  return (
    <div className="overview">
      <div className="ov-hero">
        <div className="ov-balance-card">
          <small>Available Balance</small>
          <h1>{loading ? '…' : formatNaira(balance)}</h1>
          <div className="ov-stats">
            <div>
              <small>Deposited</small>
              <p>{formatNaira(wallet?.stats.totalDeposited ?? 0)}</p>
            </div>
            <div>
              <small>Spent</small>
              <p>{formatNaira(wallet?.stats.totalSpent ?? 0)}</p>
            </div>
            <div>
              <small>Withdrawn</small>
              <p>{formatNaira(wallet?.stats.totalWithdrawn ?? 0)}</p>
            </div>
          </div>
          <div className="ov-actions">
            <Link href="/dashboard/wallet?tab=deposit" className="ov-btn primary">＋ Deposit</Link>
            <Link href="/dashboard/wallet?tab=withdraw" className="ov-btn ghost">↗ Withdraw</Link>
          </div>
        </div>

        <div className="ov-welcome">
          <h2>Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋</h2>
          <p>All your bill payments, airtime, data, subscriptions and flights — one wallet, one checkout.</p>
        </div>
      </div>

      <div className="ov-grid">
        {QUICK_ACTIONS.map((a) => (
          <Link key={a.href} href={a.href} className="ov-tile">
            <span className="ov-tile-icon">{a.icon}</span>
            <span className="ov-tile-label">{a.label}</span>
            <span className="ov-tile-desc">{a.desc}</span>
          </Link>
        ))}
      </div>

      <div className="ov-recent">
        <div className="ov-recent-head">
          <h3>Recent Transactions</h3>
          <Link href="/dashboard/transactions" className="ov-link">View all →</Link>
        </div>
        {error && <p className="ov-error">{error}</p>}
        {!error && (wallet?.recent?.length ?? 0) === 0 && !loading && (
          <p className="ov-empty">No transactions yet — fund your wallet to get started.</p>
        )}
        <div className="ov-table-wrap">
          {wallet?.recent && wallet.recent.length > 0 && (
            <table className="ov-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {wallet.recent.map((t) => (
                  <tr key={t._id || t.reference}>
                    <td>
                      <span className="ov-desc">{t.description}</span>
                      <span className="ov-ref">{t.reference}</span>
                    </td>
                    <td>{CATEGORY_LABELS[t.category] || t.category}</td>
                    <td className={t.type === 'credit' ? 'ov-amount credit' : 'ov-amount debit'}>
                      {t.type === 'credit' ? '+' : '-'}{formatNaira(t.amount)}
                    </td>
                    <td><span className={STATUS_STYLES[t.status] || 'ov-badge'}>{t.status}</span></td>
                    <td>{new Date(t.date).toLocaleDateString('en-NG', { day: '2-digit', month: 'short' })} · {t.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;
