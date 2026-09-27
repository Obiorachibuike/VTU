'use client';
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useUserContext } from '../dashboard/Context/UserContext';
import './admin.css';

type Withdrawal = { reference: string; userId: string; name: string; email: string; amount: number; details: { bankName: string; accountName: string; accountNumber: string }; date: string };
type Order = { reference: string; userId: string; name: string; email: string; amount: number; description: string; metadata: { service: string; recipient: string; productCode?: string; network?: string }; date: string };
type Flight = { reference: string; origin: string; destination: string; tripType: string; departureDate: string; returnDate?: string; passengers: { firstName: string; lastName: string; email: string; phone: string }[]; status: string; user: { name: string; email: string } };
const cash = (amount: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);

export default function AdminPage() {
  const { user, isLoading } = useUserContext();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]); const [orders, setOrders] = useState<Order[]>([]); const [flights, setFlights] = useState<Flight[]>([]);
  const [quotes, setQuotes] = useState<Record<string, string>>({}); const [notes, setNotes] = useState<Record<string, string>>({});
  const [error, setError] = useState(''); const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false);
  const reload = useCallback(async () => {
    const [w, o, f] = await Promise.all([
      axios.get('/api/wallet/admin/withdrawals'), axios.get('/api/services/admin/pending'), axios.get('/api/flights/admin/bookings'),
    ]);
    setWithdrawals(w.data.withdrawals || []); setOrders(o.data.orders || []); setFlights(f.data.bookings || []);
  }, []);
  useEffect(() => {
    if (!isLoading && user?.role === 'admin') void reload().catch(() => setError('Could not load administrator queues.'));
  }, [isLoading, user, reload]);
  const action = async (operation: () => Promise<unknown>, success: string) => {
    setBusy(true); setError(''); setMessage('');
    try { await operation(); setMessage(success); await reload(); }
    catch (err) { setError(axios.isAxiosError(err) ? err.response?.data?.error || 'Action failed.' : 'Action failed.'); }
    finally { setBusy(false); }
  };
  if (isLoading) return <main className="admin-page">Loading administrator session…</main>;
  if (user?.role !== 'admin') return <main className="admin-page"><h1>Administrator access</h1><p>Sign in with an administrator account to manage service queues.</p><a href="/admin_login">Administrator sign in</a></main>;
  return <main className="admin-page"><header><div><span>SUBHUB247 OPERATIONS</span><h1>Admin workspace</h1><p>Review payout requests, reconcile uncertain provider outcomes, and quote flight requests.</p></div><button onClick={async () => { await axios.post('/api/auth/logout'); window.location.assign('/admin_login'); }}>Sign out</button></header>
    {(error || message) && <div className={`admin-alert ${error ? 'error' : ''}`}>{error || message}</div>}
    <section className="admin-section"><h2>Withdrawal requests <small>{withdrawals.length} pending</small></h2>{withdrawals.length === 0 ? <p>Nothing awaiting review.</p> : withdrawals.map(item => <article key={item.reference}><div><strong>{cash(item.amount)} · {item.name}</strong><span>{item.email} · {item.details.bankName} · {item.details.accountName} · {item.details.accountNumber}</span><small>{item.reference} · {new Date(item.date).toLocaleString()}</small></div><div className="admin-buttons"><button disabled={busy} onClick={() => void action(() => axios.post(`/api/wallet/admin/withdrawals/${item.userId}/${item.reference}`, { decision: 'approve' }), 'Withdrawal marked approved. Complete the actual bank transfer separately.')}>Mark paid / approve</button><button className="danger" disabled={busy} onClick={() => void action(() => axios.post(`/api/wallet/admin/withdrawals/${item.userId}/${item.reference}`, { decision: 'reject' }), 'Withdrawal rejected and wallet refunded.')}>Reject & refund</button></div></article>)}</section>
    <section className="admin-section"><h2>Unresolved service orders <small>{orders.length} pending</small></h2>{orders.length === 0 ? <p>Nothing awaiting reconciliation.</p> : orders.map(item => <article key={item.reference}><div><strong>{cash(item.amount)} · {item.description}</strong><span>{item.email} · {item.metadata?.service} · {item.metadata?.recipient}</span><small>{item.reference} · {new Date(item.date).toLocaleString()}</small></div><div className="admin-buttons"><button disabled={busy} onClick={() => void action(() => axios.patch(`/api/services/admin/pending/${item.userId}/${item.reference}`, { decision: 'complete' }), 'Order marked completed.')}>Confirm delivered</button><button className="danger" disabled={busy} onClick={() => void action(() => axios.patch(`/api/services/admin/pending/${item.userId}/${item.reference}`, { decision: 'refund' }), 'Wallet refunded.')}>Refund</button></div></article>)}</section>
    <section className="admin-section"><h2>Flight request desk <small>{flights.length} open</small></h2>{flights.length === 0 ? <p>No open flight requests.</p> : flights.map(item => <article className="flight-admin-item" key={item.reference}><div><strong>{item.origin} → {item.destination} · {item.tripType}</strong><span>{item.user?.name} ({item.user?.email}) · Depart {new Date(item.departureDate).toLocaleDateString()}{item.returnDate ? ` · Return ${new Date(item.returnDate).toLocaleDateString()}` : ''}</span>{item.passengers?.map((passenger, index) => <small key={index}>{passenger.firstName} {passenger.lastName} · {passenger.email} · {passenger.phone}</small>)}<small>{item.reference} · {item.status}</small></div><form onSubmit={event => { event.preventDefault(); void action(() => axios.patch(`/api/flights/admin/bookings/${item.reference}`, { decision: 'quote', quotedAmount: Number(quotes[item.reference]), note: notes[item.reference] }), 'Fare quote sent to customer.'); }}><input aria-label="Fare quote in NGN" type="number" min="1" required placeholder="Fare (NGN)" value={quotes[item.reference] || ''} onChange={event => setQuotes({ ...quotes, [item.reference]: event.target.value })} /><input aria-label="Quote note" placeholder="Airline, times, baggage, expiry…" value={notes[item.reference] || ''} onChange={event => setNotes({ ...notes, [item.reference]: event.target.value })} /><button disabled={busy}>Send quote</button><button type="button" className="danger" disabled={busy} onClick={() => void action(() => axios.patch(`/api/flights/admin/bookings/${item.reference}`, { decision: 'cancel', note: 'Unable to fulfil this request.' }), 'Flight request closed.')}>Close request</button></form></article>)}</section>
    <p className="admin-warning">Approving a withdrawal only records the review decision; complete and reconcile the bank transfer separately. A flight quote is not a ticket. Provider orders must be reconciled against the vendor before you mark them delivered or refund.</p>
  </main>;
}
