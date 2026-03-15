
-- Drop existing restrictive policies on sales
DROP POLICY IF EXISTS "Users select own sales" ON public.sales;
DROP POLICY IF EXISTS "Users insert own sales" ON public.sales;
DROP POLICY IF EXISTS "Users update own sales" ON public.sales;
DROP POLICY IF EXISTS "Users delete own sales" ON public.sales;

-- Create open policies for sales (no auth required, matched by user_id in request)
CREATE POLICY "Allow all select on sales" ON public.sales FOR SELECT USING (true);
CREATE POLICY "Allow all insert on sales" ON public.sales FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update on sales" ON public.sales FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow all delete on sales" ON public.sales FOR DELETE USING (true);

-- Drop existing restrictive policies on expenses
DROP POLICY IF EXISTS "Users select own expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users insert own expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users update own expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users delete own expenses" ON public.expenses;

-- Create open policies for expenses
CREATE POLICY "Allow all select on expenses" ON public.expenses FOR SELECT USING (true);
CREATE POLICY "Allow all insert on expenses" ON public.expenses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update on expenses" ON public.expenses FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow all delete on expenses" ON public.expenses FOR DELETE USING (true);

-- Drop existing restrictive policies on products
DROP POLICY IF EXISTS "Users select own products" ON public.products;
DROP POLICY IF EXISTS "Users insert own products" ON public.products;
DROP POLICY IF EXISTS "Users update own products" ON public.products;
DROP POLICY IF EXISTS "Users delete own products" ON public.products;

-- Create open policies for products
CREATE POLICY "Allow all select on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow all insert on products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update on products" ON public.products FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow all delete on products" ON public.products FOR DELETE USING (true);

-- Drop existing restrictive policies on profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create open policies for profiles
CREATE POLICY "Allow all select on profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow all insert on profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update on profiles" ON public.profiles FOR UPDATE USING (true) WITH CHECK (true);

-- Drop existing restrictive policies on employees
DROP POLICY IF EXISTS "Users manage own employees" ON public.employees;

-- Create open policies for employees
CREATE POLICY "Allow all on employees" ON public.employees FOR ALL USING (true) WITH CHECK (true);

-- Drop existing restrictive policies on activity_logs
DROP POLICY IF EXISTS "Users manage own activity logs" ON public.activity_logs;

-- Create open policies for activity_logs
CREATE POLICY "Allow all on activity_logs" ON public.activity_logs FOR ALL USING (true) WITH CHECK (true);

-- Drop existing restrictive policies on fraud_alerts
DROP POLICY IF EXISTS "Users manage own fraud alerts" ON public.fraud_alerts;

-- Create open policies for fraud_alerts
CREATE POLICY "Allow all on fraud_alerts" ON public.fraud_alerts FOR ALL USING (true) WITH CHECK (true);
