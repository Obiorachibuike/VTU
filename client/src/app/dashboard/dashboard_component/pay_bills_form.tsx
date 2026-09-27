'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useUserContext } from '../Context/UserContext';
import '../styles/pay_bills_form.css';
const providers = ['AEDC', 'BEDC', 'EKEDC', 'EEDC', 'IBEDC', 'IKEDC', 'KAEDCO', 'KEDCO', 'PHED'];
export default function PayBillsForm() {
  const { user, setUser } = useUserContext();
  const [network, setNetwork] = useState(''); const [meterType, setMeterType] = useState('prepaid'); const [meterNumber, setMeterNumber] = useState('');
  const [amount, setAmount] = useState(''); const [error, setError] = useState(''); const [notice, setNotice] = useState(''); const [busy, setBusy] = useState(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError(''); setNotice(''); setBusy(true);
    try {
      const { data } = await axios.post('/api/services/purchase', { service: 'electricity', network, meterType, recipient: meterNumber, amount: Number(amount) });
      setNotice(data.message); if (user) setUser({ ...user, wallet: data.wallet, transactions: data.transactions || user.transactions });
      setMeterNumber(''); setAmount('');
    } catch (err) { setError(axios.isAxiosError(err) ? err.response?.data?.error || 'Bill payment failed.' : 'Bill payment failed.'); }
    finally { setBusy(false); }
  };
  return <div className="form-cont" style={{ marginTop: 50 }}><form onSubmit={submit} className="airtime-form form"><div className="airtime-header-cont"><h1 className="airtime-header">Electricity bill</h1></div>
    <div className="form-data"><label htmlFor="power-provider">Distribution company</label><select id="power-provider" value={network} onChange={e => setNetwork(e.target.value)} required><option value="">Choose provider</option>{providers.map(name => <option key={name}>{name}</option>)}</select></div>
    <div className="form-data"><label htmlFor="meter-type">Meter type</label><select id="meter-type" value={meterType} onChange={e => setMeterType(e.target.value)}><option value="prepaid">Prepaid</option><option value="postpaid">Postpaid</option></select></div>
    <div className="form-data"><label htmlFor="meter-number">Meter number</label><input id="meter-number" required pattern="[0-9]{6,20}" maxLength={20} inputMode="numeric" value={meterNumber} onChange={e => setMeterNumber(e.target.value)} placeholder="6–20 digit meter number" /></div>
    <div className="form-data"><label htmlFor="bill-amount">Amount (NGN)</label><input id="bill-amount" type="number" required min={500} max={100000} step={1} value={amount} onChange={e => setAmount(e.target.value)} placeholder="Minimum ₦500" /></div>
    <p className="help-text">Meter validation and token delivery require a configured VTU provider. Demo mode does not pay the electricity company.</p>
    {error && <p className="error-message" role="alert">{error}</p>}{notice && <p role="status">{notice}</p>}<div className="form-btn"><button className="submit" disabled={busy}>{busy ? 'Processing…' : 'Pay from wallet'}</button></div>
  </form></div>;
}
