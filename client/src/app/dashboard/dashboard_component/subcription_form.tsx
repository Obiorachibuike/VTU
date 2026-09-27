'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserContext } from '../Context/UserContext';
import '../styles/subcription_form.css';

type Plan = { code: string; network: string; label: string; price: number };
export default function SubscriptionForm() {
  const { user, setUser } = useUserContext();
  const [plans, setPlans] = useState<Plan[]>([]); const [provider, setProvider] = useState(''); const [productCode, setProductCode] = useState('');
  const [decoder, setDecoder] = useState(''); const [error, setError] = useState(''); const [notice, setNotice] = useState(''); const [busy, setBusy] = useState(false);
  useEffect(() => { axios.get('/api/services/catalog').then(({ data }) => setPlans(data.tv || [])).catch(() => setError('Could not load TV packages.')); }, []);
  const selected = plans.find(plan => plan.code === productCode);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError(''); setNotice(''); setBusy(true);
    try {
      const { data } = await axios.post('/api/services/purchase', { service: 'tv', productCode, recipient: decoder });
      setNotice(data.message); if (user) setUser({ ...user, wallet: data.wallet, transactions: data.transactions || user.transactions });
      setProductCode(''); setDecoder('');
    } catch (err) { setError(axios.isAxiosError(err) ? err.response?.data?.error || 'Subscription failed.' : 'Subscription failed.'); }
    finally { setBusy(false); }
  };
  const providers = Array.from(new Set(plans.map(plan => plan.network)));
  return <div className="form-cont" style={{ marginTop: 50 }}><form onSubmit={submit} className="airtime-form form"><div className="airtime-header-cont"><h1 className="airtime-header">TV subscription</h1></div>
    <div className="form-data"><label htmlFor="tv-provider">TV provider</label><select id="tv-provider" value={provider} onChange={e => { setProvider(e.target.value); setProductCode(''); }} required><option value="">Choose provider</option>{providers.map(item => <option key={item}>{item}</option>)}</select></div>
    <div className="form-data"><label htmlFor="tv-plan">Package</label><select id="tv-plan" value={productCode} onChange={e => setProductCode(e.target.value)} required disabled={!provider}><option value="">Choose package</option>{plans.filter(plan => plan.network === provider).map(plan => <option key={plan.code} value={plan.code}>{plan.label} — ₦{plan.price.toLocaleString()}</option>)}</select></div>
    {selected && <p>Charge: <strong>₦{selected.price.toLocaleString()}</strong></p>}
    <div className="form-data"><label htmlFor="decoder-number">Smartcard / decoder number</label><input id="decoder-number" required inputMode="numeric" pattern="[0-9]{6,20}" maxLength={20} value={decoder} onChange={e => setDecoder(e.target.value)} placeholder="Enter decoder number" /></div>
    {error && <p className="error-message" role="alert">{error}</p>}{notice && <p role="status">{notice}</p>}<div className="form-btn"><button type="submit" className="submit" disabled={busy}>{busy ? 'Processing…' : 'Pay from wallet'}</button></div>
  </form></div>;
}
