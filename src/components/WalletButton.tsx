import { Wallet, Check, Loader2, AlertCircle, LogOut, ArrowRight } from 'lucide-react';
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
        className="group flex items-center space-x-2 px-4 py-2 rounded-xl font-medium bg-cyan-600/50 text-cyan-300 border border-cyan-400/30 cursor-not-allowed transition-all duration-300"
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
          className="flex items-center space-x-2 px-4 py-2 rounded-xl font-medium bg-red-600/20 text-red-300 border border-red-500/30 hover:bg-red-600/30 transition-all duration-300 hover:-translate-y-0.5"
        >
          <AlertCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Retry</span>
        </button>
        
        {/* Error tooltip - shows on hover */}
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-red-900/90 backdrop-blur-sm text-red-100 px-3 py-2 rounded-lg text-sm whitespace-nowrap max-w-xs opacity-0 group-hover:opacity-100 transition-opacity z-50 border border-red-400/30">
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
          className="group flex items-center space-x-2 px-4 py-2 rounded-xl font-medium bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-400/30 hover:border-cyan-400/60 hover:bg-cyan-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-400/20"
        >
          <Check className="h-4 w-4 group-hover:scale-110 transition-transform" />
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
            <div className="absolute right-0 mt-2 w-64 bg-black/90 backdrop-blur-sm border border-cyan-400/30 rounded-xl p-3 shadow-xl shadow-cyan-400/20 z-50">
              <div className="space-y-3">
                {/* Network info */}
                <div className="text-xs text-cyan-400 uppercase tracking-wide bg-cyan-500/10 rounded-lg px-2 py-1 text-center border border-cyan-400/20">
                  Stacks Testnet
                </div>
                
                {/* Address */}
                <div className="bg-cyan-900/20 rounded-lg p-3 border border-cyan-400/20">
                  <div className="text-xs text-cyan-300 mb-1">Address</div>
                  <div className="text-white font-mono text-sm break-all">
                    {address}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-cyan-400/20">
                  <button
                    onClick={handleDisconnect}
                    className="group flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-300 hover:text-red-200 transition-all duration-300 border border-transparent hover:border-red-400/30"
                  >
                    <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Disconnect</span>
                    <ArrowRight className="ml-auto h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
      className="group flex items-center space-x-2 px-4 py-2 rounded-xl font-medium bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/60 transition-all duration-300 hover:-translate-y-0.5 border border-cyan-400/30"
    >
      <Wallet className="h-4 w-4 group-hover:scale-110 transition-transform" />
      <span className="hidden sm:inline">Connect Wallet</span>
      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
    </button>
  );
};

export default WalletButton;