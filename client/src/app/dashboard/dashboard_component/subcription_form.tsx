"use client";
import React, { useState } from "react";
import "../styles/subcription_form.css";

interface Plan {
  label: string;
  value: string;
}

const cablePlans: Record<string, Plan[]> = {
  DSTV: [
    { label: "DSTV Padi - ₦2500", value: "dstv_padi" },
    { label: "DSTV Yanga - ₦3700", value: "dstv_yanga" },
  ],
  GoTV: [
    { label: "GoTV Smallie - ₦1200", value: "gotv_smallie" },
    { label: "GoTV Jolli - ₦2460", value: "gotv_jolli" },
  ],
  StarTimes: [
    { label: "Nova - ₦900", value: "startimes_nova" },
    { label: "Basic - ₦1700", value: "startimes_basic" },
  ],
};

function SubcriptionForm() {
  const [networkImage, setNetworkImage] = useState("");
  const [selectedCable, setSelectedCable] = useState("");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [decoderNumber, setDecoderNumber] = useState("");

  const handleCableChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cable = e.target.value;
    setSelectedCable(cable);

    switch (cable) {
      case "DSTV":
        setNetworkImage("/image/DSTV.jpg");
        break;
      case "GoTV":
        setNetworkImage("/image/GoTV.jpg");
        break;
      case "StarTimes":
        setNetworkImage("/image/startimes.jpeg");
        break;
      default:
        setNetworkImage("");
    }

    setPlans(cablePlans[cable] || []);
    setSelectedPlan("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Replace with your backend integration
    alert(`Subscribing to ${selectedCable} plan ${selectedPlan} for decoder: ${decoderNumber}`);
  };

  return (
    <div className="form-cont" style={{ marginTop: "50px" }}>
      <form onSubmit={handleSubmit} className="airtime-form form">
        <div className="airtime-header-cont">
          <h1 className="airtime-header">Recharge Cables</h1>
        </div>

        <div className="network-cont">
          {networkImage && (
            <img src={networkImage} alt="Cable Logo" className="network" />
          )}
        </div>

        <div className="form-data">
          <label htmlFor="cable">Select Cable</label>
          <select id="cable" value={selectedCable} onChange={handleCableChange} required>
            <option value="">Choose Cable</option>
            <option value="GoTV">GoTV</option>
            <option value="DSTV">DSTV</option>
            <option value="StarTimes">StarTimes</option>
          </select>
        </div>

        <div className="form-data">
          <label htmlFor="plan">Select Plan</label>
          <select
            id="plan"
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            required
            disabled={plans.length === 0}
          >
            <option value="">Choose Plan</option>
            {plans.map((plan) => (
              <option key={plan.value} value={plan.value}>
                {plan.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-data">
          <label htmlFor="decoder">Decoder Number</label>
          <input
            type="text"
            id="decoder"
            name="decoder"
            required
            placeholder="Enter Decoder Number"
            value={decoderNumber}
            onChange={(e) => setDecoderNumber(e.target.value)}
            pattern="[0-9]{6,20}"
            maxLength={20}
          />
        </div>

        <div className="form-btn">
          <input type="submit" value="Subscribe" className="submit" />
        </div>
      </form>
    </div>
  );
}

export default SubcriptionForm;