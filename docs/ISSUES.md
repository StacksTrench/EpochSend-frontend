# EpochSend Frontend Issues & Roadmap

This document outlines the current state of the EpochSend frontend, capturing architectural debt inherited from previous iterations and charting the roadmap to a production-ready Stellar-native application.

## 🔴 Critical Architectural Debt & Refactoring

### Issue #1: Excise EVM Dependencies (Wagmi / Reown / Viem)
**Status:** ❌ PENDING | **Priority:** CRITICAL
- **Description:** The current codebase contains legacy dependencies tied to EVM chains (Wagmi, Viem, Reown AppKit). Since EpochSend is a Stellar-native protocol, these must be completely removed.
- **Tasks:**
  - Uninstall `wagmi`, `viem`, and any Reown packages.
  - Delete `config/wagmi.ts` and associated EVM contexts.
  - Remove EVM-specific hooks and replace them with native Stellar implementations.

### Issue #2: Integrate Freighter Wallet & Stellar SDK
**Status:** ❌ PENDING | **Priority:** CRITICAL
- **Description:** Replace EVM wallet connections with `@stellar/freighter-api` and `@stellar/stellar-sdk`.
- **Tasks:**
  - Create a new `StellarProvider` context to manage wallet connection state.
  - Update `Navbar.tsx` and `LaunchButton.tsx` to trigger Freighter wallet connection.
  - Implement network switching (Testnet / Mainnet) using Freighter's API.

## 🟡 Core Feature Implementation

### Issue #3: Intent Creation UI (Conditional Escrow)
**Status:** ❌ PENDING | **Priority:** HIGH
- **Description:** Build the primary interface where users can lock funds (USDC/XLM) with specific conditions.
- **Tasks:**
  - Create a multi-step form for defining a payment intent.
  - Implement fields for: Recipient Address, Asset Type, Amount, Time-Lock duration, and Oracle Webhook URL.
  - Build the Soroban transaction submission logic via Freighter.

### Issue #4: Active Intents Dashboard
**Status:** ❌ PENDING | **Priority:** HIGH
- **Description:** A dashboard for users to view and manage their active and historical payment intents.
- **Tasks:**
  - Fetch active escrows from the Soroban smart contract.
  - Display status indicators: "Locked", "Ready", "Executed", "Refunded".
  - Implement a "Refund" button for expired intents.

### Issue #5: Oracle Webhook Management
**Status:** ❌ PENDING | **Priority:** MEDIUM
- **Description:** An interface for users to register and manage their off-chain conditions via the EpochSend backend.
- **Tasks:**
  - Connect the frontend to the Express backend API.
  - Allow users to test webhook endpoints before locking funds.

## 🟢 UI/UX Polish

### Issue #6: EpochSend Brand Alignment
**Status:** ❌ PENDING | **Priority:** MEDIUM
- **Description:** Ensure all copy, SVGs, and brand colors perfectly align with the new EpochSend identity.
- **Tasks:**
  - Replace any remaining legacy copy in components.
  - Ensure the dark-mode-first aesthetic matches the new `epochsend-logo.svg`.
  - Add micro-animations to the Intent Creation flow using Framer Motion.
