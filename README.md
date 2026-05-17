# PayWhen

![PayWhen Banner](https://placehold.co/1200x400/8FA828/ffffff/png?text=PayWhen+Conditional+Payments)

> **The Intent-Based Payment Protocol on Stellar.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Built on Stellar](https://img.shields.io/badge/Built%20on-Stellar%20Soroban-purple)](https://soroban.stellar.org)

## 💡 The Idea

Payments today are manual, trust-based, and non-conditional. Users rely on verbal agreements, manual follow-ups, and third-party intermediaries — creating friction, disputes, and inefficiency.

**PayWhen** transforms user intent into enforceable on-chain payment logic on the Stellar network.

-   **User Action:** Users define a payment intent (e.g., "Send 100 USDC when delivery is confirmed").
-   **Escrow Engine:** Funds are safely locked in a Soroban smart contract.
-   **Smart Execution:** The contract automatically executes the payment once the condition is met, or refunds the sender if a dispute timeout is reached.

*Programmable payments without the need for centralized escrow.*

---

## 🏗️ Architecture

```mermaid
graph TD
    User((User)) -->|Create Escrow| UI[PayWhen Miniapp]
    UI -->|Invoke| Vault[Soroban Conditional Contract]
    
    subgraph Execution Triggers
        Time[Time-based Unlock]
        Manual[Manual Authorization]
        Oracle[API Webhook/Oracle]
    end

    subgraph On-Chain State
        Vault -->|Monitors| Execution Triggers
    end
    
    Execution Triggers -->|Condition Met| Exec[Transfer to Recipient]
    Execution Triggers -->|Timeout Reached| Refund[Refund to Sender]
    
    Exec --> Recipient((Recipient))
    Refund --> User
```

---

## 🛠 Tech Stack

**Blockchain:**
*   Soroban smart contracts (Rust)
*   Conditional escrow logic
*   Stellar USDC/XLM asset transfers

**Frontend:**
*   Next.js (React)
*   Freighter Wallet integration
*   Mobile-first miniapp UI

**Data & Oracles:**
*   Soroban event indexing
*   Off-chain webhook listeners (Phase 2)

---

## 🚀 Getting Started

### 1. Prerequisites
*   Node.js v18+
*   Rust & Cargo
*   Freighter Wallet

### 2. Local Setup

**Build Smart Contracts:**
```bash
cd smartcontract
cargo build --target wasm32-unknown-unknown --release
# See docs/ISSUES-SMARTCONTRACT.md for tasks
```

**Setup Frontend:**
```bash
cd frontend
npm install
npm run dev
# See docs/ISSUES-FRONTEND.md for tasks
```

---

## 📚 Documentations & Trackers

*   🧠 **[Smart Contract Issues](./docs/ISSUES-SMARTCONTRACT.md)**
*   🎨 **[Frontend Issues](./docs/ISSUES-FRONTEND.md)**
*   🤖 **[Backend & Oracles Issues](./docs/ISSUES-BACKEND-ORACLES.md)**

Guides:
*   📘 **[Smart Contract Guide](./docs/SMARTCONTRACT_GUIDE.md)**
*   🌐 **[Frontend Integration Guide](./docs/FRONTEND_GUIDE.md)**
*   📄 **[Product Requirements Document](./PRD.md)**

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

---

*Project maintained by @babalola & contributors.*
