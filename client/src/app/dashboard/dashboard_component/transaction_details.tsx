'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/transaction_details.css';

type Transaction = { _id?: string; amount: number; type: string; status: string; description?: string; date?: string; time?: string; category?: string; reference?: string };
const money = (value: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(value);

export default function TransactionDetails() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    axios.get('/api/wallet/transactions').then(({ data }) => setTransactions(data.transactions || []))
      .catch(() => setError('Sign in to see your account activity.'));
  }, []);
  return <section className="transaction-section"><div className="custom-block bg-white" style={{ padding: 24, borderRadius: 12 }}>
    <h2>Account activity</h2>
    {error && <p role="alert">{error}</p>}
    {!transactions.length && !error && <p>No transactions yet. Your completed deposits and purchases will appear here.</p>}
    {transactions.length > 0 && <div style={{ overflowX: 'auto' }}><table className="account-table table"><thead><tr><th>Date</th><th>Description</th><th>Type</th><th>Amount</th><th>Status</th><th>Reference</th></tr></thead><tbody>
      {transactions.map((tx, index) => <tr key={tx._id || tx.reference || index}>
        <td>{tx.date ? new Date(tx.date).toLocaleString() : '—'}</td><td>{tx.description || tx.category || 'Transaction'}</td>
        <td>{tx.type}</td><td style={{ color: tx.type === 'credit' || tx.status === 'refunded' ? '#15803d' : '#b91c1c' }}>{tx.type === 'credit' || tx.status === 'refunded' ? '+' : '−'}{money(tx.amount)}</td>
        <td>{tx.status}</td><td>{tx.reference || '—'}</td>
      </tr>)}
    </tbody></table></div>}
  </div></section>;
}
