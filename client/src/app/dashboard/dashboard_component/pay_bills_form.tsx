'use client';

import React, { useEffect, useState } from 'react';
import '../styles/pay_bills_form.css';
import '../styles/service_shared.css';
import api, { apiErrorMessage, formatNaira } from '../../utils/api';
import { useUserContext } from '../Context/UserContext';

interface Disco { id: string; name: string; image: string }
interface MeterType { id: string; label: string }

const QUICK = [1000, 2000, 5000, 10000];

const PayBillsForm = () => {
  const { refreshUser } = useUserContext();
  const [discos, setDiscos] = useState<Disco[]>([]);
  const [meterTypes, setMeterTypes] = useState<MeterType[]>([]);
  const [disco, setDisco] = useState('');
  const [meterType, setMeterType] = useState('prepaid');
  const [meterNumber, setMeterNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState<any>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/services/catalog');
        setDiscos(res.data.discos || []);
        setMeterTypes(res.data.meterTypes || []);
      } catch (err) {
        setError(apiErrorMessage(err, 'Could not load providers'));
      }
    })();
  }, []);

  const activeDisco = discos.find((d) => d.id === disco);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setReceipt(null);
    setBusy(true);
    try {
      const res = await api.post('/services/electricity', {
        disco, meterType, meterNumber, amount: Number(amount), phone: phone || undefined,
      });
      setReceipt(res.data.receipt);
      refreshUser();
      setMeterNumber('');
      setAmount('');
    } catch (err) {
      setError(apiErrorMessage(err, 'Electricity payment failed'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="form-cont" style={{ marginTop: '50px' }}>
      <form onSubmit={submit} className="airtime-form form">
        <div className="airtime-header-cont">
          <h1 className="airtime-header">Electricity Bills</h1>
        </div>

        <div className="network-cont">
          {activeDisco && <img src={activeDisco.image} alt={activeDisco.name} className="network" />}
        </div>

        <div className="form-data">
          <label htmlFor="disco">Provider</label>
          <select id="disco" value={disco} onChange={(e) => setDisco(e.target.value)} required>
            <option value="">Choose provider</option>
            {discos.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div className="form-data">
          <label htmlFor="meterType">Meter type</label>
          <select id="meterType" value={meterType} onChange={(e) => setMeterType(e.target.value)}>
            {meterTypes.map((m) => (
              <option key={m.id} value={m.id}>{m.label}</option>
            ))}
          </select>
        </div>

        <div className="form-data">
          <label htmlFor="meterNumber">Meter number</label>
          <input
            id="meterNumber"
            type="text"
            inputMode="numeric"
            placeholder="e.g. 12345678901"
            value={meterNumber}
            onChange={(e) => setMeterNumber(e.target.value.replace(/\D/g, ''))}
            required
            maxLength={13}
          />
        </div>

        <div className="form-data">
          <label htmlFor="amount">Amount (NGN)</label>
          <input
            id="amount"
            type="number"
            min={500}
            max={50000}
            placeholder="e.g. 5000"
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

        <div className="form-data">
          <label htmlFor="phone">Phone (optional — for the token SMS)</label>
          <input
            id="phone"
            type="tel"
            placeholder="e.g. 08031234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={13}
          />
        </div>

        {error && <p className="sv-msg error">{error}</p>}
        {receipt && (
          <div className="sv-receipt">
            <strong>✅ Payment successful</strong> — {receipt.description}
            <span className="sv-ref">{receipt.reference}</span>
            <p style={{ margin: '6px 0 0', fontSize: 12.5 }}>Your prepaid token is delivered by the disco to the phone number provided.</p>
          </div>
        )}

        <button className="sv-submit" type="submit" disabled={busy || !disco || !meterNumber || !amount}>
          {busy ? 'Processing…' : amount ? `Pay ${formatNaira(Number(amount))}` : 'Pay Bill'}
        </button>
        <p className="sv-note">Min ₦500 · Max ₦50,000 · paid from wallet</p>
      </form>
    </div>
  );
};

export default PayBillsForm;
