# EpochSend — Frontend Client

<p align="center">
  <img src="./frontend/public/epochsend-banner.png" alt="EpochSend Banner" width="100%" />
</p>

<p align="center">
  <strong>The programmable financial layer for Stellar — turning intent into automated, trustless execution.</strong>
</p>

<p align="center">
  <a href="https://epochsend.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/Live%20App-epochsend.vercel.app-brightgreen?style=for-the-badge&logo=vercel" alt="Live App" />
  </a>
  <img src="https://img.shields.io/badge/Built%20on-Stellar%20Soroban-6B21A8?style=for-the-badge&logo=stellar" alt="Stellar Soroban" />
  <img src="https://img.shields.io/badge/Framework-Next.js%2016-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="MIT License" />
  <img src="https://github.com/StacksTrench/EpochSend-frontend/actions/workflows/ci.yml/badge.svg" alt="CI Status" />
</p>

---

## 🧠 What Is EpochSend?

EpochSend is an **intent-based payment protocol** on the Stellar Network.

> *"Don't just send money. Define what money does."*

Instead of transferring funds immediately, users define **conditions** — the money only moves when those conditions are provably met. Built on Soroban smart contracts, EpochSend converts payment intent into enforceable, automated, on-chain execution with zero third-party custody.

**The core insight:** Every real-world payment has a condition attached to it — a delivery, a milestone, a date, an approval. Today, humans enforce those conditions manually and trust each other to be honest. EpochSend moves that enforcement on-chain.

---

## 🎯 The Problem

Modern payments are fundamentally broken for conditional transactions:

| Problem | Reality |
|---|---|
| **Trust-based** | Paying upfront means trusting the seller. Delivering first means trusting the buyer. |
| **Manual** | Recurring or milestone payments require calendar reminders and manual intervention. |
| **Irreversible** | Once money is sent, it's gone — no programmable fallback if conditions aren't met. |
| **Expensive escrow** | Third-party escrow services charge massive fees for basic dispute resolution. |

---

## 💡 The EpochSend Solution

Users define a **Payment Intent**:
- **Recipient** — destination Stellar/Soroban address
- **Asset** — USDC, XLM, or any SAC token
- **Amount** — how much to lock
- **Condition** — Time-based unlock, Manual arbiter approval, or Off-chain Oracle webhook

The protocol then:
1. **Locks** the funds safely in a Soroban escrow contract (non-custodial)
2. **Monitors** the defined condition passively or actively
3. **Executes** the payment automatically when the condition is met, **OR**
4. **Refunds** the sender automatically if a dispute timeout is reached

No middlemen. No manual intervention. No trust required.

---

## 🏗️ Architecture

```
User
 │
 ├─── Connect Freighter Wallet
 │
 ├─── Create Payment Intent
 │         │
 │         ▼
 │    EpochSend Frontend (Next.js)
 │         │
 │         │ invoke create_intent()
 │         ▼
 │    Soroban Escrow Contract
 │         │
 │    ┌────┴────┐
 │    │ Conditions │
 │    │ ─────────  │
 │    │ Time-Lock  │
 │    │ Arbiter    │
 │    │ Oracle     │
 │    └────┬────┘
 │         │
 │    ┌────┴────┐
 │    │         │
 │    ▼         ▼
 │ Execute    Refund
 │ (→ Recipient) (→ Sender)
```

---

## 🧩 Core Features

### Phase 1 — MVP (Current)
| Feature | Status |
|---|---|
| Freighter Wallet Integration | ✅ Implemented |
| Time-Locked Escrow (Unix timestamp unlock) | 🔨 In Progress |
| Manual Arbiter Approval | 🔨 In Progress |
| Create Intent Form (UI) | ✅ Built |
| Active Intents Dashboard | 🔨 In Progress |
| Automated Refunds | 🔨 In Progress |
| Onboarding Modal | ✅ Implemented |

### Phase 2 — Automation & Oracles
| Feature | Status |
|---|---|
| Backend Oracle Node (Express + Stellar SDK) | 🔜 Planned |
| API Webhook triggers (FedEx, Zapier, etc.) | 🔜 Planned |
| Email / SMS notifications on escrow events | 🔜 Planned |
| Recurring subscription payment scheduling | 🔜 Planned |

### Phase 3 — Developer Ecosystem
| Feature | Status |
|---|---|
| EpochSend SDK for third-party dApp integration | 🔜 Planned |
| Multi-signature arbiter approvals | 🔜 Planned |
| Stellar fiat off-ramp integration (MoneyGram) | 🔜 Planned |
| Public developer documentation | 🔜 Planned |

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
│   │   ├── globals.css          # Design system: tokens, utilities, themes
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

- **Node.js** v20+ ([download](https://nodejs.org/))
- **npm** v9+
- **Freighter Wallet** browser extension ([install](https://www.freighter.app/))
- A Stellar **Testnet** account funded via [Friendbot](https://laboratory.stellar.org/#account-creator?network=test)

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

### 4. Connect Your Wallet

1. Click **"Connect Wallet"** in the top-right corner
2. Freighter will prompt for permission — approve it
3. Make sure Freighter is set to **Testnet** mode
4. Fund your testnet wallet via [Stellar Friendbot](https://laboratory.stellar.org/#account-creator?network=test) if needed

---

## 🔧 Available Scripts

```bash
npm run dev      # Start development server (hot reload)
npm run build    # Compile production bundle
npm run start    # Run production server locally
npm run lint     # Run ESLint code checks
```

---

## 🌐 Network Configuration

EpochSend currently targets **Stellar Testnet** for development. To deploy on mainnet:

1. Update `NEXT_PUBLIC_STELLAR_NETWORK` to `MAINNET`
2. Update `NEXT_PUBLIC_SOROBAN_RPC_URL` to `https://mainnet.sorobanrpc.com`
3. Update `NEXT_PUBLIC_NETWORK_PASSPHRASE` to `Public Global Stellar Network ; September 2015`
4. Update `NEXT_PUBLIC_ESCROW_CONTRACT_ID` to your mainnet contract address

---

## 🔐 Security Model

| Property | Implementation |
|---|---|
| **Non-custodial** | EpochSend developers have zero access to locked funds |
| **Auth enforcement** | Only the defined trigger authority can execute or refund a contract |
| **Reentrancy protection** | Soroban contract follows Checks-Effects-Interactions pattern |
| **Timeout safety** | Funds can never be permanently frozen — sender can always retrieve after `dispute_timeout` |
| **Simulation-first** | All transactions are simulated before prompting user to sign |

---

## 📊 Success Metrics

| Metric | Description |
|---|---|
| **Total Value Locked (TVL)** | USDC/XLM actively held in escrow across all intents |
| **Execution Rate** | Percentage of escrows successfully executed vs refunded |
| **Active Unique Wallets** | Number of distinct wallet connections per month |
| **Transaction Volume** | Total dollar value processed through the protocol |
| **Oracle Uptime** | Backend oracle availability for webhook-triggered escrows |

---

## 📚 Documentation

| Document | Description |
|---|---|
| [📄 PRD](./docs/PRD.md) | Full Product Requirements Document — vision, architecture, roadmap |
| [🗂️ Issues & Roadmap](./docs/ISSUES.md) | Granular frontend feature tracker with module breakdown |
| [🌐 Frontend Integration Guide](./docs/FRONTEND_GUIDE.md) | Technical guide: Freighter, Soroban SDK, XDR encoding |
| [🤝 Contributing](./CONTRIBUTING.md) | How to contribute to EpochSend |
| [🎨 Style Guide](./STYLE.md) | Code style, naming conventions, and formatting rules |
| [📜 Code of Conduct](./CODE_OF_CONDUCT.md) | Community standards and expectations |

---

## 🤝 Contributing

Contributions are welcome and actively encouraged. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a PR.

**Quick workflow:**
1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature-name`
3. Make your changes and write tests where applicable
4. Push and open a Pull Request against `main`
5. A maintainer will review and merge

---

## 👥 Maintainers

See [MAINTAINERS.md](./MAINTAINERS.md) for the full list of project maintainers.

---

## 📄 License

[MIT](./LICENSE) — free to use, fork, and build on top of.

---

<p align="center">
  Built with ⚡ on <a href="https://stellar.org">Stellar</a> · Deployed on <a href="https://epochsend.vercel.app">Vercel</a>
</p>
