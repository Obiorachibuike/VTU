'use client';

import React, { useEffect, useMemo, useState } from 'react';
import '../styles/data_form.css';
import '../styles/service_shared.css';
import api, { apiErrorMessage, formatNaira } from '../../utils/api';
import { useUserContext } from '../Context/UserContext';

interface Network { id: string; name: string; image: string }
interface Plan { id: string; network: string; label: string; size: string; validity: string; price: number }

const DataForm: React.FC = () => {
  const { refreshUser } = useUserContext();
  const [networks, setNetworks] = useState<Network[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/services/catalog');
        setNetworks(res.data.networks || []);
        setPlans(res.data.dataPlans || []);
      } catch (err) {
        setError(apiErrorMessage(err, 'Could not load data plans'));
      }
    })();
  }, []);

  const networkPlans = useMemo(() => plans.filter((p) => p.network === selectedNetwork), [plans, selectedNetwork]);
  const plan = networkPlans.find((p) => p.id === selectedPlan);
  const activeNetwork = networks.find((n) => n.id === selectedNetwork);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setReceipt(null);
    setBusy(true);
    try {
      const res = await api.post('/services/data', { network: selectedNetwork, planId: selectedPlan, phone });
      setReceipt(res.data.receipt);
      refreshUser();
      setPhone('');
      setSelectedPlan('');
    } catch (err) {
      setError(apiErrorMessage(err, 'Data purchase failed'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="form-cont">
      <form className="data-form form" onSubmit={submit}>
        <div className="data-header-cont">
          <h1 className="data-header">Buy Data</h1>
        </div>

        <div className="network-cont">
          {activeNetwork && <img src={activeNetwork.image} alt={activeNetwork.name} className="network" />}
        </div>

        <div className="form-data">
          <label htmlFor="network">Select Network</label>
          <div className="sv-chips">
            {networks.map((n) => (
              <button
                type="button"
                key={n.id}
                className={`sv-chip ${selectedNetwork === n.id ? 'active' : ''}`}
                onClick={() => { setSelectedNetwork(n.id); setSelectedPlan(''); }}
              >
                {n.name}
              </button>
            ))}
          </div>
        </div>

        {networkPlans.length > 0 && (
          <div className="form-data">
            <label htmlFor="plan">Choose Plan</label>
            <div className="sv-chips">
              {networkPlans.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  className={`sv-chip ${selectedPlan === p.id ? 'active' : ''}`}
                  onClick={() => setSelectedPlan(p.id)}
                >
                  {p.size} · {formatNaira(p.price)}
                </button>
              ))}
            </div>
            {plan && <small className="sv-balance-note">{plan.size} — valid for {plan.validity}</small>}
          </div>
        )}

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

        {plan && (
          <div className="sv-total">
            <span>{plan.size} {activeNetwork?.name} data</span>
            <strong>{formatNaira(plan.price)}</strong>
          </div>
        )}

        {error && <p className="sv-msg error">{error}</p>}
        {receipt && (
          <div className="sv-receipt">
            <strong>✅ Data delivered</strong> — {receipt.description}
            <span className="sv-ref">{receipt.reference}</span>
          </div>
        )}

        <button className="sv-submit" type="submit" disabled={busy || !plan || !phone}>
          {busy ? 'Processing…' : plan ? `Pay ${formatNaira(plan.price)}` : 'Select a plan'}
        </button>
        <p className="sv-note">Paid from your wallet balance · instant delivery</p>
      </form>
    </div>
  );
};

export default DataForm;
