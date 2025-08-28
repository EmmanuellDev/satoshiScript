import { Wallet, Check } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

const WalletButton = () => {
  const { isConnected, address, connect, disconnect } = useWallet();

  const handleClick = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
        isConnected
          ? 'bg-green-600/20 text-green-300 border border-green-500/30 hover:bg-green-600/30'
          : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-600/30'
      }`}
    >
      {isConnected ? (
        <>
          <Check className="h-4 w-4" />
          <span className="hidden sm:inline">
            {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connected'}
          </span>
        </>
      ) : (
        <>
          <Wallet className="h-4 w-4" />
          <span className="hidden sm:inline">Connect Wallet</span>
        </>
      )}
    </button>
  );
};

export default WalletButton;