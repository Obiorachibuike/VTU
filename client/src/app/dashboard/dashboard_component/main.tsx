"use client";

import Image from "next/image";
import Top from "./top";
import '../styles/main.css';
import React, { useState, useEffect, useContext } from 'react';
import TransactionDetails from "./transaction_details";
import Wallet from "./wallet";
import AccountDetails from "./AccountDetails";
import { useUserContext } from "../Context/UserContext";

function Main() {
  const [referralCode, setReferralCode] = useState('R59ZK5'); // Replace with dynamic code fetching if needed
  const [wallet, setWallet] = useState(2000);
  const [baseUrl, setBaseUrl] = useState('');
  const [notification, setNotification] = useState('');
  

  const {user,isAuthenticated} = useUserContext()
console.log(user);
console.log(isAuthenticated);

  if (user) {
    // setReferralCode(user.referalcode)
    // setWallet(user.wallet)
    // setNotification(user.notifications)
  }

  useEffect(() => {
    // Set the base URL dynamically
    setBaseUrl(window.location.origin);
  }, []);

  // Construct the referral link
  const referralLink = `${baseUrl}?referral=${referralCode}`;

  // Function to copy text to clipboard
  const copyText = (text, message) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(message);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <main>
      {/* <Top /> */}
      {/* <section className="dashboard" style={{ backgroundColor: "transparent" }}> */}

      <div className="dash-content">
        <div className="overview">
          <div className="title">
            <i className="uil uil-tachometer-fast-alt"></i>
            <span className="text">Dashboard</span>
          </div>

          <div className="row">
            <div className="col-md-6 col-sm-12">
              <h3 style={{ marginBottom: '20px', marginLeft: '5px' }}>
                Hi, <strong>Chibuike Obiora</strong>
              </h3>
              <p style={{ fontSize: '20px', marginLeft: '5px', marginTop: '-14px' }}>
                You are currently on <strong>Bronze</strong> Plan
              </p>
            </div>
            <div className="col-md-6 col-sm-12 text-right bg-gray-100 refer">
              <p style={{ fontSize: '18px',display: "flex",justifyContent: "end" }}>
                <strong>Your Referral Link:<br /></strong>
                {/* <span id="refCode">{referralLink}</span> */}
                <button
                  onClick={() => copyText(referralLink, 'Referral Link copied to Clipboard')}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 'inherit', display: 'inline-flex', alignItems: 'center' }}
                >
                  <i
                    className="icon-docs"
                    title="Copy"
                    style={{ fontSize: '16px', marginLeft: '10px' }}
                  >
                    Copy
                  </i>
                </button>
              </p>
            </div>
          </div>
          <div className="wallet-cont">
            <div className="wallet-content">
              <AccountDetails balance = {wallet} />
            </div>
          </div>
          {/* <div className="boxes">
            <Wallet />
          </div> */}
        </div>

        <TransactionDetails />
      </div>
      {/* </section> */}
    </main>
  );
}

export default Main;
