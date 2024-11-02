'use client';
import React from "react";
import "../styles/pay_bills_form.css";
import { verify } from "crypto";
import axios, { Axios } from "axios";

function PaybillsForm() {

  const verifyMeterNumber = async(e:any) => {
    console.log(e.target.value);
    console.log(e);
    
    
      const response = await axios.get(`http://mobilemila.com/vendor/api/checkmeter?username=Obiorachibuike&password=Fanthom456world&meterno=${e.target.value}*****&productid=ibedcprepd`)
     
console.log(response);

    
  }

  return (
    <div>
      <div className="form-cont" style={{ marginTop: 50 + "px" }}>
        <form
          action="/dashboard/transactions"
          className="airtime-form form"
          method="POST"
        >
          <div className="airtime-header-cont">
            <h1 className="airtime-header">Pay Electrical Bills</h1>
          </div>
          <div className="form-data">
            <label htmlFor="network">Eletrical Company</label>
            <select name="Company" id="network" required>
              <option value="MTN">Choose Electrical Company</option>
              <option value="MTN">Abuja (AEDC)</option>
              <option value="MTN">Benin (BEDC)</option>
              <option value="MTN">Eko (EKEDC)</option>
              <option value="MTN">Enugu (EEDC)</option>
              <option value="MTN">Ibadan (IBEDC)</option>
              <option value="MTN">Ikeja (BEDC)</option>
              <option value="MTN">Kaduna (KAEDCO)</option>
              <option value="MTN">Kano (KEDCO)</option>
              <option value="MTN">Portharcourt (PHED)</option>
            </select>
          </div>
          <div className="form-data">
            <label htmlFor="network">Meter Type</label>
            <select
              name="Company"
              id="network"
              required
              aria-placeholder="choose meter type"
            >
              <option value="MTN">Choose meter type</option>
              <option value="MTN">Prepaid</option>
              <option value="MTN">Postpaid</option>
            </select>
          </div>
            <div className="form-data">
              <label htmlFor="price">Meter Number</label>
              <input
                type="number"
                required
                name="decoder_no"
                id="price"
                placeholder="Enter Meter Number"
                onChange={verifyMeterNumber}
              />
          <div className="form-data">
            <label htmlFor="price">Amount</label>
            <input
              type="number"
              required
              name="amount"
              id="price"
              placeholder="Enter Ampunt"
            />
          </div>
            <p className="error_message">MTN</p>
          </div>
          <div className="form-btn">
            <input type="submit" value="Subscribe" className="submit" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default PaybillsForm;
