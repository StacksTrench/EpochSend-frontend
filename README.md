# EpochSend — Frontend Client

<p align="center">
  <img src="./frontend/public/epochsend-banner.png" alt="EpochSend Banner" width="100%" />
</p>

<p align="center">
  <strong>Programmable escrow payments on Stellar that trigger directly from off-chain webhooks and APIs.</strong>
</p>

<p align="center">
  <a href="https://epochsend.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/Live%20App-epochsend.vercel.app-brightgreen?style=for-the-badge&logo=vercel" alt="Live App" />
  </a>
  <img src="https://img.shields.io/badge/Built%20on-Stellar%20Soroban-6B21A8?style=for-the-badge&logo=stellar" alt="Stellar Soroban" />
  <img src="https://img.shields.io/badge/Framework-Next.js%2016-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="MIT License" />
</p>

---

## 🧠 What is EpochSend?

Honestly, trying to trigger blockchain payments from real-world events is usually a huge pain. That's why we built EpochSend. It's a conditional escrow protocol on Stellar that lets you lock up funds in a Soroban smart contract, and those funds only release when something actually happens off-chain—like a shipping API saying "delivered," a database status change, or a Stripe payment webhook.

Instead of needing a manual middleman or trusting someone to release funds, EpochSend uses an Express oracle backend to listen for webhooks and call the smart contract directly. It bridges Web2 events and Web3 payments.

---

## 🎯 The Problem

Conditional payments today are kind of a mess:
- **It's all trust-based:** You either pay first and hope they deliver, or they deliver first and hope you pay.
- **Escrow is expensive:** Centralized escrow services charge big fees just to resolve simple agreements.
- **Web2 is disconnected:** Smart contracts can't natively listen to APIs, so you can't easily automate payments based on everyday API events.

---

## 💡 The EpochSend Solution

EpochSend connects Web2 APIs to Soroban smart contracts. Here is how it works:
1. **Define Intent:** You set the recipient, the asset (USDC/XLM), the amount, and a unique oracle trigger ID.
2. **Lock Funds:** Funds are locked in the Soroban contract. They are held safely by code.
3. **Off-Chain Trigger:** The Express oracle backend listens for webhooks (like delivery confirmations or server events).
4. **Auto-Release:** When the trigger fires, the oracle signs and submits the transaction to call `execute_intent` and release the funds.
5. **Fallback:** If nothing happens before the deadline, you just call `refund_intent` to get your funds back.

---

## 🏗️ Architecture

```
User (Freighter Wallet)
   │
   ├── Connect Freighter & Lock Funds
   │         │
   │         ▼
   │   EpochSend Frontend (Next.js)
   │         │
   │         ▼
   │   Soroban Escrow Contract (Status: Pending)
   │         │
   │         ├──── Webhook fires off-chain (e.g. delivery confirmed)
   │         ▼
   │   EpochSend Oracle Backend (Express)
   │         │
   │         ├── Authenticates trigger payload
   │         ├── Signs with Oracle private key
   │         ▼
   │   Soroban Escrow Contract
   │         │
   │         ├── execute_intent() ────► Recipient gets paid ✅
   │         │
   │         └─ (Fallback: refund_intent() after timeout 🔄)
```

---

## 🧩 MVP Features

| Feature | Description | Status |
|---|---|---|
| Freighter Wallet Integration | Connect wallet and approve transactions | ✅ Done |
| Soroban Contract Integration | Lock funds on-chain using Freighter | ✅ Done |
| Oracle-Triggered Releases | Backend releases funds when webhooks fire | ✅ Done |
| Automated Expiration Fallback | Users can reclaim funds after timeout | ✅ Done |
| Onboarding Guide | Slide modal explaining how to use the app | ✅ Done |
| Active Dashboard | Track locked intents and view histories | 🔨 In Progress |

---

## 🛠️ Tech Stack

| Category | Technology | Version |
|---|---|---|
| **Framework** | Next.js (App Router) | 16.1.1 |
| **Language** | TypeScript | ^5.0 |
| **UI Library** | React | 19.2.3 |
| **Styling** | Tailwind CSS | v4 |
| **Animations** | Framer Motion | ^12 |
| **Icons** | Lucide React | ^0.300 |
| **Wallet** | Freighter API (`@stellar/freighter-api`) | ^2.0 |
| **Blockchain** | Stellar SDK (`@stellar/stellar-sdk`) | ^12.0 |
| **Network** | Stellar Testnet / Soroban RPC | — |
| **Deployment** | Vercel | — |

---

## 📁 Project Structure

```
EpochSend-frontend/
├── docs/
│   ├── PRD.md                   # Full Product Requirements Document
│   ├── ISSUES.md                # Frontend feature roadmap & issue tracker
│   └── FRONTEND_GUIDE.md        # Stellar/Soroban integration technical guide
│
├── frontend/                    # Next.js app root
│   ├── app/
│   │   ├── layout.tsx           # Root layout — metadata, global providers
│   │   ├── page.tsx             # Home / main application view
│   │   ├── globals.css          # Design system: tokens, themes
│   │   ├── dashboard/           # Active intents dashboard (in progress)
│   │   └── vaults/              # Future: asset management (planned)
│   │
│   ├── components/
│   │   ├── Navbar.tsx           # Top navigation bar with wallet button
│   │   ├── WalletConnectButton.tsx  # Freighter wallet connect/disconnect
│   │   ├── OnboardingModal.tsx  # 4-slide first-visit onboarding carousel
│   │   ├── HeroIllustration.tsx # Animated landing page banner
│   │   ├── LaunchButton.tsx     # Wallet-gated app entry button
│   │   ├── SecurityNotice.tsx   # Dismissible security/beta warning
│   │   └── Toast.tsx            # Notification system
│   │
│   ├── lib/
│   │   ├── hooks.ts             # Custom hooks: useWallet, useCreateEscrow, etc.
│   │   └── constants.ts         # Network config, contract IDs, enums
│   │
│   ├── types/
│   │   └── global.d.ts          # Global TypeScript declarations
│   │
│   └── public/
│       ├── epochsend-banner.png # Hero illustration asset
│       ├── epochsend-logo.png   # App logo
│       └── epochsend.svg        # Favicon / SVG logo
│
├── .github/
│   └── workflows/ci.yml         # GitHub Actions CI (build + lint)
│
├── README.md                    # This file
├── CONTRIBUTING.md              # Contribution guidelines
├── CODE_OF_CONDUCT.md           # Community standards
├── MAINTAINERS.md               # Maintainer roster
└── STYLE.md                     # Code style guide
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v20+
- **npm** v9+
- **Freighter Wallet** browser extension
- A Stellar **Testnet** account funded via Friendbot

### 1. Clone & Install

```bash
git clone https://github.com/StacksTrench/EpochSend-frontend.git
cd EpochSend-frontend/frontend
npm install --legacy-peer-deps
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Stellar Network
NEXT_PUBLIC_STELLAR_NETWORK=TESTNET
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"

# EpochSend Soroban Contract
NEXT_PUBLIC_ESCROW_CONTRACT_ID=C...  # Deploy and paste address here
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔧 Available Scripts

```bash
npm run dev      # Start development server (hot reload)
npm run build    # Compile production bundle
npm run start    # Run production server locally
npm run lint     # Run ESLint code checks
```

---

## 🔐 Security Model

- **Non-custodial:** EpochSend developers have zero access to locked funds.
- **Auth enforcement:** Only the defined trigger authority can execute or refund a contract.
- **Reentrancy protection:** Soroban contract follows Checks-Effects-Interactions patterns.
- **Timeout safety:** Funds can never be permanently frozen—sender can always retrieve after timeout.

---

## 🤝 Contributing

Contributions are welcome and active. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a PR.

---

## 📄 License

[MIT](./LICENSE) — free to use, fork, and build on top of.
