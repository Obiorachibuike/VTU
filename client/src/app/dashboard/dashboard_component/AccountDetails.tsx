import React, { useState } from 'react';

const WalletComponent: React.FC = () => {
  const [activeWallet, setActiveWallet] = useState<string>('cash-wallet');

  // Dummy balance - can be replaced with context or props later
  const walletBalance = 178.0;

  const switchWalletTab = (wallet: string) => {
    setActiveWallet(wallet);
  };

  return (
    <div className="row wallet-row">
      {/* Wallet Balance Card */}
      <div className="col-12 col-xl-4 wallet">
        <div className="card bg-dark text-white">
          <div className="card-header">
            <h2 className="card-title text-white">Wallet</h2>
            {/* Optional switch tab buttons */}
            {/* <div className="heading-elements mt-3 mt-md-0">
              <button onClick={() => switchWalletTab('cash-wallet')}>Cash Wallet</button>
              <button onClick={() => switchWalletTab('crypto-wallet')}>Crypto Wallet</button>
            </div> */}
          </div>
          <div className="card-content">
            <div
              id="cash-wallet"
              className="wallet"
              style={{ display: activeWallet === 'cash-wallet' ? 'block' : 'none' }}
            >
              <div className="text-center py-5">
                <h2 style={{ fontSize: '40px', color: 'white' }}>{walletBalance.toFixed(2)} NGN</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Virtual Account Details */}
      <div className="col-12 col-xl-5 wallet">
        <div className="card bg-gradient-directional-warning bg-dark text-white">
          <div className="card-header">
            <h4 className="card-title">Virtual Accounts</h4>
            <p style={{ fontSize: '14px' }}>
              Make a bank transfer to any of the accounts below to fund your wallet
            </p>
          </div>
          <div className="card-content">
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <h3>Chi</h3>
                  <p className="m-0">9933655358</p>
                  <p className="m-0"><strong>Wema Bank</strong></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* You can re-enable this later for stats or total balance */}
      {/* <div className="col-12 col-xl-3">
        <div className="card bg-dark text-white">
          <div className="card-header">
            <h2 className="card-title">Total Lifetime Transactions</h2>
          </div>
          <div className="card-content">
            <div className="card-body">
              <h1>24,532.00 NGN</h1>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default WalletComponent;