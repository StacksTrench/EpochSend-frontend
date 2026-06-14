"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  isConnected as checkFreighterConnected, 
  requestAccess, 
  getPublicKey 
} from "@stellar/freighter-api";

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    async function checkConnection() {
      try {
        if (await checkFreighterConnected()) {
          const addr = await getPublicKey();
          setAddress(addr);
        }
      } catch (e) {
        console.error("Wallet connection check failed", e);
      }
    }
    checkConnection();
  }, []);

  const connect = async () => {
    try {
      await requestAccess();
      const addr = await getPublicKey();
      setAddress(addr);
    } catch (e) {
      console.error("Failed to connect wallet", e);
    }
  };

  const disconnect = () => {
    setAddress(null);
  };

  const isConnected = !!address;

  return (
    <WalletContext.Provider value={{ address, isConnected, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletContext() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWalletContext must be used within a WalletProvider");
  }
  return context;
}
