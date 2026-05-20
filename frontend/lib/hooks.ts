'use client'

import { useState, useEffect } from 'react';
import { 
  isConnected, 
  requestAccess, 
  getPublicKey, 
  signTransaction 
} from '@stellar/freighter-api';

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    async function checkConnection() {
      try {
        if (await isConnected()) {
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
      // In @stellar/freighter-api v2, requestAccess resolves with void or string
      await requestAccess();
      const addr = await getPublicKey();
      setAddress(addr);
    } catch (e) {
      console.error("Failed to connect wallet", e);
    }
  };

  return { address, connect };
}

export function useCreateEscrow() {
  const [isPending, setIsPending] = useState(false);

  async function createEscrow(params: {
    recipient: string;
    amount: string;
    conditionType: number;
    conditionData: bigint;
    arbiter: string;
  }) {
    setIsPending(true);
    try {
      // 1. Build Soroban InvokeHostFunction transaction for `create_escrow`
      // 2. Sign with Freighter: await signTransaction(xdr, { network: 'TESTNET' })
      // 3. Submit to Soroban RPC
      console.log('Creating escrow on Soroban...', params);
    } catch (e) {
      console.error(e);
    } finally {
      setIsPending(false);
    }
  }

  return { createEscrow, isPending };
}

export function useExecuteEscrow() {
  const [isPending, setIsPending] = useState(false);

  async function execute(contractId: string) {
    setIsPending(true);
    try {
      console.log('Executing escrow on Soroban...', contractId);
      // Implementation for `execute` using signTransaction
    } catch (e) {
      console.error(e);
    } finally {
      setIsPending(false);
    }
  }

  return { execute, isPending };
}

export function useRefundEscrow() {
  const [isPending, setIsPending] = useState(false);

  async function refund(contractId: string) {
    setIsPending(true);
    try {
      console.log('Refunding escrow on Soroban...', contractId);
      // Implementation for `refund`
    } catch (e) {
      console.error(e);
    } finally {
      setIsPending(false);
    }
  }

  return { refund, isPending };
}
