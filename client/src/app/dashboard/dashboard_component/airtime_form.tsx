'use client';

import React, { useState } from 'react';
import "../styles/airtime_form.css";
import axios from 'axios';
import { useUserContext } from '../Context/UserContext'; // Use custom hook

type NetworkType = 'MTN' | 'Glo' | 'Airtel' | '9mobile';

function AirtimeForm() {
  const [networkImage, setNetworkImage] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [phone, setPhone] = useState<string>("");
  const [network, setNetwork] = useState<NetworkType | "">("");
  const [error, setError] = useState<string | null>(null);

  const { user, setUser } = useUserContext(); // Use the context hook

  // Fallback or mock if user isn't loaded
  const walletBalance = user?.wallet?.balance ?? 0;

  const networkImages: Record<NetworkType, string> = {
    MTN: "/image/mtn.jpg",
    Glo: "/image/glo.jpg",
    Airtel: "/image/airtel.jpg",
    "9mobile": "/image/9mobile.jpg",
  };

  const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value as NetworkType | "";
    setNetwork(selected);

    if (selected && selected in networkImages) {
      setNetworkImage(networkImages[selected as NetworkType]);
    } else {
      setNetworkImage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (amount <= 0) {
      setError("Amount must be greater than zero");
      return;
    }

    if (amount > walletBalance) {
      setError("Insufficient wallet balance");
      return;
    }

    try {
      const response = await axios.post('/transaction/update_balance', {
        network,
        amount,
        phone,
        type: "debit",
        mode: "Airtime"
      });

      if (response.status === 200 && response.data.user) {
        setUser(response.data.user);
        setAmount(0);
        setPhone("");
        setError(null);
      } else {
        setError("Transaction failed");
      }
    } catch (error) {
      setError("Transaction failed");
      console.error("Error submitting transaction", error);
    }
  };

  return (
    <div className="form-cont">
      <form className="airtime-form form" onSubmit={handleSubmit}>
        <div className="airtime-header-cont">
          <h1 className="airtime-header">Airtime</h1>
        </div>
        <div className="network-cont">
          {networkImage && (
            <img src={networkImage} alt="Network Logo" className="network" />
          )}
        </div>
        <div className="form-data">
          <label htmlFor="network">Select Network</label>
          <select
            name="network"
            id="network"
            onChange={handleNetworkChange}
            value={network}
          >
            <option value="">Choose Network</option>
            <option value="MTN">MTN</option>
            <option value="Airtel">Airtel</option>
            <option value="9mobile">9mobile</option>
            <option value="Glo">Glo</option>
          </select>
        </div>
        <div className="form-data">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            name="amount"
            id="amount"
            placeholder="Enter Amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            required
            min={100}
          />
        </div>
        <div className="form-data">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            name="phone"
            id="phone"
            placeholder="Enter Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="form-btn">
          <input type="submit" value="Buy" className="submit" />
        </div>
      </form>
    </div>
  );
}

export default AirtimeForm;