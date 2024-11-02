"use client";
import React, { useState } from "react";
import "../styles/subcription_form.css";

function SubcriptionForm() {
  const [networkImage, setNetwork] = useState("");
  const network = (e: any) => {
    //  console.log(e.target.value);
    let condition;

    switch (e.target.value) {
      case "DSTV":
        return setNetwork("/image/DSTV.jpg");
        break;
      case "GoTV":
        return setNetwork("/image/GoTV.jpg");
        break;
      case "StarTimes":
        return setNetwork("/image/startimes.jpeg");
        break;
      default:
        setNetwork("");
        break;
    }
  };

  return (
    <>
      <div className="form-cont" style={{ marginTop: 50 + "px" }}>
        <form
          action="/dashboard/transactions"
          className="airtime-form form"
          method="POST"
        >
          <div className="airtime-header-cont">
            <h1 className="airtime-header">Rcharge Cables</h1>
          </div>
          <div className="network-cont">
            <img src={networkImage} alt="" className="network" />
          </div>
          <div className="form-data">
            <label htmlFor="network">Select Cable</label>
            <select name="network" id="network" onChange={network}>
              <option value="">Choose Cable</option>
              <option value="GoTV">GoTV</option>
              <option value="DSTV">DSTV</option>
              <option value="StarTimes">StarTime</option>
            </select>
          </div>
          <div className="form-data">
            <label htmlFor="price">Select Plan</label>
            <select name="network" id="network">
              <option value="MTN">GoTV</option>
              <option value="MTN">DSTV</option>
              <option value="MTN">STARTIMES</option>
            </select>
          </div>
          <div className="form-data">
            <label htmlFor="price">Decoder Number</label>
            <input
              type="number"
              required
              name="amount"
              id="price"
              placeholder="Enter Phone Number"
            />
            <p className="error_message">MTN</p>
          </div>
          <div className="form-btn">
            <input type="submit" value="Subscribe" className="submit" />
          </div>
        </form>
      </div>
    </>
  );
}

export default SubcriptionForm;
