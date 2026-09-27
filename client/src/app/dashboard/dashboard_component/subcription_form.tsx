'use client';

import React, { useEffect, useMemo, useState } from 'react';
import '../styles/subcription_form.css';
import '../styles/service_shared.css';
import api, { apiErrorMessage, formatNaira } from '../../utils/api';
import { useUserContext } from '../Context/UserContext';

interface TvPlan { id: string; label: string; price: number; months: number }
interface TvProvider { id: string; name: string; image: string; plans: TvPlan[] }

const SubscriptionForm = () => {
  const { refreshUser } = useUserContext();
  const [providers, setProviders] = useState<TvProvider[]>([]);
  const [providerId, setProviderId] = useState('');
  const [planId, setPlanId] = useState('');
  const [smartcard, setSmartcard] = useState('');
  const [months, setMonths] = useState(1);
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState<any>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/services/catalog');
        setProviders(res.data.tvProviders || []);
      } catch (err) {
        setError(apiErrorMessage(err, 'Could not load subscription plans'));
      }
    })();
  }, []);

  const provider = providers.find((p) => p.id === providerId);
  const plan = provider?.plans.find((p) => p.id === planId);
  const total = plan ? plan.price * months : 0;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setReceipt(null);
    setBusy(true);
    try {
      const res = await api.post('/services/tv', { provider: providerId, planId, smartcard, months });
      setReceipt(res.data.receipt);
      refreshUser();
      setSmartcard('');
      setMonths(1);
      setPlanId('');
    } catch (err) {
      setError(apiErrorMessage(err, 'Subscription payment failed'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="form-cont" style={{ marginTop: '50px' }}>
      <form onSubmit={submit} className="airtime-form form">
        <div className="airtime-header-cont">
          <h1 className="airtime-header">Pay TV Subscription</h1>
        </div>

        <div className="network-cont">
          {provider && <img src={provider.image} alt={provider.name} className="network" />}
        </div>

        <div className="form-data">
          <label>Provider</label>
          <div className="sv-chips">
            {providers.map((p) => (
              <button type="button" key={p.id} className={`sv-chip ${providerId === p.id ? 'active' : ''}`} onClick={() => { setProviderId(p.id); setPlanId(''); }}>
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {provider && (
          <div className="form-data">
            <label htmlFor="plan">Package</label>
            <select id="plan" value={planId} onChange={(e) => setPlanId(e.target.value)} required>
              <option value="">Choose package</option>
              {provider.plans.map((p) => (
                <option key={p.id} value={p.id}>{p.label} — {formatNaira(p.price)}</option>
              ))}
            </select>
          </div>
        )}

        <div className="form-data">
          <label htmlFor="smartcard">Smartcard / IUC Number</label>
          <input
            id="smartcard"
            type="text"
            inputMode="numeric"
            placeholder="e.g. 7042381937"
            value={smartcard}
            onChange={(e) => setSmartcard(e.target.value.replace(/\D/g, ''))}
            required
            maxLength={15}
          />
        </div>

        <div className="form-data">
          <label htmlFor="months">Months</label>
          <select id="months" value={months} onChange={(e) => setMonths(Number(e.target.value))}>
            {[1, 2, 3, 6, 12].map((m) => (
              <option key={m} value={m}>{m} month{m > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>

        {plan && (
          <div className="sv-total">
            <span>{provider?.name} {plan.label} × {months} month{months > 1 ? 's' : ''}</span>
            <strong>{formatNaira(total)}</strong>
          </div>
        )}

        {error && <p className="sv-msg error">{error}</p>}
        {receipt && (
          <div className="sv-receipt">
            <strong>✅ Subscription active</strong> — {receipt.description}
            <span className="sv-ref">{receipt.reference}</span>
          </div>
        )}

        <button className="sv-submit" type="submit" disabled={busy || !providerId || !planId || !smartcard}>
          {busy ? 'Processing…' : total ? `Pay ${formatNaira(total)}` : 'Pay Subscription'}
        </button>
        <p className="sv-note">Instant activation on your decoder · paid from wallet</p>
      </form>
    </div>
  );
};

export default SubscriptionForm;
