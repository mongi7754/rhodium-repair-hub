
-- Drop the ALL policies and replace with specific ones for products
DROP POLICY "Users manage own products" ON public.products;
CREATE POLICY "Users select own products" ON public.products FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own products" ON public.products FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own products" ON public.products FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own products" ON public.products FOR DELETE USING (auth.uid() = user_id);

-- Drop the ALL policies and replace with specific ones for sales
DROP POLICY "Users manage own sales" ON public.sales;
CREATE POLICY "Users select own sales" ON public.sales FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own sales" ON public.sales FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own sales" ON public.sales FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own sales" ON public.sales FOR DELETE USING (auth.uid() = user_id);

-- Drop the ALL policies and replace with specific ones for expenses
DROP POLICY "Users manage own expenses" ON public.expenses;
CREATE POLICY "Users select own expenses" ON public.expenses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own expenses" ON public.expenses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own expenses" ON public.expenses FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own expenses" ON public.expenses FOR DELETE USING (auth.uid() = user_id);
