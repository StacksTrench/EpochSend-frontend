# EpochSend Frontend — Issues & Roadmap 🗂️

**Live App:** [https://epochsend.vercel.app/](https://epochsend.vercel.app/)

This document is the authoritative tracker for all frontend engineering tasks on the EpochSend protocol. It captures what has been shipped, what is actively being built, and the full roadmap to a production-grade Stellar-native application. Issues are grouped into logical modules and numbered sequentially.

> **Standards:** Every issue follows the format — priority, labels, description, and granular sub-tasks with assignable checkboxes. Status: ✅ COMPLETED | 🔨 IN PROGRESS | ❌ PENDING | 🔜 FUTURE

---

## 🏗️ Module 1: Foundation & Configuration (FE-01 → FE-06)

### Issue #FE-01: Project Scaffold & Next.js App Router Setup
**Status:** ✅ COMPLETED | **Priority:** CRITICAL
**Labels:** `foundation`, `config`
**Description:** Initialize the Next.js 16 app with App Router, TypeScript, Tailwind CSS v4, and EpochSend project metadata.
- **Tasks:**
  - [x] Bootstrap project with `create-next-app` (App Router, TypeScript, Tailwind)
  - [x] Configure `next.config.ts` with strict mode
  - [x] Set root layout metadata: title, description, favicon (`epochsend.svg`)
  - [x] Configure `postcss.config.mjs` for Tailwind v4
  - [x] Add `vercel.json` for deployment configuration

---

### Issue #FE-02: Design System & Global CSS Tokens
**Status:** 🔨 IN PROGRESS | **Priority:** CRITICAL
**Labels:** `foundation`, `ui`, `design`
**Description:** Define the full EpochSend design system — colour palette, typography, spacing, and reusable utility classes — as CSS variables and Tailwind tokens in `globals.css`.
- **Tasks:**
  - [x] Set dark background tokens (`--color-background: #050505`, `--color-foreground: #ffffff`)
  - [x] Define glassmorphism utility class (`.glass`, `.glass-hover`)
  - [x] Define gradient text utility (`.text-gradient`)
  - [x] Set custom dark scrollbar
  - [ ] Load Inter font via `next/font/google` (currently referenced but not loaded)
  - [ ] Define full colour palette as CSS variables (primary, secondary, accent, muted, destructive)
  - [ ] Define `.btn`, `.btn-primary`, `.btn-outline`, `.btn-retro` classes (currently referenced in components but missing from CSS — causes unstyled buttons)
  - [ ] Add light mode token set under `@media (prefers-color-scheme: light)` or `[data-theme="light"]`
  - [ ] Wire `next-themes` ThemeProvider in root layout (package installed but unused)

---

### Issue #FE-03: Environment Configuration & Constants
**Status:** 🔨 IN PROGRESS | **Priority:** CRITICAL
**Labels:** `foundation`, `config`, `blockchain`
**Description:** Centralise all network configuration, contract addresses, and environment variables so that switching between Testnet and Mainnet is a single `.env` change.
- **Tasks:**
  - [x] Create `lib/constants.ts` with `STELLAR_NETWORK`, `SOROBAN_RPC_URL`, `SOROBAN_NETWORK_PASSPHRASE`, `ConditionType` enum
  - [x] Create `.env.example` with all required variables
  - [ ] Update `.env.example` to remove irrelevant `WALLETCONNECT_PROJECT_ID` variable
  - [ ] Import and consume `constants.ts` inside `lib/hooks.ts` (currently defined but never imported anywhere)
  - [ ] Add `NEXT_PUBLIC_ESCROW_CONTRACT_ID` env variable and wire it into the hook layer
  - [ ] Add environment validation on app startup (throw clear error if contract ID is missing)

---

### Issue #FE-04: Project Cleanup — Remove Legacy Artefacts
**Status:** ❌ PENDING | **Priority:** HIGH
**Labels:** `foundation`, `cleanup`
**Description:** Remove all stale copy and incorrect references inherited from the previous ForgeX project iteration.
- **Tasks:**
  - [ ] Remove or replace `TODO.md` (currently the ForgeX TODO — references VaultCard, AIChat, useVaultFactory)
  - [ ] Clean up `types/global.d.ts` — remove AppKit web component declarations (irrelevant to Stellar/Freighter stack)
  - [ ] Fix `SecurityNotice.tsx` — component copy reads "ForgeX is still under development" instead of EpochSend
  - [ ] Update `frontend/README.md` to EpochSend content (currently refers to wrong tech stack)
  - [ ] Integrate `clsx` and `tailwind-merge` into a `cn()` utility helper in `lib/utils.ts` (installed but never used)

---

### Issue #FE-05: CI/CD Pipeline
**Status:** ✅ COMPLETED | **Priority:** HIGH
**Labels:** `devops`, `ci`
**Description:** Set up GitHub Actions to run build and lint checks on every push and pull request.
- **Tasks:**
  - [x] Create `.github/workflows/ci.yml` with `frontend-build` job
  - [x] Pin Node.js to v20 in CI (required for Next.js 16+)
  - [x] Use `npm ci --legacy-peer-deps` to handle peer dependency conflicts
  - [x] Run `npm run build` to validate production bundle on every push

---

### Issue #FE-06: Gitignore & Artifact Management
**Status:** ✅ COMPLETED | **Priority:** MEDIUM
**Labels:** `devops`, `config`
**Description:** Ensure build outputs, local env files, and OS artefacts are excluded from version control.
- **Tasks:**
  - [x] Ignore `.next/`, `out/`, `dist/`, `build/` directories
  - [x] Ignore `.env`, `.env.local`, `.env.*.local`
  - [x] Ignore `node_modules/`, `*.log`, `.DS_Store`, `*.pem`

---

## 👛 Module 2: Wallet & Blockchain Integration (FE-07 → FE-11)

### Issue #FE-07: Freighter Wallet Hook
**Status:** 🔨 IN PROGRESS | **Priority:** CRITICAL
**Labels:** `wallet`, `blockchain`, `hooks`
**Description:** Implement a robust, production-grade `useWallet()` custom hook that handles all Freighter wallet lifecycle events.
- **Tasks:**
  - [x] Check if Freighter extension is installed on mount
  - [x] Auto-reconnect if wallet was previously connected (on page refresh)
  - [x] Expose `address` and `connect()` from the hook
  - [ ] Handle `disconnect()` gracefully — clear address state and local session
  - [ ] Detect and handle network mismatch (user on wrong Stellar network)
  - [ ] Expose `isInstalled` boolean so UI can show "Install Freighter" CTA if extension missing
  - [ ] Expose `networkType` so components can show the active network (Testnet / Mainnet)
  - [ ] Add error state handling (`walletError`) for rejected connection requests

---

### Issue #FE-08: Global Wallet Context Provider
**Status:** ❌ PENDING | **Priority:** CRITICAL
**Labels:** `wallet`, `state-management`
**Description:** Lift wallet state into a React Context provider so any component in the tree can access the connected address without prop drilling.
- **Tasks:**
  - [ ] Create `contexts/WalletContext.tsx` with `WalletProvider` and `useWalletContext()` hook
  - [ ] Wrap the root layout in `WalletProvider`
  - [ ] Migrate `page.tsx`, `WalletConnectButton.tsx`, and `LaunchButton.tsx` to use context instead of individual hook calls
  - [ ] Add `isConnected` derived boolean to context

---

### Issue #FE-09: Soroban RPC Client & Transaction Builder
**Status:** ❌ PENDING | **Priority:** CRITICAL
**Labels:** `blockchain`, `soroban`, `rpc`
**Description:** Build the core Stellar/Soroban integration layer: RPC server initialisation, account loading, and the transaction simulation + submission pipeline.
- **Tasks:**
  - [ ] Create `lib/stellar.ts` — initialise `SorobanRpc.Server` from env constants
  - [ ] Implement `getAccount(address)` helper — fetch the account sequence number from RPC
  - [ ] Implement `simulateTransaction(tx)` wrapper — always simulate before signing
  - [ ] Implement `submitTransaction(signedXdr)` — submit to RPC and handle response codes
  - [ ] Handle `PENDING`, `SUCCESS`, `ERROR`, `NOT_FOUND` RPC response states
  - [ ] Implement XDR encoding helpers for common types: `Address`, `i128`, `u64`, `Symbol`

---

### Issue #FE-10: WalletConnectButton — Polish & States
**Status:** 🔨 IN PROGRESS | **Priority:** HIGH
**Labels:** `wallet`, `ui`
**Description:** The current button renders unstyled (CSS class `btn-retro` is undefined). Implement all required visual states.
- **Tasks:**
  - [ ] Define `.btn-retro` CSS class in `globals.css` (currently missing — button is completely unstyled)
  - [ ] Show truncated address when connected (`GXXXXX...XXXX`)
  - [ ] Add a green pulse indicator dot when connected
  - [ ] Add a dropdown or popover on connected state: show full address, copy address, disconnect
  - [ ] Add loading state while connection request is in progress
  - [ ] Show "Install Freighter" link if extension is not detected

---

### Issue #FE-11: Network Switcher Component
**Status:** ❌ PENDING | **Priority:** MEDIUM
**Labels:** `wallet`, `config`, `ui`
**Description:** Allow users to switch between Stellar Testnet and Mainnet directly from the UI, with the contract and RPC updating accordingly.
- **Tasks:**
  - [ ] Create `components/NetworkBadge.tsx` — pill badge showing active network
  - [ ] Show "TESTNET" badge prominently in Navbar when on testnet (safety indicator)
  - [ ] Implement network change trigger — update RPC URL and network passphrase in context
  - [ ] Display warning modal when switching to Mainnet ("Real funds will be used")

---

## 🔒 Module 3: Core Escrow — Create Intent Flow (FE-12 → FE-18)

### Issue #FE-12: Intent Creation Form — Full Validation
**Status:** 🔨 IN PROGRESS | **Priority:** CRITICAL
**Labels:** `feature`, `form`, `validation`
**Description:** The create-escrow form UI exists but has minimal validation. Implement comprehensive client-side validation before any transaction is built.
- **Tasks:**
  - [x] Build multi-step form: Recipient, Asset/Amount, Condition Type, Condition Data
  - [x] Implement condition toggle: "Time Lock" (datetime) vs "Arbiter" (address input)
  - [ ] Validate recipient is a valid Stellar address (starts with `G`, 56 chars)
  - [ ] Validate arbiter is a valid Stellar address and differs from sender
  - [ ] Validate amount is positive and does not exceed connected wallet balance
  - [ ] Validate unlock timestamp is in the future
  - [ ] Disable submit button until all fields pass validation
  - [ ] Show inline field-level error messages (not just blocked submission)
  - [ ] Show a pre-confirmation summary before the user signs: "You are locking X USDC until [date] with [recipient]"

---

### Issue #FE-13: `useCreateEscrow` — Real Soroban Implementation
**Status:** ❌ PENDING | **Priority:** CRITICAL
**Labels:** `blockchain`, `soroban`, `hooks`
**Description:** Replace the current `console.log` stub with a real Soroban transaction that calls `create_intent()` on the EpochSend smart contract.
- **Tasks:**
  - [ ] Import `SorobanRpc`, `Contract`, `TransactionBuilder`, `xdr` from `@stellar/stellar-sdk`
  - [ ] Load sender account from RPC using `getAccount(address)`
  - [ ] Build `InvokeHostFunctionOperation` calling `create_intent(sender, recipient, asset, amount, expiration, oracle_id)`
  - [ ] Encode all arguments as XDR `ScVal` types (Address → scvAddress, i128 → scvI128, u64 → scvU64)
  - [ ] Simulate the transaction and verify simulation success before proceeding
  - [ ] Prompt user to sign via `signTransaction()` from `@stellar/freighter-api`
  - [ ] Submit the signed XDR to Soroban RPC
  - [ ] Return the `intent_id` from the contract response
  - [ ] Handle errors: simulation failure, user rejection, submission failure, timeout

---

### Issue #FE-14: `useExecuteEscrow` — Real Soroban Implementation
**Status:** ❌ PENDING | **Priority:** CRITICAL
**Labels:** `blockchain`, `soroban`, `hooks`
**Description:** Replace the `console.log` stub with a real `execute()` call on the contract, signed by the arbiter or triggered automatically for time-based conditions.
- **Tasks:**
  - [ ] Build transaction calling `execute(intent_id)` on the escrow contract
  - [ ] Determine caller authority: arbiter (for Manual mode) or any caller (for Timestamp mode)
  - [ ] Simulate → Sign → Submit pipeline (same pattern as `useCreateEscrow`)
  - [ ] Update local escrow state to `Executed` on confirmed success
  - [ ] Handle "Condition not met" error from contract (timestamp not reached) with user-facing message

---

### Issue #FE-15: `useRefundEscrow` — Real Soroban Implementation
**Status:** ❌ PENDING | **Priority:** CRITICAL
**Labels:** `blockchain`, `soroban`, `hooks`
**Description:** Replace the `console.log` stub with a real `refund()` call signed by the original sender.
- **Tasks:**
  - [ ] Build transaction calling `refund(intent_id)` on the escrow contract
  - [ ] Enforce sender-only auth (only the original sender can trigger refund)
  - [ ] Simulate → Sign → Submit pipeline
  - [ ] Update local escrow state to `Refunded` on confirmed success
  - [ ] Handle "Already executed" and "Already refunded" errors gracefully

---

### Issue #FE-16: Toast Notification System
**Status:** ❌ PENDING | **Priority:** HIGH
**Labels:** `ux`, `feedback`
**Description:** The current `useToast()` is a `console.log` stub — zero UI feedback is shown to users. Implement a real, styled toast notification system.
- **Tasks:**
  - [ ] Build `components/ToastProvider.tsx` — maintains a queue of active toasts in state
  - [ ] Wrap root layout in `<ToastProvider>`
  - [ ] Design toast variants: `success` (green), `error` (red), `warning` (amber), `info` (teal)
  - [ ] Add entry/exit animations via Framer Motion (`AnimatePresence`)
  - [ ] Auto-dismiss after 4 seconds with progress bar indicator
  - [ ] Allow manual dismiss via X button
  - [ ] Update `useToast()` hook to push to the provider queue
  - [ ] Replace all `console.log` toast calls in `page.tsx` with real `showToast()` calls

---

### Issue #FE-17: Transaction Signing Overlay
**Status:** ❌ PENDING | **Priority:** HIGH
**Labels:** `ux`, `feedback`
**Description:** When the user is waiting for Freighter to sign a transaction, the UI should show a clear, full-experience overlay preventing interaction.
- **Tasks:**
  - [ ] Create `components/SigningOverlay.tsx` — full-screen blur overlay
  - [ ] Show animated spinner with message: "Waiting for Freighter signature..."
  - [ ] Show follow-up state: "Submitting to Stellar network..."
  - [ ] Show success state with transaction hash and Stellar Explorer link
  - [ ] Show failure state with clear error description and retry option
  - [ ] Trigger overlay during `isCreating`, `isExecuting`, `isRefunding` states

---

### Issue #FE-18: On-chain Intent Fetching (`useGetIntents`)
**Status:** ❌ PENDING | **Priority:** CRITICAL
**Labels:** `blockchain`, `soroban`, `hooks`, `data`
**Description:** Replace the two hardcoded mock escrow entries in `page.tsx` with real data fetched from the Soroban contract.
- **Tasks:**
  - [ ] Implement `useGetIntents(address)` hook — queries `get_intent(id)` on the contract for the connected address
  - [ ] Implement intent counter query to know how many intents exist
  - [ ] Parse `ScVal` contract response into the `EscrowItem` TypeScript interface
  - [ ] Handle empty state: "You have no active intents" with CTA to create one
  - [ ] Implement polling (every 15 seconds) to refresh intent status without full page reload
  - [ ] Remove the two hardcoded mock entries from `page.tsx`

---

## 📊 Module 4: Active Intents Dashboard (FE-19 → FE-24)

### Issue #FE-19: Intents Dashboard Page (`/dashboard`)
**Status:** ❌ PENDING | **Priority:** HIGH
**Labels:** `feature`, `page`, `routing`
**Description:** Build out the currently-empty `/dashboard` directory into a fully functional Active Intents management page.
- **Tasks:**
  - [ ] Create `app/dashboard/page.tsx` — requires wallet connection to access
  - [ ] Redirect unauthenticated users to home with "Connect your wallet to continue" message
  - [ ] Layout: summary stats header (Total Locked Value, Active Count, Executed Count, Refunded Count)
  - [ ] Filter tabs: All | Locked | Executed | Refunded
  - [ ] Render intent cards using real contract data from `useGetIntents()`
  - [ ] Add Navbar link to `/dashboard` for connected users

---

### Issue #FE-20: Intent Detail Card Component
**Status:** 🔨 IN PROGRESS | **Priority:** HIGH
**Labels:** `ui`, `component`
**Description:** The current escrow card is basic. Build a rich intent card that shows all relevant information clearly.
- **Tasks:**
  - [x] Show condition type label ("Time Lock" / "Arbiter")
  - [x] Show status badge with colour coding (Locked=amber, Executed=green, Refunded=red)
  - [x] Show amount, asset type, and recipient address
  - [ ] Show intent ID from contract
  - [ ] Show time remaining until unlock (formatted countdown for Timestamp mode)
  - [ ] Show arbiter address for Manual mode
  - [ ] Show "View on Stellar Explorer" link using the transaction hash
  - [ ] Show creation timestamp
  - [ ] Improve address display: truncate with copy-to-clipboard button

---

### Issue #FE-21: Escrow Status Badge & Real-Time Updates
**Status:** ❌ PENDING | **Priority:** MEDIUM
**Labels:** `ui`, `data`, `real-time`
**Description:** Status badges should reflect live on-chain state, not just local React state.
- **Tasks:**
  - [ ] Differentiate between "Locked — Condition Pending", "Locked — Condition Met (Ready to Execute)", "Executed", "Refunded"
  - [ ] Poll contract state every 15s and update badge without full page reload
  - [ ] Animate badge transition when status changes (e.g., Locked → Executed)
  - [ ] Show a "Ready to Release" pulse animation when a time-based condition has been met

---

### Issue #FE-22: Empty & Loading States
**Status:** ❌ PENDING | **Priority:** MEDIUM
**Labels:** `ux`, `ui`
**Description:** Every data-fetching view needs proper loading skeletons and empty states.
- **Tasks:**
  - [ ] Build `components/IntentCardSkeleton.tsx` — animated shimmer placeholder
  - [ ] Show 2–3 skeleton cards while intents are loading from RPC
  - [ ] Design empty state: illustration + "No active intents yet" + "Create your first intent →" CTA
  - [ ] Handle error state: RPC failure message with retry button

---

### Issue #FE-23: Intent Creation Success Flow
**Status:** ❌ PENDING | **Priority:** MEDIUM
**Labels:** `ux`, `flow`
**Description:** After successfully creating an intent, guide the user clearly rather than just resetting the form silently.
- **Tasks:**
  - [ ] Show a full success screen / modal after intent is confirmed on-chain
  - [ ] Display: intent ID, locked amount, condition type, Stellar Explorer transaction link
  - [ ] Offer "Copy Intent ID" and "Share Intent" actions
  - [ ] Auto-navigate user to the dashboard to see their new intent in the list
  - [ ] Show toast: "Intent created — X USDC locked until [date]"

---

### Issue #FE-24: Transaction History Feed
**Status:** 🔜 FUTURE | **Priority:** MEDIUM
**Labels:** `data`, `feature`
**Description:** Show a chronological log of all past transactions (creates, executes, refunds) associated with the connected wallet.
- **Tasks:**
  - [ ] Research indexer options: Stellar Horizon API, Mercury indexer, or custom backend events
  - [ ] Fetch all `create_intent`, `execute`, `refund` events by sender address
  - [ ] Render paginated list: date, type, amount, counterparty address, status
  - [ ] Add "Export to CSV" button for the full transaction history

---

## 🌐 Module 5: Oracle & Backend Integration (FE-25 → FE-29)

### Issue #FE-25: Backend API Client
**Status:** ❌ PENDING | **Priority:** HIGH
**Labels:** `feature`, `backend`, `api`
**Description:** Connect the frontend to the EpochSend backend Express API for oracle-triggered conditions.
- **Tasks:**
  - [ ] Create `lib/api.ts` — base fetch client pointing to `NEXT_PUBLIC_BACKEND_URL`
  - [ ] Add `NEXT_PUBLIC_BACKEND_URL` to `.env.example`
  - [ ] Implement `GET /health` check — show backend connection status in UI
  - [ ] Implement `POST /api/webhooks/trigger` — submit oracle trigger requests
  - [ ] Handle API errors with typed error responses
  - [ ] Add request/response TypeScript types for all API endpoints

---

### Issue #FE-26: Oracle Webhook Registration UI
**Status:** ❌ PENDING | **Priority:** MEDIUM
**Labels:** `feature`, `oracle`, `form`
**Description:** When a user creates an oracle-condition intent, they need to register and test their webhook URL before locking funds.
- **Tasks:**
  - [ ] Add "Oracle Webhook URL" field to the create intent form (shown when Oracle condition selected)
  - [ ] Implement `POST /api/webhooks/test` — send a test ping to the user's URL and verify it responds 200
  - [ ] Show webhook test result inline: ✅ Reachable / ❌ Unreachable
  - [ ] Only allow form submission if webhook URL has been verified
  - [ ] Display registered webhook URL on the intent detail card

---

### Issue #FE-27: Oracle Condition Type in Form
**Status:** ❌ PENDING | **Priority:** MEDIUM
**Labels:** `feature`, `ui`, `oracle`
**Description:** The current form only shows two condition types (Time Lock / Arbiter). Add the Oracle/Webhook condition type.
- **Tasks:**
  - [ ] Add "Oracle" as a third tab in the condition toggle
  - [ ] Show: Webhook URL input, description field (e.g., "FedEx delivery confirmation"), oracle ID
  - [ ] Update `ConditionType` enum in `constants.ts` and contract interface to include Oracle
  - [ ] Pass oracle address to `create_intent()` call

---

### Issue #FE-28: Oracle Status Tracker
**Status:** 🔜 FUTURE | **Priority:** LOW
**Labels:** `feature`, `oracle`, `real-time`
**Description:** For oracle-triggered intents, show the current status of the oracle listener so users know the system is active.
- **Tasks:**
  - [ ] Show "Oracle listening..." status on intent cards with oracle condition
  - [ ] Display last webhook ping timestamp
  - [ ] Allow user to manually trigger execution after confirming oracle condition is met

---

### Issue #FE-29: Backend Health Indicator
**Status:** ❌ PENDING | **Priority:** LOW
**Labels:** `ux`, `backend`
**Description:** Show a subtle system status indicator so users know if the backend oracle service is online.
- **Tasks:**
  - [ ] Add a small status dot in the footer or navbar area
  - [ ] Poll `GET /health` every 60 seconds
  - [ ] Green = backend online, Red = backend offline
  - [ ] Show tooltip: "Oracle Service: Online / Offline"

---

## ✨ Module 6: UX Polish & Feedback (FE-30 → FE-36)

### Issue #FE-30: Error Boundary Implementation
**Status:** ❌ PENDING | **Priority:** HIGH
**Labels:** `stability`, `ux`
**Description:** Prevent the entire app from crashing when an unexpected JavaScript error occurs in a component subtree.
- **Tasks:**
  - [ ] Create `components/ErrorBoundary.tsx` React class component
  - [ ] Wrap the main content area in `<ErrorBoundary>`
  - [ ] Design fallback UI: branded error screen with "Something went wrong" + "Reload" button
  - [ ] Log errors to console (and later: error tracking service)

---

### Issue #FE-31: Mobile Responsiveness Audit
**Status:** ❌ PENDING | **Priority:** HIGH
**Labels:** `ui`, `responsive`
**Description:** The current 2-column grid layout is desktop-first. Audit and fix the layout for mobile viewports.
- **Tasks:**
  - [ ] Audit all breakpoints: 375px (mobile), 768px (tablet), 1280px (desktop)
  - [ ] Make the 2-column grid stack vertically on mobile (`grid-cols-1` below md)
  - [ ] Make the Navbar hamburger-friendly (or hide secondary links on mobile)
  - [ ] Ensure all form inputs and buttons have minimum 44px touch target size
  - [ ] Test Freighter wallet connection flow on mobile browser

---

### Issue #FE-32: Performance Optimisation
**Status:** ❌ PENDING | **Priority:** MEDIUM
**Labels:** `performance`, `optimisation`
**Description:** Optimise rendering performance as data fetching and component count grows.
- **Tasks:**
  - [ ] Wrap heavy components in `React.memo` to prevent unnecessary re-renders
  - [ ] Use `useCallback` for event handlers passed as props
  - [ ] Optimise public images with `next/image` (currently using raw `<img>` tags)
  - [ ] Add lazy loading for the `OnboardingModal` (not needed on first byte)
  - [ ] Audit and reduce bundle size — remove unused installed packages (`next-themes` if not used, `clsx` if not wired up)

---

### Issue #FE-33: Accessibility (a11y) Pass
**Status:** ❌ PENDING | **Priority:** MEDIUM
**Labels:** `accessibility`, `a11y`
**Description:** Ensure the application is usable with keyboard navigation and screen readers.
- **Tasks:**
  - [ ] Add `aria-label` to all icon-only buttons
  - [ ] Ensure modal (`OnboardingModal`) traps focus while open
  - [ ] Implement `role="status"` on toast notifications for screen reader announcement
  - [ ] Add `aria-live="polite"` region for dynamic content updates (intent status changes)
  - [ ] Verify keyboard tab order through the create-intent form is logical

---

### Issue #FE-34: Dark Mode Refinement
**Status:** ❌ PENDING | **Priority:** LOW
**Labels:** `ui`, `theming`
**Description:** Wire the installed `next-themes` package and add a usable theme toggle to the Navbar.
- **Tasks:**
  - [ ] Add `ThemeProvider` from `next-themes` to root layout
  - [ ] Create `components/ThemeToggle.tsx` — icon button (Sun/Moon) using Lucide icons
  - [ ] Add `ThemeToggle` to the Navbar
  - [ ] Define light mode CSS tokens in `globals.css` — surface backgrounds, card borders, text contrast
  - [ ] Test all components render correctly in both light and dark mode

---

### Issue #FE-35: Micro-Animations & Interaction Polish
**Status:** 🔨 IN PROGRESS | **Priority:** MEDIUM
**Labels:** `ui`, `animation`, `ux`
**Description:** Use Framer Motion (already installed) to add purposeful micro-animations throughout the intent creation flow.
- **Tasks:**
  - [x] Navbar entry animation (slide-down from top)
  - [x] Hero illustration fade-in and hover scale
  - [x] Onboarding modal slide transitions between cards
  - [ ] Add staggered entry animation to intent card grid (cards appear one-by-one, not all at once)
  - [ ] Animate condition toggle tab switch (slide indicator)
  - [ ] Animate form field appearance when switching condition type (Time Lock ↔ Arbiter)
  - [ ] Add "success" particle or confetti burst on intent creation confirmation

---

### Issue #FE-36: SEO & Open Graph
**Status:** ❌ PENDING | **Priority:** LOW
**Labels:** `seo`, `marketing`
**Description:** Ensure EpochSend is discoverable and shareable with proper metadata.
- **Tasks:**
  - [ ] Set `<title>` and `<meta name="description">` per page in `layout.tsx`
  - [ ] Add Open Graph tags: `og:title`, `og:description`, `og:image` (use `epochsend-banner.png`)
  - [ ] Add Twitter/X card tags
  - [ ] Add `robots.txt` and `sitemap.xml`
  - [ ] Verify all pages have a single `<h1>` with proper heading hierarchy

---

## 🚀 Module 7: Advanced Features & Phase 2 (FE-37 → FE-44)

### Issue #FE-37: Recurring Payment Scheduling UI
**Status:** 🔜 FUTURE | **Priority:** MEDIUM
**Labels:** `feature`, `phase-2`
**Description:** Allow users to schedule recurring payments (subscriptions) — "Send 50 USDC to [address] every Friday".
- **Tasks:**
  - [ ] Add "Recurring" as a fourth condition type in the create intent form
  - [ ] Build frequency selector: Daily, Weekly, Monthly, Custom interval
  - [ ] Display recurring intents separately in the dashboard with "Next execution" timestamp
  - [ ] Show total value committed over the full subscription period

---

### Issue #FE-38: Multi-Signature Arbiter Flow
**Status:** 🔜 FUTURE | **Priority:** MEDIUM
**Labels:** `feature`, `phase-2`, `security`
**Description:** Allow multiple arbiters to be required for execution (M-of-N multi-sig release).
- **Tasks:**
  - [ ] Add M-of-N arbiter configuration to create intent form
  - [ ] Show approval progress bar on intent cards: "2 of 3 arbiters approved"
  - [ ] Allow each arbiter to sign independently from their own connected wallet
  - [ ] Auto-execute when threshold is reached

---

### Issue #FE-39: Intent Sharing & Deep Links
**Status:** 🔜 FUTURE | **Priority:** LOW
**Labels:** `feature`, `ux`
**Description:** Allow users to share a specific intent with the recipient or arbiter via a direct link.
- **Tasks:**
  - [ ] Generate shareable URL: `epochsend.vercel.app/intent/[intent_id]`
  - [ ] Build `app/intent/[id]/page.tsx` — public view of an intent (no wallet needed to view)
  - [ ] Show: sender, recipient, amount, condition, current status
  - [ ] Allow arbiter to connect wallet and sign directly from the shared URL

---

### Issue #FE-40: Analytics Dashboard
**Status:** 🔜 FUTURE | **Priority:** LOW
**Labels:** `feature`, `analytics`, `phase-3`
**Description:** Protocol-level stats page showing aggregate EpochSend usage.
- **Tasks:**
  - [ ] Create `app/stats/page.tsx`
  - [ ] Display: Total Value Locked (TVL), total intents created, execution rate (%), most used condition type
  - [ ] Fetch aggregate data from contract state or backend indexer
  - [ ] Render area chart of TVL over time using a charting library (e.g., `recharts`)

---

### Issue #FE-41: Internationalisation (i18n) Readiness
**Status:** 🔜 FUTURE | **Priority:** LOW
**Labels:** `i18n`, `phase-3`
**Description:** Prepare the codebase for multi-language support, prioritising markets where Stellar is highly adopted (Nigeria, SE Asia, LatAm).
- **Tasks:**
  - [ ] Audit all hardcoded English strings in components
  - [ ] Extract strings to translation files (`/locales/en.json`)
  - [ ] Set up `next-intl` or equivalent library
  - [ ] Add locale switcher component to Navbar

---

### Issue #FE-42: EpochSend SDK Export Layer
**Status:** 🔜 FUTURE | **Priority:** LOW
**Labels:** `sdk`, `phase-3`, `developer`
**Description:** Package the core escrow hooks and Soroban helpers as a reusable SDK that third-party dApps can import.
- **Tasks:**
  - [ ] Extract `useCreateEscrow`, `useExecuteEscrow`, `useRefundEscrow`, `useGetIntents` into a publishable package
  - [ ] Create `packages/epochsend-sdk/` directory with its own `package.json`
  - [ ] Write developer documentation with usage examples
  - [ ] Publish to npm under `@epochsend/sdk`

---

### Issue #FE-43: MoneyGram Off-Ramp Integration
**Status:** 🔜 FUTURE | **Priority:** LOW
**Labels:** `feature`, `phase-3`, `fiat`
**Description:** Allow recipients to cash out their received USDC via MoneyGram's Stellar integration.
- **Tasks:**
  - [ ] Research MoneyGram's Stellar Circle API for off-ramp flows
  - [ ] Add "Cash Out" button on executed intent cards for recipients
  - [ ] Build off-ramp flow: initiate → KYC check → receive cash reference code

---

### Issue #FE-44: Stellar Expert / Explorer Deep Links
**Status:** ❌ PENDING | **Priority:** LOW
**Labels:** `ux`, `transparency`
**Description:** Every on-chain transaction should have a direct link to a block explorer so users can independently verify.
- **Tasks:**
  - [ ] Determine explorer URL pattern: `https://stellar.expert/explorer/testnet/tx/[hash]`
  - [ ] Add "View on Stellar Expert" link to: intent creation confirmation, intent detail cards, transaction history items
  - [ ] Switch explorer URL dynamically based on active network (Testnet vs Mainnet)

---

## 📌 Issue Numbering Reference

| Range | Module |
|---|---|
| FE-01 – FE-06 | Foundation & Configuration |
| FE-07 – FE-11 | Wallet & Blockchain Integration |
| FE-12 – FE-18 | Core Escrow — Create Intent Flow |
| FE-19 – FE-24 | Active Intents Dashboard |
| FE-25 – FE-29 | Oracle & Backend Integration |
| FE-30 – FE-36 | UX Polish & Feedback |
| FE-37 – FE-44 | Advanced Features & Phase 2 |

---

*EpochSend — Programmable payments for the Stellar Network. Building in public.*
