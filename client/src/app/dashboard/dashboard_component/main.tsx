'use client';

import React from 'react';
import '../styles/account_details.css';

interface AccountDetailsProps {
  balance: number;
}

const AccountDetails: React.FC<AccountDetailsProps> = ({ balance }) => {
  return (
    <div className="account-details">
      <div className="card bg-dark text-white">
        <div className="card-header">
          <h4 className="card-title">Wallet Balance</h4>
        </div>
        <div className="card-body">
          <h1 style={{ fontSize: '32px' }}>{balance.toFixed(2)} NGN</h1>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;