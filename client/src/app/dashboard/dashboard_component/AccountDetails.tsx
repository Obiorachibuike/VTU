import React, { useState } from 'react';

const WalletComponent: React.FC = () => {
  const [activeWallet, setActiveWallet] = useState<string>('cash-wallet');

  const switchWalletTab = (wallet: string) => {
    setActiveWallet(wallet);
  };

  return (
    <div className="row">
    <div className="wallet-row">
      <div className="col-12 col-xl-4 wallet">
        <div className="card bg-dark text-white">
          <div className="card-header">
            <h2 className="card-title" style={{ color: 'white !important' }}>Wallet</h2>
            <div className="heading-elements mt-3 mt-md-0">
          
            </div>
          </div>
          <div className="card-content">
            <div id="cash-wallet" className="wallet" style={{ display: activeWallet === 'cash-wallet' ? 'block' : 'none' }}>
              <div className="text-center" style={{ padding: '40px' }}>
                <h2 style={{ fontSize: '40px !important', color: 'white', }}>178.00 NGN</h2>
              </div>
            </div>
         
          </div>
        </div>
        <div>
          {/* <a href="https://play.google.com/store/apps/details?id=com.cdlp.buyvtu.online&pcampaignid=web_share" target="_blank" rel="noopener noreferrer">
            <img src="https://buyvtu.online/website-assets/img/ch-play-black.jpg" className="uk-align-right@m" style={{ width: '120px', height: 'auto', border: '1px solid white', borderRadius: '4px', marginTop: '10px' }} alt="Google Play Store" />
          </a> */}
        </div>
      </div>
      <div className="col-12 col-xl-5 wallet">
        <div className="card bg-gradient-directional-warning card bg-dark">
          <div className=" card-header">
            <h4 className="card-title text-white">Virtual Accounts</h4>
            <p style={{ fontSize: '14px', color: 'white' }}>Make a bank Transfer to any of the Accounts below to fund your wallet</p>
          </div>
          <div className="card-content">
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 text-white">
                  <h3 className="text-white">Chi</h3>
                  <p style={{ padding: '0px !important', margin: '0px !important' }}>9933655358</p>
                  <p style={{ padding: '0px !important', margin: '0px !important' }}><strong>Wema bank</strong></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      {/* <div className="col-12 col-xl-3">
        <div className="card bg-dark text-white">
          <div className="card-header">
            <h2 className="card-title" style={{ color: 'white !important' }}>Total Lifetime Transactions</h2>
          </div>
          <div className="card-content">
            <div className="card-body">
              <h1 style={{ color: '#fff' }}>24,532.00 NGN</h1>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default WalletComponent;
