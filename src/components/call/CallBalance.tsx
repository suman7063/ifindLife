
import React from 'react';

interface CallBalanceProps {
  callStatus: 'connecting' | 'connected' | 'ended';
  balance: number;
}

const CallBalance: React.FC<CallBalanceProps> = ({ callStatus, balance }) => {
  return (
    <>
      {callStatus === 'connected' && (
        <div className="text-sm text-muted-foreground">
          Balance: ₹{balance.toFixed(2)}
        </div>
      )}
    </>
  );
};

export default CallBalance;
