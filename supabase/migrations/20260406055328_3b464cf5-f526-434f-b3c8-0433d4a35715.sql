
-- Wallet accounts
CREATE TABLE public.wallet_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  account_type TEXT NOT NULL DEFAULT 'main',
  currency TEXT NOT NULL DEFAULT 'KES',
  balance NUMERIC NOT NULL DEFAULT 0,
  split_percentage NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.wallet_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on wallet_accounts" ON public.wallet_accounts FOR ALL USING (true) WITH CHECK (true);

-- Wallet transactions
CREATE TABLE public.wallet_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  account_id UUID REFERENCES public.wallet_accounts(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  transaction_type TEXT NOT NULL DEFAULT 'income',
  category TEXT NOT NULL DEFAULT 'uncategorized',
  description TEXT DEFAULT '',
  payment_method TEXT DEFAULT 'cash',
  reference TEXT DEFAULT '',
  is_auto_detected BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on wallet_transactions" ON public.wallet_transactions FOR ALL USING (true) WITH CHECK (true);

-- POS sessions
CREATE TABLE public.pos_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  discount NUMERIC NOT NULL DEFAULT 0,
  tax NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  payment_method TEXT DEFAULT 'cash',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  receipt_number TEXT DEFAULT '',
  customer_name TEXT DEFAULT '',
  customer_phone TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.pos_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on pos_sessions" ON public.pos_sessions FOR ALL USING (true) WITH CHECK (true);

-- AI insights
CREATE TABLE public.ai_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  insight_type TEXT NOT NULL DEFAULT 'suggestion',
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  priority TEXT NOT NULL DEFAULT 'medium',
  action_url TEXT DEFAULT '',
  is_read BOOLEAN NOT NULL DEFAULT false,
  is_dismissed BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on ai_insights" ON public.ai_insights FOR ALL USING (true) WITH CHECK (true);
