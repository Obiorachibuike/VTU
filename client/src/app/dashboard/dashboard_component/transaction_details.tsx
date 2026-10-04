'use client';

import React, { useCallback, useEffect, useState } from 'react';
import '../styles/transaction_details.css';
import Link from 'next/link';
import SingleTransaction from './single_transaction';
import api, { apiErrorMessage, formatNaira } from '../../utils/api';

const PAGE_SIZE = 8;

const CATEGORIES = ['', 'deposit', 'withdrawal', 'airtime', 'data', 'tv', 'electricity', 'flight', 'referral'];
const CATEGORY_LABELS: Record<string, string> = {
  '': 'All types',
  deposit: 'Deposits',
  withdrawal: 'Withdrawals',
  airtime: 'Airtime',
  data: 'Data',
  tv: 'TV Subscription',
  electricity: 'Electricity',
  flight: 'Flights',
  referral: 'Referral',
};

function TransactionDetails() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
      if (category) params.set('category', category);
      const res = await api.get(`/services/transactions?${params.toString()}`);
      setTransactions(res.data.transactions || []);
      setPages(res.data.pages || 1);
      setTotal(res.data.total || 0);
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not load transactions'));
    } finally {
      setLoading(false);
    }
  }, [page, category]);

  useEffect(() => {
    load();
  }, [load]);

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div>
      <section className="transaction-section">
        <div className="activity">
          <Link href="/dashboard/transactions">
            <div className="title">
              <i className="uil uil-clock-three"></i>
              <span className="text">Transaction</span>
            </div>
          </Link>

          <div className="main-wrapper col-md-9 ms-sm-auto py-4 col-lg-9 px-md-4 border-start">
            <div className="row my-4">
              <div className="col-lg-12 col-12">
                <div className="custom-block bg-white">
                  <h5 className="mb-4">Account Activities {total > 0 && <span className="tx-count">({total})</span>}</h5>

                  <div className="tx-filters">
                    <select
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setPage(1);
                      }}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                      ))}
                    </select>
                  </div>

                  {error && <p className="tx-error">{error}</p>}
                  {loading && <p className="tx-muted">Loading transactions…</p>}
                  {!loading && transactions.length === 0 && !error && (
                    <p className="tx-muted">No transactions yet — fund your wallet and make your first payment.</p>
                  )}

                  {transactions.length > 0 && (
                    <div className="table-responsive">
                      <table className="account-table table">
                        <thead>
                          <tr>
                            <th scope="col">Date</th>
                            <th scope="col">Time</th>
                            <th scope="col">Description</th>
                            <th scope="col">Payment Type</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Balance</th>
                            <th scope="col">Status</th>
                          </tr>
                        </thead>

                        <tbody>
                          {transactions.map((t) => (
                            <tr key={t._id}>
                              <SingleTransaction
                                date={fmtDate(t.date)}
                                time={t.time}
                                description={`${t.description} · ${t.reference}`}
                                payment={CATEGORY_LABELS[t.category] || t.category}
                                amount={`${t.type === 'credit' ? '+' : '-'}${formatNaira(t.amount)}`}
                                balance={formatNaira(t.balanceAfter)}
                                status={t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                              />
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {pages > 1 && (
                    <div className="pagination">
                      {Array(pages)
                        .fill(0)
                        .map((_, index) => (
                          <li key={index} className={`page-item ${index + 1 === page ? 'active' : ''}`}>
                            <div className="page-link" onClick={() => setPage(index + 1)}>
                              {index + 1}
                            </div>
                          </li>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TransactionDetails;
