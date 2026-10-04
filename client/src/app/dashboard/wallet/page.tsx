'use client';

import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SideNav from '../dashboard_component/side_nav';
import Top from '../dashboard_component/top';
import '../styles/airtime.css';
import '../styles/wallet_page.css';
import api, { apiErrorMessage, formatNaira } from '../../utils/api';
import { useUserContext } from '../Context/UserContext';

const QUICK_AMOUNTS = [1000, 2000, 5000, 10000, 20000, 50000];

interface Bank { code: string; name: string }
interface SavedAccount { id: string; bankName: string; bankCode: string; accountNumber: string; accountName: string; isDefault: boolean }
interface Txn { _id: string; reference: string; description: string; type: string; amount: number; status: string; date: string; time: string; category: string }

function WalletInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<'overview' | 'deposit' | 'withdraw'>(() => (searchParams.get('tab') as any) || 'overview');

  const [balance, setBalance] = useState<number | null>(null);
  const [txns, setTxns] = useState<Txn[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [accounts, setAccounts] = useState<SavedAccount[]>([]);

  // deposit state
  const [depositAmount, setDepositAmount] = useState('');
  const [depositBusy, setDepositBusy] = useState(false);
  const [depositError, setDepositError] = useState('');

  // withdraw state
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [useNewAccount, setUseNewAccount] = useState(false);
  const [newBank, setNewBank] = useState('');
  const [newAccountNumber, setNewAccountNumber] = useState('');
  const [withdrawBusy, setWithdrawBusy] = useState(false);
  const [withdrawError, setWithdrawError] = useState('');
  const [withdrawNote, setWithdrawNote] = useState('');

  const loadAll = useCallback(async () => {
    try {
      const [walletRes, banksRes, accountsRes] = await Promise.all([
        api.get('/wallet'),
        api.get('/wallet/banks'),
        api.get('/wallet/accounts'),
      ]);
      setBalance(walletRes.data.balance);
      setTxns(walletRes.data.recent || []);
      setBanks(banksRes.data.banks || []);
      setAccounts(accountsRes.data.accounts || []);
      if (accountsRes.data.accounts?.length) setSelectedAccount(accountsRes.data.accounts[0].id);
      else setUseNewAccount(true);
    } catch (err) {
      setWithdrawError(apiErrorMessage(err, 'Could not load wallet data'));
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const startDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDepositError('');
    const amount = Number(depositAmount);
    if (!amount || amount < 100) {
      setDepositError('Minimum deposit is ₦100');
      return;
    }
    setDepositBusy(true);
    try {
      const res = await api.post('/wallet/deposit/init', { amount, method: 'card' });
      router.push(res.data.paymentUrl); // /pay/<reference> (demo) or Paystack checkout
    } catch (err) {
      setDepositError(apiErrorMessage(err, 'Could not start deposit'));
    } finally {
      setDepositBusy(false);
    }
  };

  const removeAccount = async (id: string) => {
    if (!confirm('Remove this saved account?')) return;
    try {
      await api.delete(`/wallet/accounts/${id}`);
      const remaining = accounts.filter((a) => a.id !== id);
      setAccounts(remaining);
      if (selectedAccount === id) {
        if (remaining.length) setSelectedAccount(remaining[0].id);
        else { setSelectedAccount(''); setUseNewAccount(true); }
      }
    } catch (err) {
      setWithdrawError(apiErrorMessage(err, 'Could not remove account'));
    }
  };

  const submitWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError('');
    setWithdrawNote('');
    const amount = Number(withdrawAmount);
    if (!amount || amount < 500) {
      setWithdrawError('Minimum withdrawal is ₦500');
      return;
    }
    if (balance !== null && amount > balance) {
      setWithdrawError('Insufficient wallet balance');
      return;
    }

    setWithdrawBusy(true);
    try {
      let payload: any = { amount };
      if (useNewAccount) {
        if (!newBank || !/^\d{10}$/.test(newAccountNumber)) {
          setWithdrawError('Select a bank and enter a valid 10-digit account number');
          setWithdrawBusy(false);
          return;
        }
        const bank = banks.find((b) => b.code === newBank);
        payload = { ...payload, bankName: bank?.name, bankCode: newBank, accountNumber: newAccountNumber, saveAccount: true };
      } else {
        if (!selectedAccount) {
          setWithdrawError('Select a withdrawal account');
          setWithdrawBusy(false);
          return;
        }
        payload = { ...payload, accountId: selectedAccount };
      }

      const res = await api.post('/wallet/withdraw', payload);
      setWithdrawNote(res.data.note || 'Withdrawal successful');
      setWithdrawAmount('');
      await loadAll();
    } catch (err) {
      setWithdrawError(apiErrorMessage(err, 'Withdrawal failed'));
    } finally {
      setWithdrawBusy(false);
    }
  };

  const maskAccount = (num: string) => `••••${String(num).slice(-4)}`;

  return (
    <>
      <SideNav />
      <section className="dashboard">
        <Top />
        <div className="airtime-container">
          <div className="airtime-cont">
            <div className="airtime-content">
              <div className="wp-wrap">
                <div className="wp-header">
                  <h1>Wallet</h1>
                  <div className="wp-balance-pill">
                    Balance: <strong>{balance === null ? '…' : formatNaira(balance)}</strong>
                  </div>
                </div>

                <div className="wp-tabs">
                  {(['overview', 'deposit', 'withdraw'] as const).map((t) => (
                    <button
                      key={t}
                      className={`wp-tab ${tab === t ? 'active' : ''}`}
                      onClick={() => setTab(t)}
                      type="button"
                    >
                      {t === 'overview' ? 'Activity' : t === 'deposit' ? 'Deposit' : 'Withdraw'}
                    </button>
                  ))}
                </div>

                {/* ----------------------------- DEPOSIT ----------------------------- */}
                {tab === 'deposit' && (
                  <div className="wp-card">
                    <h2>Fund your wallet</h2>
                    <p className="wp-muted">Add money instantly with your card. Deposits land in your wallet immediately after payment.</p>
                    <form onSubmit={startDeposit} className="wp-form">
                      <label htmlFor="dep-amount">Amount (NGN)</label>
                      <input
                        id="dep-amount"
                        type="number"
                        min={100}
                        placeholder="e.g. 5000"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        required
                      />
                      <div className="wp-quick">
                        {QUICK_AMOUNTS.map((a) => (
                          <button key={a} type="button" onClick={() => setDepositAmount(String(a))}>₦{a.toLocaleString()}</button>
                        ))}
                      </div>
                      {depositError && <p className="wp-error">{depositError}</p>}
                      <button className="wp-submit" disabled={depositBusy} type="submit">
                        {depositBusy ? 'Starting…' : 'Continue to payment'}
                      </button>
                    </form>
                  </div>
                )}

                {/* ----------------------------- WITHDRAW ---------------------------- */}
                {tab === 'withdraw' && (
                  <div className="wp-card">
                    <h2>Withdraw to bank</h2>
                    <p className="wp-muted">Money is sent to your Nigerian bank account. Withdrawals require at least ₦500.</p>

                    {accounts.length > 0 && (
                      <div className="wp-accounts">
                        {accounts.map((a) => (
                          <div key={a.id} className={`wp-account ${!useNewAccount && selectedAccount === a.id ? 'selected' : ''}`}>
                            <label>
                              <input
                                type="radio"
                                name="wp-account"
                                checked={!useNewAccount && selectedAccount === a.id}
                                onChange={() => { setUseNewAccount(false); setSelectedAccount(a.id); }}
                              />
                              <div>
                                <strong>{a.bankName}</strong>
                                <span>{maskAccount(a.accountNumber)} — {a.accountName}</span>
                              </div>
                            </label>
                            <button className="wp-remove" type="button" onClick={() => removeAccount(a.id)} title="Remove">✕</button>
                          </div>
                        ))}
                        <label className="wp-new-account">
                          <input type="radio" name="wp-account" checked={useNewAccount} onChange={() => setUseNewAccount(true)} />
                          Use a different account
                        </label>
                      </div>
                    )}

                    <form onSubmit={submitWithdrawal} className="wp-form">
                      {useNewAccount && (
                        <>
                          <label htmlFor="w-bank">Bank</label>
                          <select id="w-bank" value={newBank} onChange={(e) => setNewBank(e.target.value)} required>
                            <option value="">Choose bank</option>
                            {banks.map((b) => (
                              <option key={b.code} value={b.code}>{b.name}</option>
                            ))}
                          </select>
                          <label htmlFor="w-acct">Account number</label>
                          <input
                            id="w-acct"
                            type="text"
                            inputMode="numeric"
                            maxLength={10}
                            placeholder="10-digit account number"
                            value={newAccountNumber}
                            onChange={(e) => setNewAccountNumber(e.target.value.replace(/\D/g, ''))}
                            required
                          />
                        </>
                      )}
                      <label htmlFor="w-amount">Amount (NGN)</label>
                      <input
                        id="w-amount"
                        type="number"
                        min={500}
                        placeholder="e.g. 2500"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        required
                      />
                      {withdrawError && <p className="wp-error">{withdrawError}</p>}
                      {withdrawNote && <p className="wp-success">{withdrawNote}</p>}
                      <button className="wp-submit" disabled={withdrawBusy} type="submit">
                        {withdrawBusy ? 'Processing…' : 'Withdraw'}
                      </button>
                    </form>
                  </div>
                )}

                {/* ----------------------------- ACTIVITY ---------------------------- */}
                {tab === 'overview' && (
                  <div className="wp-card">
                    <h2>Recent activity</h2>
                    {txns.length === 0 && <p className="wp-muted">No transactions yet.</p>}
                    {txns.length > 0 && (
                      <div className="wp-txns">
                        {txns.map((t) => (
                          <div key={t._id} className="wp-txn">
                            <div className="wp-txn-main">
                              <span className="wp-txn-desc">{t.description}</span>
                              <span className="wp-txn-meta">{t.reference} · {new Date(t.date).toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' })} · {t.time}</span>
                            </div>
                            <div className="wp-txn-side">
                              <span className={t.type === 'credit' ? 'wp-amt credit' : 'wp-amt debit'}>
                                {t.type === 'credit' ? '+' : '-'}{formatNaira(t.amount)}
                              </span>
                              <span className={`wp-badge ${t.status}`}>{t.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const WalletPage = () => (
  <Suspense fallback={<div style={{ padding: 40 }}>Loading wallet…</div>}>
    <WalletInner />
  </Suspense>
);

export default WalletPage;
