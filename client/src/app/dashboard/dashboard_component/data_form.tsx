'use client';

import React, { useState } from 'react';
import axios from 'axios';
import "../styles/data_form.css";
import { useUserContext } from '../Context/UserContext';

// Network and Plan Types
type NetworkType = 'MTN' | 'Glo' | 'Airtel' | '9mobile';

interface Plan {
  value: string;
  label: string;
  price: number;
}

// Define plans with proper typing
const networkPlans: Record<NetworkType, Plan[]> = {
  MTN: [
    { value: "mtn_1gb", label: "1 GB", price: 500 },
    { value: "mtn_2gb", label: "2 GB", price: 1000 },
  ],
  Glo: [
    { value: "glo_1gb", label: "1 GB", price: 500 },
  ],
  Airtel: [
    { value: "airtel_1gb", label: "1 GB", price: 500 },
  ],
  "9mobile": [
    { value: "9mobile_1gb", label: "1 GB", price: 500 },
  ],
};

const DataForm: React.FC = () => {
  const [networkImage, setNetworkImage] = useState<string>("");
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType | "">("");
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [amount, setAmount] = useState<number>(0);
  const [phone, setPhone] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const { user, setUser } = useUserContext();
  const walletBalance = user?.wallet?.balance ?? 0;

  const networkImages: Record<NetworkType, string> = {
    MTN: "/image/mtn.jpg",
    Glo: "/image/glo.jpg",
    Airtel: "/image/airtel.jpg",
    "9mobile": "/image/9mobile.jpg",
  };

  const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as NetworkType;
    setSelectedNetwork(value);

    setNetworkImage(networkImages[value] || "");
    setPlans(networkPlans[value] || []);
    setSelectedPlan("");
    setAmount(0);
  };

  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const planValue = e.target.value;
    const selected = plans.find(p => p.value === planValue);
    setSelectedPlan(planValue);
    setAmount(selected?.price || 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedNetwork || !selectedPlan || !/^0\d{10}$/.test(phone)) {
      setError("Choose a network and plan, and enter a valid 11-digit phone number");
      return;
    }

    if (amount <= 0) {
      setError("Amount must be greater than zero");
      return;
    }

    if (amount > walletBalance) {
      setError("Insufficient wallet balance");
      return;
    }

    try {
      setBusy(true);
      setError(null);
      setNotice(null);
      const response = await axios.post('/api/services/purchase', {
        service: "data", network: selectedNetwork, amount, recipient: phone, productCode: selectedPlan
      });

      if ((response.status === 200 || response.status === 201) && response.data.wallet) {
        if (user) setUser({ ...user, wallet: response.data.wallet, transactions: response.data.transactions || user.transactions });
        setNotice(response.data.message || 'Order submitted.');
        setAmount(0);
        setSelectedPlan("");
        setPhone("");
        setError(null);
      } else {
        setError("Transaction failed");
      }
    } catch (err) {
      console.error("Transaction failed", err);
      setError(axios.isAxiosError(err) ? (err.response?.data?.error || "Transaction failed") : "Transaction failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="form-cont">
      <form className="data-form form" onSubmit={handleSubmit}>
        <div className="data-header-cont">
          <h1 className="data-header">Buy Data</h1>
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
            value={selectedNetwork}
            onChange={handleNetworkChange}
          >
            <option value="">Choose Network</option>
            <option value="MTN">MTN</option>
            <option value="Airtel">Airtel</option>
            <option value="9mobile">9mobile</option>
            <option value="Glo">Glo</option>
          </select>
        </div>
        <div className="form-data">
          <label htmlFor="plan">Choose Plan</label>
          <select
            name="plan"
            id="plan"
            value={selectedPlan}
            onChange={handlePlanChange}
            disabled={!selectedNetwork}
          >
            <option value="">Choose Plan</option>
            {plans.map(plan => (
              <option key={plan.value} value={plan.value}>
                {plan.label}
              </option>
            ))}
          </select>
        </div>
        <div className="form-data">
          <label htmlFor="price">Price</label>
          <div id="amount">{amount}</div>
        </div>
        <div className="form-data">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            name="phone"
            id="phone"
            placeholder="Enter Phone Number"
            required
            maxLength={11}
            minLength={11}
            pattern="[0-9]{11}"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        {error && <p className="error-message" role="alert">{error}</p>}
        {notice && <p role="status">{notice}</p>}
        <div className="form-btn">
          <input type="submit" value={busy ? "Processing…" : "Buy"} className="submit" disabled={busy} />
        </div>
      </form>
    </div>
  );
};

export default DataForm;