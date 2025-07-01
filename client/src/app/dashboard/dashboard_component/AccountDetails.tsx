interface WalletComponentProps {
  balance: number;
}

const WalletComponent: React.FC<WalletComponentProps> = ({ balance }) => {
  const [activeWallet, setActiveWallet] = useState<string>('cash-wallet');

  return (
    <div className="row wallet-row">
      <div className="col-12 col-xl-4 wallet">
        <div className="card bg-dark text-white">
          <div className="card-header">
            <h2 className="card-title text-white">Wallet</h2>
          </div>
          <div className="card-content">
            <div
              id="cash-wallet"
              className="wallet"
              style={{ display: activeWallet === 'cash-wallet' ? 'block' : 'none' }}
            >
              <div className="text-center py-5">
                <h2 style={{ fontSize: '40px', color: 'white' }}>
                  {balance.toFixed(2)} NGN
                </h2>
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
    </div>
  );
};

export default WalletComponent;