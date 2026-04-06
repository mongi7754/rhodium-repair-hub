
# FlowMint — Zero-Input Fintech Platform

## Phase 1: Foundation & Core UI
- Replace FleetIQ with FlowMint branding, design system (dark futuristic fintech theme)
- Create main layout with sidebar navigation
- Build 6 core pages: Dashboard, Wallet, POS, AI Assistant, Analytics, Settings

## Phase 2: Database Schema
- Create tables: `wallet_transactions`, `wallet_accounts`, `pos_sessions`, `ai_insights`
- Reuse existing tables: `sales`, `products`, `customers`, `expenses`

## Phase 3: Dashboard & Analytics
- Real-time financial overview (income, expenses, profit, savings)
- Charts: revenue trends, expense breakdown, profit margins
- All data starts at zero, editable via manual override

## Phase 4: Digital Wallet
- Transaction list with auto-categorization
- Income split visualization (expenses/savings/profit)
- Add transaction with AI-suggested categories (manual override available)
- M-Pesa integration ready (existing edge function)

## Phase 5: Smart POS
- Product catalog with quick-add
- Cart system with auto-total
- Payment confirmation flow
- Receipt auto-generation

## Phase 6: AI Financial Assistant
- Chat interface powered by Lovable AI
- Financial insights, predictions, and suggestions
- Conversational interaction for queries

## Technical Notes
- Uses existing Supabase/Lovable Cloud backend
- Lovable AI for the financial assistant (no extra API keys needed)
- Dark mode futuristic UI with glass morphism effects
- All pages start empty (zero data) with ability to add/edit
