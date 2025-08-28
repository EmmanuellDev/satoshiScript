// walletContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  network: string;
  connect: () => Promise<void>;
  disconnect: () => void;
  isLoading: boolean;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Extend Window interface for Leather
declare global {
  interface Window {
    LeatherProvider?: {
      request: (method: string, params?: any) => Promise<any>;
    };
  }
}

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [network] = useState('testnet'); // Set to testnet4
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing connection on mount
  useEffect(() => {
    const savedAccount = localStorage.getItem("leather_connected_account");
    if (savedAccount && window.LeatherProvider) {
      setAddress(savedAccount);
      setIsConnected(true);
    }
  }, []);

  const connect = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if Leather is installed
      if (!window.LeatherProvider) {
        throw new Error("Leather Wallet is not installed. Please install it from the Chrome Web Store.");
      }

      // Request addresses from Leather
      const response = await window.LeatherProvider.request("getAddresses");
      console.log("Leather response:", response); // Debug log
      
      if (!response?.result?.addresses) {
        throw new Error("No addresses returned from Leather Wallet");
      }

      const addresses = response.result.addresses;
      console.log("Available addresses:", addresses); // Debug log
      
      // Find STX address - try different approaches
      let stxAddress = addresses.find((addr: any) => addr.symbol === "STX");
      
      if (!stxAddress) {
        // Try alternative approaches
        stxAddress = addresses.find((addr: any) => 
          addr.symbol?.toLowerCase() === "stx" || 
          addr.type === "stx" ||
          addr.address?.startsWith("ST") || 
          addr.address?.startsWith("SP")
        );
      }

      if (!stxAddress) {
        // If still no STX address, take the first address that looks like Stacks
        stxAddress = addresses.find((addr: any) => 
          addr.address && (addr.address.startsWith("ST") || addr.address.startsWith("SP"))
        );
      }

      if (!stxAddress) {
        // Last resort - take the first address if it exists
        if (addresses.length > 0) {
          stxAddress = addresses[0];
          console.warn("Using first available address as fallback:", stxAddress);
        } else {
          throw new Error("No addresses found in Leather Wallet. Please make sure you have a Stacks address.");
        }
      }

      const walletAddress = stxAddress.address;
      console.log("Selected address:", walletAddress); // Debug log
      
      if (!walletAddress) {
        throw new Error("Invalid address returned from Leather Wallet");
      }

      setAddress(walletAddress);
      setIsConnected(true);
      localStorage.setItem("leather_connected_account", walletAddress);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to connect to Leather Wallet";
      setError(errorMessage);
      console.error("Leather connection error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setAddress(null);
    setError(null);
    localStorage.removeItem("leather_connected_account");
  };

  return (
    <WalletContext.Provider value={{ 
      isConnected, 
      address, 
      network, 
      connect, 
      disconnect, 
      isLoading, 
      error 
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};