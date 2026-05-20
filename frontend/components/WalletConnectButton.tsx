"use client";

import { useWallet } from "@/lib/hooks";
import { Smartphone } from "lucide-react";

export function WalletConnectButton() {
  const { connect, address } = useWallet();

  return (
    <button
      onClick={() => connect()}
      className="btn-retro flex items-center gap-2"
    >
      <Smartphone className="h-4 w-4" />
      <span className="font-pixel text-[10px] sm:text-xs">
        {address
          ? `${address.slice(0, 6)}...${address.slice(-4)}`
          : "CONNECT WALLET"}
      </span>
    </button>
  );
}
