'use client';

import React, { useEffect, useState } from 'react';
import SideNav from '../dashboard_component/side_nav';
import Top from '../dashboard_component/top';
import '../styles/airtime.css';
import '../styles/flights.css';
import api, { apiErrorMessage, formatNaira } from '../../utils/api';
import { useUserContext } from '../Context/UserContext';

interface Airport { code: string; city: string; name: string }
interface Flight {
  id: string; airline: string; flightNo: string;
  from: Airport; to: Airport;
  departTime: string; duration: string; price: number; basePrice: number;
  cabin: string; aircraft: string; baggage: string; seatsLeft: number;
}
interface Passenger { fullName: string; type: 'adult' | 'child'; passport?: string }
interface Booking {
  _id: string; reference: string; amount: number; status: string; description: string;
  metadata: { flight: any; departDate: string; cabin: string; passengers: Passenger[] };
}

const CABINS = [
  { id: 'economy', label: 'Economy', mult: '×1' },
  { id: 'premium', label: 'Premium', mult: '×1.6' },
  { id: 'business', label: 'Business', mult: '×2.4' },
];

const todayStr = () => new Date().toISOString().slice(0, 10);

function FlightsInner() {
  const { refreshUser } = useUserContext();
  const [airports, setAirports] = useState<Airport[]>([]);
  const [origin, setOrigin] = useState('LOS');
  const [destination, setDestination] = useState('ABV');
  const [date, setDate] = useState('');
  const [cabin, setCabin] = useState('economy');

  const [flights, setFlights] = useState<Flight[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');

  const [selected, setSelected] = useState<Flight | null>(null);
  const [passengers, setPassengers] = useState<Passenger[]>([{ fullName: '', type: 'adult' }]);
  const [contactEmail, setContactEmail] = useState('');
  const [booking, setBooking] = useState(false);
  const [receipt, setReceipt] = useState<any>(null);

  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [view, setView] = useState<'search' | 'bookings'>('search');

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/services/airports');
        setAirports(res.data.airports || []);
      } catch (err) {
        setError(apiErrorMessage(err, 'Could not load airports'));
      }
    })();
  }, []);

  const search = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');
    if (origin === destination) {
      setError('Origin and destination must differ');
      return;
    }
    setSearching(true);
    setReceipt(null);
    try {
      const params = new URLSearchParams({ origin, destination, cabin });
      const res = await api.get(`/services/flights/search?${params.toString()}`);
      setFlights(res.data.flights || []);
    } catch (err) {
      setError(apiErrorMessage(err, 'Flight search failed'));
    } finally {
      setSearching(false);
    }
  };

  const loadBookings = async () => {
    try {
      const res = await api.get('/services/flights/bookings');
      setBookings(res.data.bookings || []);
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not load your bookings'));
    }
  };

  useEffect(() => {
    if (view === 'bookings') loadBookings();
  }, [view]);

  const openBooking = (flight: Flight) => {
    setSelected(flight);
    setPassengers([{ fullName: '', type: 'adult' }]);
    setReceipt(null);
    setError('');
  };

  const addPassenger = () => {
    if (passengers.length < 6) setPassengers([...passengers, { fullName: '', type: 'adult' }]);
  };

  const removePassenger = (idx: number) => {
    setPassengers(passengers.filter((_, i) => i !== idx));
  };

  const total = selected ? selected.price * passengers.length : 0;

  const confirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setError('');
    for (const p of passengers) {
      if (!p.fullName || p.fullName.trim().length < 3) {
        setError('Please enter the full name of every passenger');
        return;
      }
    }
    setBooking(true);
    try {
      const res = await api.post('/services/flights/book', {
        flightId: selected.id,
        date: date || todayStr(),
        cabin,
        passengers,
        contactEmail,
      });
      setReceipt(res.data.receipt);
      setSelected(null);
      await Promise.all([refreshUser(), loadBookings(), search()]);
    } catch (err) {
      setError(apiErrorMessage(err, 'Booking failed'));
    } finally {
      setBooking(false);
    }
  };

  return (
    <>
      <SideNav />
      <section className="dashboard">
        <Top />
        <div className="airtime-container">
          <div className="airtime-cont">
            <div className="airtime-content">
              <div className="fl-wrap">
                <div className="fl-header">
                  <h1>✈️ Book Flights</h1>
                  <div className="fl-views">
                    <button className={view === 'search' ? 'active' : ''} onClick={() => setView('search')} type="button">Search flights</button>
                    <button className={view === 'bookings' ? 'active' : ''} onClick={() => setView('bookings')} type="button">My bookings</button>
                  </div>
                </div>

                {receipt && (
                  <div className="fl-receipt">
                    <div>
                      <strong>🎫 Booking confirmed</strong>
                      <p>{receipt.description} — {formatNaira(receipt.amount)}</p>
                    </div>
                    <code>{receipt.reference}</code>
                  </div>
                )}

                {view === 'search' && (
                  <>
                    <form className="fl-search" onSubmit={search}>
                      <div className="fl-field">
                        <label>From</label>
                        <select value={origin} onChange={(e) => setOrigin(e.target.value)}>
                          {airports.map((a) => <option key={a.code} value={a.code}>{a.city} ({a.code})</option>)}
                        </select>
                      </div>
                      <button type="button" className="fl-swap" title="Swap" onClick={() => { setOrigin(destination); setDestination(origin); }}>⇄</button>
                      <div className="fl-field">
                        <label>To</label>
                        <select value={destination} onChange={(e) => setDestination(e.target.value)}>
                          {airports.map((a) => <option key={a.code} value={a.code}>{a.city} ({a.code})</option>)}
                        </select>
                      </div>
                      <div className="fl-field">
                        <label>Date</label>
                        <input type="date" min={todayStr()} value={date} onChange={(e) => setDate(e.target.value)} />
                      </div>
                      <div className="fl-field">
                        <label>Cabin</label>
                        <select value={cabin} onChange={(e) => setCabin(e.target.value)}>
                          {CABINS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                        </select>
                      </div>
                      <button className="fl-search-btn" type="submit" disabled={searching}>
                        {searching ? 'Searching…' : 'Search'}
                      </button>
                    </form>

                    {error && <p className="fl-error">{error}</p>}

                    <div className="fl-results">
                      {flights === null && !searching && (
                        <p className="fl-empty">Pick a route and hit <strong>Search</strong> to see available flights.</p>
                      )}
                      {searching && <p className="fl-empty">Searching flights…</p>}
                      {flights?.length === 0 && !searching && (
                        <p className="fl-empty">No flights found for this route yet — try another pair of cities.</p>
                      )}
                      {flights?.map((f) => (
                        <div key={f.id} className="fl-card">
                          <div className="fl-airline">
                            <span className="fl-badge">{f.airline.slice(0, 2).toUpperCase()}</span>
                            <div>
                              <strong>{f.airline}</strong>
                              <small>{f.flightNo} · {f.aircraft}</small>
                            </div>
                          </div>
                          <div className="fl-route">
                            <div>
                              <strong>{f.departTime}</strong>
                              <small>{f.from.code} — {f.from.city}</small>
                            </div>
                            <div className="fl-line">
                              <span>{f.duration}</span>
                              <i>———✈———</i>
                            </div>
                            <div>
                              <strong>{f.to.code}</strong>
                              <small>{f.to.city}</small>
                            </div>
                          </div>
                          <div className="fl-buy">
                            <div className="fl-price">
                              <strong>{formatNaira(f.price)}</strong>
                              <small>per passenger · {f.cabin}</small>
                            </div>
                            <button type="button" onClick={() => openBooking(f)}>Select</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {view === 'bookings' && (
                  <div className="fl-bookings">
                    {bookings === null && <p className="fl-empty">Loading bookings…</p>}
                    {bookings?.length === 0 && <p className="fl-empty">No flight bookings yet.</p>}
                    {bookings?.map((b) => (
                      <div key={b._id} className="fl-booking">
                        <div className="fl-booking-main">
                          <strong>{b.metadata?.flight?.from?.city} → {b.metadata?.flight?.to?.city} · {b.metadata?.flight?.airline} {b.metadata?.flight?.flightNo}</strong>
                          <small>
                            Departs {b.metadata?.departDate ? new Date(b.metadata.departDate).toDateString() : ''} at {b.metadata?.flight?.departTime} · {b.metadata?.cabin} · {b.metadata?.passengers?.length} passenger(s)
                          </small>
                          <small className="fl-pax">
                            {b.metadata?.passengers?.map((p) => p.fullName).join(', ')}
                          </small>
                        </div>
                        <div className="fl-booking-side">
                          <strong>{formatNaira(b.amount)}</strong>
                          <span className={`fl-status ${b.status}`}>{b.status}</span>
                          <code>{b.reference}</code>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ------------------------- booking modal ------------------------- */}
                {selected && (
                  <div className="fl-modal" onClick={() => !booking && setSelected(null)}>
                    <form className="fl-modal-card" onClick={(e) => e.stopPropagation()} onSubmit={confirmBooking}>
                      <div className="fl-modal-head">
                        <h3>{selected.airline} {selected.flightNo}</h3>
                        <p>{selected.from.city} ({selected.from.code}) → {selected.to.city} ({selected.to.code}) · {date ? new Date(date).toDateString() : 'Next available date'} · {selected.departTime}</p>
                      </div>

                      {passengers.map((p, i) => (
                        <div className="fl-pax-row" key={i}>
                          <input
                            placeholder={`Passenger ${i + 1} full name`}
                            value={p.fullName}
                            onChange={(e) => {
                              const next = [...passengers];
                              next[i] = { ...next[i], fullName: e.target.value };
                              setPassengers(next);
                            }}
                            required
                          />
                          <select
                            value={p.type}
                            onChange={(e) => {
                              const next = [...passengers];
                              next[i] = { ...next[i], type: e.target.value as 'adult' | 'child' };
                              setPassengers(next);
                            }}
                          >
                            <option value="adult">Adult</option>
                            <option value="child">Child</option>
                          </select>
                          {passengers.length > 1 && (
                            <button type="button" className="fl-pax-remove" onClick={() => removePassenger(i)}>✕</button>
                          )}
                        </div>
                      ))}
                      <button type="button" className="fl-add-pax" onClick={addPassenger} disabled={passengers.length >= 6}>
                        + Add passenger
                      </button>

                      <input
                        className="fl-email"
                        type="email"
                        placeholder="Contact email (ticket delivery)"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                      />

                      <div className="fl-total">
                        <span>{formatNaira(selected.price)} × {passengers.length} passenger(s)</span>
                        <strong>{formatNaira(total)}</strong>
                      </div>
                      <p className="fl-pay-note">Paid instantly from your wallet · baggage: {selected.baggage}</p>

                      <div className="fl-modal-actions">
                        <button type="button" className="fl-btn ghost" onClick={() => setSelected(null)} disabled={booking}>Cancel</button>
                        <button type="submit" className="fl-btn" disabled={booking}>{booking ? 'Paying…' : `Pay ${formatNaira(total)}`}</button>
                      </div>
                    </form>
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

const FlightsPage = () => <FlightsInner />;

export default FlightsPage;
