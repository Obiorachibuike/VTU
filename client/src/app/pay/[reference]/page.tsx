'use client';

import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import '../checkout.css';
import api, { apiErrorMessage, formatNaira } from '../../utils/api';

interface PaymentInfo {
  reference: string;
  amount: number;
  status: string;
  description: string;
  gateway: string;
  merchant: string;
  customer: { name: string; email: string };
}

function CheckoutInner() {
  const params = useParams<{ reference: string }>();
  const reference = params.reference as string;
  const searchParams = useSearchParams();
  const autoVerified = useRef(false);

  const [info, setInfo] = useState<PaymentInfo | null>(null);
  const [phase, setPhase] = useState<'loading' | 'pay' | 'processing' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [newBalance, setNewBalance] = useState<number | null>(null);

  const loadStatus = useCallback(async () => {
    try {
      const res = await api.get('/wallet/deposit/status', { params: { reference } });
      setInfo(res.data);
      setPhase(res.data.status === 'pending' ? 'pay' : res.data.status === 'completed' ? 'success' : 'error');
      if (res.data.status !== 'pending') setMessage(`This payment is already ${res.data.status}.`);
    } catch (err) {
      setMessage(apiErrorMessage(err, 'Payment not found'));
      setPhase('error');
    }
  }, [reference]);

  const runVerification = useCallback(async () => {
    setPhase('processing');
    setMessage('Confirming your payment…');
    try {
      const res = await api.post('/wallet/deposit/verify', { reference });
      setNewBalance(res.data.balance);
      setPhase('success');
      setMessage('Payment successful — your wallet has been funded!');
    } catch (err) {
      setMessage(apiErrorMessage(err, 'We could not confirm this payment'));
      setPhase('error');
    }
  }, [reference]);

  useEffect(() => {
    (async () => {
      await loadStatus();
      // Coming back from Paystack (…?verify=1): confirm the payment right away.
      if (searchParams.get('verify') === '1' && !autoVerified.current) {
        autoVerified.current = true;
        await runVerification();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference]);

  const pay = async (e: React.FormEvent) => {
    e.preventDefault();
    await runVerification();
  };

  return (
    <main className="ck-body">
      <div className="ck-card">
        <div className="ck-brand">
          <span className="ck-logo">S<span>H</span></span>
          <span className="ck-brand-name">SubHub247 <em>Secure Checkout</em></span>
        </div>

        {phase === 'loading' && <p className="ck-note">Loading payment…</p>}

        {phase === 'error' && (
          <div className="ck-state">
            <div className="ck-icon fail">✕</div>
            <h1>Payment problem</h1>
            <p className="ck-note">{message}</p>
            <Link className="ck-btn" href="/dashboard/wallet">Back to wallet</Link>
          </div>
        )}

        {phase === 'success' && (
          <div className="ck-state">
            <div className="ck-icon ok">✓</div>
            <h1>Payment successful</h1>
            <p className="ck-note">{message}</p>
            {info && <p className="ck-amount">{formatNaira(info.amount)} <span>added to wallet</span></p>}
            {newBalance !== null && <p className="ck-note">New balance: <strong>{formatNaira(newBalance)}</strong></p>}
            <div className="ck-actions">
              <Link className="ck-btn" href="/dashboard/wallet">Go to wallet</Link>
              <Link className="ck-btn ghost" href="/dashboard">Dashboard</Link>
            </div>
          </div>
        )}

        {(phase === 'pay' || phase === 'processing') && info && (
          <form onSubmit={pay} className="ck-form">
            <div className="ck-summary">
              <div>
                <small>Merchant</small>
                <p>{info.merchant}</p>
              </div>
              <div>
                <small>Customer</small>
                <p>{info.customer.email}</p>
              </div>
              <div>
                <small>Reference</small>
                <p className="ck-ref">{info.reference}</p>
              </div>
            </div>

            <div className="ck-payline">
              <span>Pay</span>
              <strong>{formatNaira(info.amount)}</strong>
            </div>

            <fieldset className="ck-card-fields" disabled={phase === 'processing'}>
              <legend>Demo card</legend>
              <div className="ck-row">
                <input defaultValue="4084 0840 8408 4081" readOnly aria-label="Card number" />
              </div>
              <div className="ck-row two">
                <input defaultValue="09/30" readOnly aria-label="Expiry" />
                <input defaultValue="408" readOnly aria-label="CVV" />
              </div>
              <p className="ck-note small">
                Demo gateway — click pay to simulate a successful card charge.
                {info.gateway === 'paystack' && ' (Paystack mode: verification is done against Paystack.)'}
              </p>
            </fieldset>

            {phase === 'processing' ? (
              <button className="ck-btn wide" disabled>Processing payment…</button>
            ) : (
              <button className="ck-btn wide" type="submit">Pay {formatNaira(info.amount)}</button>
            )}
            <Link className="ck-cancel" href="/dashboard/wallet?tab=deposit">Cancel payment</Link>
          </form>
        )}
      </div>
      <p className="ck-secure">🔒 Secured with 256-bit encryption</p>
    </main>
  );
}

const CheckoutPage = () => (
  <Suspense fallback={<main className="ck-body"><p className="ck-note">Loading payment…</p></main>}>
    <CheckoutInner />
  </Suspense>
);

export default CheckoutPage;
