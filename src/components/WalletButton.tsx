// walletButton.tsx
import { Wallet, Check, Loader2, AlertCircle, LogOut } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useState } from 'react';

const WalletButton = () => {
  const { isConnected, address, connect, disconnect, isLoading, error } = useWallet();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleConnect = async () => {
    try {
      await connect();
    } catch (err) {
      console.error("Connection failed:", err);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setShowDropdown(false);
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Loading state
  if (isLoading) {
    return (
      <button
        disabled
        className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium bg-purple-600/50 text-white cursor-not-allowed"
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="hidden sm:inline">Connecting...</span>
      </button>
    );
  }

  // Error state
  if (error && !isConnected) {
    return (
      <div className="relative group">
        <button
          onClick={handleConnect}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium bg-red-600/20 text-red-300 border border-red-500/30 hover:bg-red-600/30 transition-all duration-300"
        >
          <AlertCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Retry</span>
        </button>
        
        {/* Error tooltip - shows on hover */}
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-red-900/90 text-red-100 px-3 py-2 rounded-lg text-sm whitespace-nowrap max-w-xs opacity-0 group-hover:opacity-100 transition-opacity z-50">
          {error}
        </div>
      </div>
    );
  }

  // Connected state
  if (isConnected && address) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium bg-green-600/20 text-green-300 border border-green-500/30 hover:bg-green-600/30 transition-all duration-300"
        >
          <Check className="h-4 w-4" />
          <span className="hidden sm:inline">{formatAddress(address)}</span>
          <span className="sm:hidden">Connected</span>
        </button>

        {/* Dropdown menu */}
        {showDropdown && (
          <>
            {/* Click outside overlay */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowDropdown(false)}
            />
            
            {/* Dropdown content */}
            <div className="absolute right-0 mt-2 w-64 bg-slate-900/95 backdrop-blur-sm border border-white/10 rounded-xl p-3 shadow-xl z-50">
              <div className="space-y-3">
                {/* Network info */}
                <div className="text-xs text-gray-400 uppercase tracking-wide">
                  Stacks Testnet
                </div>
                
                {/* Address */}
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Address</div>
                  <div className="text-white font-mono text-sm break-all">
                    {address}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-white/10">
                  <button
                    onClick={handleDisconnect}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-red-300 hover:text-red-200 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Disconnect
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Disconnected state
  return (
    <button
      onClick={handleConnect}
      className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105"
    >
      <Wallet className="h-4 w-4" />
      <span className="hidden sm:inline">Connect Wallet</span>
    </button>
  );
};

export default WalletButton;