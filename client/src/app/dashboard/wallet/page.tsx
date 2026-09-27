'use client';
import React, { FormEvent, useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../Layout/Layout';
import { useUserContext } from '../Context/UserContext';
import './wallet-hub.css';

type Tx = { reference?: string; amount: number; type: string; status: string; description?: string; date?: string };
const cash = (value: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(value || 0);

export default function WalletPage() {
  const { user, setUser } = useUserContext();
  const [amount, setAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [pending, setPending] = useState<{reference: string; amount: number; mode: string; authorizationUrl?: string} | null>(null);
  const [transactions, setTransactions] = useState<Tx[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const reload = async () => {
    const { data } = await axios.get('/api/wallet/transactions');
    setTransactions(data.transactions || []);
    if (user) setUser({ ...user, wallet: data.wallet, transactions: data.transactions });
  };
  useEffect(() => {
    void reload().catch(() => setError('Please sign in to use your wallet.'));
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const reference = params.get('reference');
      if (params.get('payment') === 'return' && reference) {
        axios.post(`/api/wallet/deposits/${encodeURIComponent(reference)}/verify`).then(async () => {
          setMessage('Your deposit has been confirmed.');
          await reload();
        }).catch(() => setError('The payment has not been confirmed yet. Refresh in a moment or contact support.'));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startDeposit = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setError(''); setMessage('');
    try {
      const { data } = await axios.post('/api/wallet/deposits', { amount: Number(amount) });
      setPending(data);
      if (data.authorizationUrl) window.location.assign(data.authorizationUrl);
      else setMessage(data.message || 'Demo deposit ready. Confirm only to add non-cash demo funds.');
    } catch (err) { setError(axios.isAxiosError(err) ? err.response?.data?.error || 'Could not start deposit.' : 'Could not start deposit.'); }
    finally { setBusy(false); }
  };

  const confirmDemo = async () => {
    if (!pending) return;
    setBusy(true); setError('');
    try {
      await axios.post(`/api/wallet/deposits/${encodeURIComponent(pending.reference)}/verify`, { confirmDemo: true });
      setPending(null); setMessage('Demo deposit added to the demo wallet. It is not real cash.'); await reload();
    } catch (err) { setError(axios.isAxiosError(err) ? err.response?.data?.error || 'Could not confirm deposit.' : 'Could not confirm deposit.'); }
    finally { setBusy(false); }
  };

  const requestWithdrawal = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setError(''); setMessage('');
    try {
      const { data } = await axios.post('/api/wallet/withdrawals', { amount: Number(withdrawAmount), bankName, accountName, accountNumber });
      setMessage(`Withdrawal request ${data.reference} is pending manual review.`); setWithdrawAmount(''); await reload();
    } catch (err) { setError(axios.isAxiosError(err) ? err.response?.data?.error || 'Could not request withdrawal.' : 'Could not request withdrawal.'); }
    finally { setBusy(false); }
  };

  return <Layout><div className="wallet-hub">
    <div className="wallet-heading"><div><p className="wallet-eyebrow">YOUR MONEY</p><h1>Wallet</h1><p>Fund your balance, track activity, and request a bank withdrawal.</p></div><div className="wallet-balance"><span>Available balance</span><strong>{cash(user?.wallet?.balance || 0)}</strong></div></div>
    {(error || message) && <div className={`wallet-alert ${error ? 'is-error' : ''}`} role="status">{error || message}</div>}
    <div className="wallet-grid">
      <form className="wallet-card" onSubmit={startDeposit}><h2>Add money</h2><p>Pay securely by card or bank transfer. Minimum ₦100.</p><label htmlFor="deposit-amount">Amount (NGN)</label><input id="deposit-amount" type="number" min="100" max="1000000" step="1" required value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 5,000"/><button disabled={busy}>{busy ? 'Please wait…' : 'Continue to deposit'}</button>{pending?.mode === 'demo' && <div className="demo-confirm"><strong>Demo payment only</strong><p>This will add simulated funds, not actual money.</p><button type="button" disabled={busy} onClick={confirmDemo}>Simulate successful deposit</button></div>}</form>
      <form className="wallet-card" onSubmit={requestWithdrawal}><h2>Withdraw to bank</h2><p>Requests are held for review. Funds are reserved from your available balance.</p><label htmlFor="withdraw-amount">Amount (NGN)</label><input id="withdraw-amount" type="number" min="100" max="1000000" step="1" required value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} placeholder="e.g. 2,000"/><label htmlFor="bank-name">Bank</label><input id="bank-name" required maxLength={80} value={bankName} onChange={e => setBankName(e.target.value)} placeholder="Bank name"/><label htmlFor="account-name">Account name</label><input id="account-name" required maxLength={100} value={accountName} onChange={e => setAccountName(e.target.value)} placeholder="Name on account"/><label htmlFor="account-number">10-digit account number</label><input id="account-number" required inputMode="numeric" pattern="[0-9]{10}" maxLength={10} value={accountNumber} onChange={e => setAccountNumber(e.target.value)} placeholder="0123456789"/><button disabled={busy}>{busy ? 'Please wait…' : 'Request withdrawal'}</button><small>Bank payouts are not automatic yet; an administrator reviews each request.</small></form>
    </div>
    <section className="wallet-card wallet-activity"><h2>Recent transactions</h2>{transactions.length === 0 ? <p>No wallet activity yet.</p> : <div className="wallet-table-wrap"><table><thead><tr><th>When</th><th>Details</th><th>Amount</th><th>Status</th><th>Reference</th></tr></thead><tbody>{transactions.slice(0, 30).map((tx, i) => <tr key={tx.reference || i}><td>{tx.date ? new Date(tx.date).toLocaleString() : '—'}</td><td>{tx.description || 'Wallet transaction'}</td><td className={tx.type === 'credit' || tx.status === 'refunded' ? 'credit' : 'debit'}>{tx.type === 'credit' || tx.status === 'refunded' ? '+' : '−'}{cash(tx.amount)}</td><td>{tx.status}</td><td>{tx.reference || '—'}</td></tr>)}</tbody></table></div>}</section>
  </div></Layout>;
}
