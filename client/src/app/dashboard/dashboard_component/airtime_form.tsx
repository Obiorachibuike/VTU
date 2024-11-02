"use client";
import React, { useState, useContext } from "react";
import "../styles/airtime_form.css";
import { UserContext } from "../Context/UserContext"; // Adjust path as needed
import axios from "axios";

function AirtimeForm() {
  const [networkImage, setNetworkImage] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [phone, setPhone] = useState<string>("");
  const [network, setNetwork] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }

  const { user, setUser } = context;
  
  
  // if (!user) {
  //   console.log(user);
  //   return <div>Loading...</div>;
  // }

  const walletBalance = 600;

  const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedNetwork = e.target.value;
    setNetwork(selectedNetwork);

    switch (selectedNetwork) {
      case "MTN":
        setNetworkImage("/image/mtn.jpg");
        break;
      case "Glo":
        setNetworkImage("/image/glo.jpg");
        break;
      case "Airtel":
        setNetworkImage("/image/airtel.jpg");
        break;
      case "9mobile":
        setNetworkImage("/image/9mobile.jpg");
        break;
      default:
        setNetworkImage("");
        break;
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

      if (response.status === 200) {
        // Update user context
        setUser(response.data.user);

        setAmount(0); // Reset the amount field
        setPhone(""); // Reset the phone field
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
          <select name="network" id="network" onChange={handleNetworkChange} value={network}>
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
