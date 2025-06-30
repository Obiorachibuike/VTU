'use client';

import React, { useState } from "react";
import axios from "axios";
import "../styles/pay_bills_form.css";

function PaybillsForm() {
  const [meterNumber, setMeterNumber] = useState("");
  const [company, setCompany] = useState("");
  const [meterType, setMeterType] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [verificationResponse, setVerificationResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const companyProductMap: Record<string, string> = {
    "Abuja (AEDC)": "aedcprepaid",
    "Benin (BEDC)": "bedcprepaid",
    "Eko (EKEDC)": "ekedcprepaid",
    "Enugu (EEDC)": "eedcprepaid",
    "Ibadan (IBEDC)": "ibedcprepaid",
    "Ikeja (IKEDC)": "ikedcprepaid",
    "Kaduna (KAEDCO)": "kaedcprepaid",
    "Kano (KEDCO)": "kedcprepaid",
    "Portharcourt (PHED)": "phedprepaid",
  };

  const verifyMeterNumber = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMeterNumber(value);
    setError(null);

    if (!company || !companyProductMap[company]) {
      setError("Please select a valid electrical company.");
      return;
    }

    const productid = companyProductMap[company];

    try {
      const response = await axios.get(
        `http://mobilemila.com/vendor/api/checkmeter?username=Obiorachibuike&password=Fanthom456world&meterno=${value}&productid=${productid}`
      );

      setVerificationResponse(response.data);
      console.log("Verification response:", response.data);
    } catch (err) {
      setError("Failed to verify meter number.");
      console.error("Verification error:", err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Submitting form... (connect to backend)");
    // You can send a POST request here to complete the transaction.
  };

  return (
    <div className="form-cont" style={{ marginTop: "50px" }}>
      <form onSubmit={handleSubmit} className="airtime-form form">
        <div className="airtime-header-cont">
          <h1 className="airtime-header">Pay Electrical Bills</h1>
        </div>

        <div className="form-data">
          <label htmlFor="company">Electrical Company</label>
          <select
            id="company"
            required
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          >
            <option value="">Choose Electrical Company</option>
            {Object.keys(companyProductMap).map((comp) => (
              <option key={comp} value={comp}>{comp}</option>
            ))}
          </select>
        </div>

        <div className="form-data">
          <label htmlFor="meterType">Meter Type</label>
          <select
            id="meterType"
            required
            value={meterType}
            onChange={(e) => setMeterType(e.target.value)}
          >
            <option value="">Choose meter type</option>
            <option value="Prepaid">Prepaid</option>
            <option value="Postpaid">Postpaid</option>
          </select>
        </div>

        <div className="form-data">
          <label htmlFor="meterNumber">Meter Number</label>
          <input
            type="text"
            required
            id="meterNumber"
            placeholder="Enter Meter Number"
            value={meterNumber}
            onChange={verifyMeterNumber}
          />
        </div>

        <div className="form-data">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            required
            id="amount"
            placeholder="Enter Amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        {verificationResponse && (
          <div className="verification-message">
            <p style={{ color: "green" }}>
              ✅ Verified: {verificationResponse?.details || "Meter valid"}
            </p>
          </div>
        )}

        <div className="form-btn">
          <input type="submit" value="Subscribe" className="submit" />
        </div>
      </form>
    </div>
  );
}

export default PaybillsForm;