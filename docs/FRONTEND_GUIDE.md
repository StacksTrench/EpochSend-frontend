# Stellar Frontend Integration Guide: Building dApps on Stellar 🌐

**Live App:** [https://epochsend.vercel.app/](https://epochsend.vercel.app/)

This guide covers how to build a modern frontend that interacts with Stellar smart contracts (Soroban). We will focus on using the **Freighter Wallet** and the **Stellar SDK**.

---

## 1. The Stack 🥞

To build a robust Stellar dApp, you'll typically use:
- **Frontend Framework:** Next.js (React) is standard.
- **Wallet Connection:** `@stellar/freighter-api`.
- **Blockchain Interaction:** `@stellar/stellar-sdk` (handles XDR encoding/decoding and RPC calls).
- **Network:** Testnet or Mainnet (during development).

---

## 2. Installation 📦

Add the necessary packages to your project:
```bash
npm install @stellar/freighter-api @stellar/stellar-sdk
```

### 2.1 Prerequisites: Funding Your Test Wallet 💸

Before you can send any transaction, your Freighter wallet needs testnet XLM.

1.  Open Freighter and switch to **Testnet**.
2.  Copy your wallet address.
3.  Go to the [Stellar Laboratory Account Creator](https://laboratory.stellar.org/#account-creator?network=test).
4.  Paste your address into the "Friendbot" section and click "Get Test Network XLM".

---

## 3. Wallet Connection (Freighter) 👛

Freighter is the "MetaMask" of Stellar. You need to check if it's installed and request access.

### Hook: `useFreighter.ts`
```typescript
import { isConnected, requestAccess, setAllowed } from "@stellar/freighter-api";
import { useState, useEffect } from "react";

export function useFreighter() {
  const [address, setAddress] = useState<string>("");
  
  useEffect(() => {
    async function checkConnection() {
      const connected = await isConnected();
      if (connected) {
        const addr = await requestAccess();
        if (addr) setAddress(addr);
      }
    }
    checkConnection();
  }, []);

  const connect = async () => {
    if (!await isConnected()) {
      alert("Please install Freighter!");
      return;
    }
    const addr = await requestAccess();
    if (addr) {
      await setAllowed();
      setAddress(addr);
    }
  };

  return { address, connect };
}
```

---

## 4. Simple Payments vs. Conditional Payments 💸

While standard Stellar payments happen instantly, EpochSend uses Soroban to lock funds until conditions are met. 

To create a conditional payment, we interact with the `ConditionalPayment` contract instead of using the standard `Operation.payment()`.

---

## 5. Creating a Conditional Payment 📦

Call the Soroban contract to create a time-locked or manual-trigger escrow.

```typescript
import { 
  Contract, 
  SorobanRpc, 
  xdr, 
  TimeoutInfinite 
} from "@stellar/stellar-sdk";
import { signTransaction } from "@stellar/freighter-api";

const ESCROW_CONTRACT_ID = "C...";
const RPC_URL = "https://soroban-testnet.stellar.org";
const NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";

async function createConditionalPayment(
  senderAddress: string,
  recipientAddress: string,
  amount: number,
  conditionType: string,
  unlockTime: number
) {
  const server = new SorobanRpc.Server(RPC_URL);
  const account = await server.getAccount(senderAddress);
  
  const contract = new Contract(ESCROW_CONTRACT_ID);
  
  // Encode parameters
  const senderArg = xdr.ScVal.scvAddress(senderAddress);
  const recipientArg = xdr.ScVal.scvAddress(recipientAddress);
  const amountArg = xdr.ScVal.scvI128(amount);
  const conditionArg = xdr.ScVal.scvSymbol(conditionType);
  const unlockTimeArg = xdr.ScVal.scvU64(unlockTime);
  
  const tx = new TransactionBuilder(account, { 
    fee: "100", 
    networkPassphrase: NETWORK_PASSPHRASE 
  })
  .addOperation(contract.call("create_escrow", [
      senderArg, recipientArg, amountArg, conditionArg, unlockTimeArg
  ]))
  .setTimeout(TimeoutInfinite)
  .build();

  const sim = await server.simulateTransaction(tx);
  if (!SorobanRpc.isSimulationSuccess(sim)) {
    throw new Error("Simulation failed");
  }

  const preparedTx = SorobanRpc.assembleTransaction(tx, sim);
  const signedXdr = await signTransaction(preparedTx.toXDR(), {
    networkPassphrase: NETWORK_PASSPHRASE
  });

  const result = await server.sendTransaction(
    TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE)
  );

  return result;
}
```

---

## 6. Querying Escrow Status 📊

Read the contract to display the locked amount and trigger status.

```typescript
async function getEscrowStatus(escrowId: string) {
  const server = new SorobanRpc.Server(RPC_URL);
  const contract = new Contract(ESCROW_CONTRACT_ID);

  const tx = new TransactionBuilder(
    new Account("G...", "0"), 
    { fee: "100", networkPassphrase: NETWORK_PASSPHRASE }
  )
  .addOperation(contract.call("get_status", [
    xdr.ScVal.scvAddress(escrowId)
  ]))
  .build();

  const sim = await server.simulateTransaction(tx);
  
  if (SorobanRpc.isSimulationSuccess(sim)) {
    // Parse result
    const result = sim.result.retval;
    return {
      sender: result[0].address().toString(),
      recipient: result[1].address().toString(),
      amount: result[2].i128(),
      condition: result[3].sym(),
      unlockTime: result[4].u64()
    };
  }
}
```

---

## 7. Triggering Execution / Refund ⚡

Once a condition is met (e.g., time has passed), anyone (or the authorized recipient) can trigger the `execute` function.

```typescript
async function executePayment(escrowId: string) {
  // Similar to the transaction builder above, 
  // but call contract.call("execute", [escrowIdArg])
}
```

---

## 8. Checklist for Integration ✅

- [ ] **Network Config:** Ensure your app points to the right RPC (Testnet vs Mainnet).
- [ ] **Passphrase:** Use the correct Network Passphrase.
- [ ] **Simulation:** ALWAYS simulate before asking the user to sign. It catches errors early and calculates gas.
- [ ] **XDR:** Familiarize yourself with Stellar's data format (XDR).
- [ ] **Escrow Security:** Ensure the UI clearly shows the conditions to users before they lock funds.

---

*Ready to build the future of intent-based payments? 🚀*