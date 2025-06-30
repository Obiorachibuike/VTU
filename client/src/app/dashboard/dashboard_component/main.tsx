"use client";

import React, { useState, useEffect } from "react";
import "../styles/main.css";
import TransactionDetails from "./transaction_details";
import AccountDetails from "./AccountDetails";
import { useUserContext } from "../Context/UserContext";

function Main() {
  const { user, isAuthenticated } = useUserContext();

  const [referralCode, setReferralCode] = useState<string>("R59ZK5");
  const [wallet, setWallet] = useState<number>(0);
  const [baseUrl, setBaseUrl] = useState<string>("");
  const [notification, setNotification] = useState<string>("");

  useEffect(() => {
    // Safely set base URL on mount
    setBaseUrl(window.location.origin);
  }, []);

  useEffect(() => {
    if (user) {
      setReferralCode(user.referralCode || "R59ZK5");
      setWallet(user.wallet?.balance || 0);
      // setNotification(user.notifications || ''); // If you later use notifications
    }
  }, [user]);

  const referralLink = `${baseUrl}?referral=${referralCode}`;

  const copyText = (text: string, message: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(message);
    }).catch((err) => {
      console.error("Failed to copy: ", err);
    });
  };

  return (
    <main>
      <div className="dash-content">
        <div className="overview">
          <div className="title">
            <i className="uil uil-tachometer-fast-alt"></i>
            <span className="text">Dashboard</span>
          </div>

          <div className="row">
            <div className="col-md-6 col-sm-12">
              <h3 style={{ marginBottom: "20px", marginLeft: "5px" }}>
                Hi, <strong>{user?.name || "User"}</strong>
              </h3>
              <p style={{ fontSize: "20px", marginLeft: "5px", marginTop: "-14px" }}>
                You are currently on <strong>Bronze</strong> Plan
              </p>
            </div>

            <div className="col-md-6 col-sm-12 text-right bg-gray-100 refer">
              <p style={{ fontSize: "18px", display: "flex", justifyContent: "end", gap: "10px" }}>
                <strong>Your Referral Link:</strong>
                <span style={{ color: "#007bff" }}>{referralLink}</span>
                <button
                  onClick={() => copyText(referralLink, "Referral Link copied to Clipboard")}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    fontSize: "inherit",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  <i className="icon-docs" title="Copy"> Copy</i>
                </button>
              </p>
            </div>
          </div>

          <div className="wallet-cont">
            <div className="wallet-content">
              <AccountDetails balance={wallet} />
            </div>
          </div>

          {/* You can enable the Wallet component here if needed */}
          {/* <div className="boxes">
            <Wallet />
          </div> */}
        </div>

        <TransactionDetails />
      </div>
    </main>
  );
}

export default Main;