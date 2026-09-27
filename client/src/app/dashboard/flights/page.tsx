'use client';
import React, { FormEvent, useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../Layout/Layout';
import './flights.css';

type Booking = { reference: string; tripType: string; origin: string; destination: string; departureDate: string; returnDate?: string; status: string; createdAt: string; note?: string; quotedAmount?: number };
export default function FlightsPage() {
  const [tripType, setTripType] = useState('one-way');
  const [origin, setOrigin] = useState(''); const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState(''); const [returnDate, setReturnDate] = useState('');
  const [firstName, setFirstName] = useState(''); const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState(''); const [phone, setPhone] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]); const [message, setMessage] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const reload = async () => { const { data } = await axios.get('/api/flights/bookings'); setBookings(data.bookings || []); };
  useEffect(() => { void reload().catch(() => setError('Sign in to request a flight.')); }, []);
  const acceptQuote = async (reference: string) => {
    setError(''); setMessage('');
    try { const { data } = await axios.post(`/api/flights/bookings/${encodeURIComponent(reference)}/accept-quote`); setMessage(data.warning); await reload(); }
    catch (err) { setError(axios.isAxiosError(err) ? err.response?.data?.error || 'Could not accept quote.' : 'Could not accept quote.'); }
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setError(''); setMessage('');
    try {
      const { data } = await axios.post('/api/flights/bookings', { tripType, origin, destination, departureDate, returnDate: tripType === 'round-trip' ? returnDate : undefined, passengers: [{ firstName, lastName, email, phone }] });
      setMessage(`${data.notice} Request reference: ${data.booking.reference}`); await reload();
    } catch (err) { setError(axios.isAxiosError(err) ? err.response?.data?.error || 'Could not submit request.' : 'Could not submit request.'); }
    finally { setBusy(false); }
  };
  return <Layout><main className="flight-page"><div className="flight-hero"><span>TRAVEL DESK</span><h1>Plan your next flight</h1><p>Send a flight request and our team will check availability and get back to you with a fare.</p></div>
    <div className="flight-disclaimer"><strong>Important:</strong> This form submits a booking request only. It does not reserve a seat, charge your wallet, or issue an airline ticket. A booking is confirmed only after an agent sends and validates your ticket.</div>
    {error && <div className="flight-alert error">{error}</div>}{message && <div className="flight-alert success">{message}</div>}
    <form className="flight-form" onSubmit={submit}><h2>Flight request</h2><div className="flight-fields"><label>Trip type<select value={tripType} onChange={e => setTripType(e.target.value)}><option value="one-way">One way</option><option value="round-trip">Round trip</option></select></label><label>From airport code<input value={origin} onChange={e => setOrigin(e.target.value.toUpperCase())} pattern="[A-Za-z]{3}" maxLength={3} placeholder="LOS" required /></label><label>To airport code<input value={destination} onChange={e => setDestination(e.target.value.toUpperCase())} pattern="[A-Za-z]{3}" maxLength={3} placeholder="ABV" required /></label><label>Departure date<input type="date" value={departureDate} min={new Date(Date.now()+86400000).toISOString().slice(0,10)} onChange={e => setDepartureDate(e.target.value)} required /></label>{tripType === 'round-trip' && <label>Return date<input type="date" value={returnDate} min={departureDate || undefined} onChange={e => setReturnDate(e.target.value)} required /></label>}</div>
    <h3>Passenger</h3><div className="flight-fields"><label>First name<input value={firstName} onChange={e => setFirstName(e.target.value)} autoComplete="given-name" required /></label><label>Last name<input value={lastName} onChange={e => setLastName(e.target.value)} autoComplete="family-name" required /></label><label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required /></label><label>Phone<input type="tel" value={phone} onChange={e => setPhone(e.target.value)} autoComplete="tel" required /></label></div><button disabled={busy}>{busy ? 'Sending request…' : 'Request flight options'}</button></form>
    <section className="flight-requests"><h2>Your requests</h2>{!bookings.length ? <p>No flight requests yet.</p> : bookings.map(booking => <article key={booking.reference}><div><strong>{booking.origin} → {booking.destination}</strong><span>{new Date(booking.departureDate).toLocaleDateString()} · {booking.tripType}</span></div><div className="flight-status">{booking.status.replaceAll('_',' ')}<small>{booking.reference}</small>{booking.quotedAmount ? <><strong>Quote: ₦{booking.quotedAmount.toLocaleString()}</strong>{booking.status === 'quoted' && <button type="button" onClick={() => acceptQuote(booking.reference)}>Accept quote</button>}</> : null}{booking.note && <small>{booking.note}</small>}</div></article>)}</section>
  </main></Layout>;
}
