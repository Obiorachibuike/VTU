'use client';

import React, { useEffect, useState } from 'react';
import '../styles/airtime_form.css';
import '../styles/service_shared.css';
import api, { apiErrorMessage, formatNaira } from '../../utils/api';
import { useUserContext } from '../Context/UserContext';

const QUICK = [100, 200, 500, 1000, 2000, 5000];

interface Network { id: string; name: string; image: string }

const AirtimeForm: React.FC = () => {
  const { refreshUser } = useUserContext();
  const [networks, setNetworks] = useState<Network[]>([]);
  const [network, setNetwork] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState<any>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/services/catalog');
        setNetworks(res.data.networks || []);
      } catch (err) {
        setError(apiErrorMessage(err, 'Could not load networks'));
      }
    })();
  }, []);

  const activeNetwork = networks.find((n) => n.id === network);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setReceipt(null);
    setBusy(true);
    try {
      const res = await api.post('/services/airtime', { network, phone, amount: Number(amount) });
      setReceipt(res.data.receipt);
      refreshUser();
      setPhone('');
      setAmount('');
    } catch (err) {
      setError(apiErrorMessage(err, 'Airtime purchase failed'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="form-cont">
      <form className="airtime-form form" onSubmit={submit}>
        <div className="airtime-header-cont">
          <h1 className="airtime-header">Buy Airtime</h1>
        </div>

        <div className="network-cont">
          {activeNetwork && <img src={activeNetwork.image} alt={activeNetwork.name} className="network" />}
        </div>

        <div className="form-data">
          <label>Network</label>
          <div className="sv-chips">
            {networks.map((n) => (
              <button type="button" key={n.id} className={`sv-chip ${network === n.id ? 'active' : ''}`} onClick={() => setNetwork(n.id)}>
                {n.name}
              </button>
            ))}
          </div>
        </div>

        <div className="form-data">
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            type="tel"
            placeholder="e.g. 08031234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            maxLength={13}
          />
        </div>

        <div className="form-data">
          <label htmlFor="amount">Amount (NGN)</label>
          <input
            id="amount"
            type="number"
            min={50}
            max={20000}
            placeholder="e.g. 500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="sv-chips">
          {QUICK.map((q) => (
            <button type="button" key={q} className="sv-chip" onClick={() => setAmount(String(q))}>₦{q.toLocaleString()}</button>
          ))}
        </div>

        {error && <p className="sv-msg error">{error}</p>}
        {receipt && (
          <div className="sv-receipt">
            <strong>✅ Airtime sent</strong> — {receipt.description}
            <span className="sv-ref">{receipt.reference}</span>
          </div>
        )}

        <button className="sv-submit" type="submit" disabled={busy || !network || !phone || !amount}>
          {busy ? 'Processing…' : amount ? `Pay ${formatNaira(Number(amount))}` : 'Buy Airtime'}
        </button>
        <p className="sv-note">Min ₦100 · Max ₦20,000 per transaction · paid from wallet</p>
      </form>
    </div>
  );
};

export default AirtimeForm;
