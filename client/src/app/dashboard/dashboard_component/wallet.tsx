import React from "react";
import "../styles/wallet.css";

function Wallet() {
  return (
    <>
      <div className="custom-block custom-block-balance">
        <small>Your Balance</small>

        <h2 className="mt-2 mb-3">$254,800</h2>

        <div className="custom-block-numbers d-flex align-items-center">
          <span>****</span>
          <span>****</span>
          <span>****</span>
          <p>2560</p>
        </div>

        <div className="d-flex">
          <div>
            <small>Valid Date</small>
            <p>12/2028</p>
          </div>

          <div className="ms-auto">
            <small>Card Holder</small>
            <p>Thomas</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Wallet;
