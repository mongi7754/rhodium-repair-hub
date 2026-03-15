
-- Customers table
CREATE TABLE public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  phone text DEFAULT '',
  email text DEFAULT '',
  address text DEFAULT '',
  notes text DEFAULT '',
  total_spent numeric NOT NULL DEFAULT 0,
  visit_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on customers" ON public.customers FOR ALL USING (true) WITH CHECK (true);

-- Suppliers table
CREATE TABLE public.suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  phone text DEFAULT '',
  email text DEFAULT '',
  address text DEFAULT '',
  company text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on suppliers" ON public.suppliers FOR ALL USING (true) WITH CHECK (true);

-- Sale items (line items per sale)
CREATE TABLE public.sale_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id uuid NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric NOT NULL,
  discount_amount numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on sale_items" ON public.sale_items FOR ALL USING (true) WITH CHECK (true);

-- Returns / refunds table
CREATE TABLE public.returns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  sale_id uuid REFERENCES public.sales(id) ON DELETE SET NULL,
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  refund_amount numeric NOT NULL DEFAULT 0,
  reason text DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);

ALTER TABLE public.returns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on returns" ON public.returns FOR ALL USING (true) WITH CHECK (true);

-- Discounts / promotions table
CREATE TABLE public.discounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  type text NOT NULL DEFAULT 'percentage',
  value numeric NOT NULL DEFAULT 0,
  min_purchase numeric NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  start_date date DEFAULT CURRENT_DATE,
  end_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.discounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on discounts" ON public.discounts FOR ALL USING (true) WITH CHECK (true);

-- Add customer_id and discount columns to sales table
ALTER TABLE public.sales
  ADD COLUMN IF NOT EXISTS customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS customer_name text DEFAULT '',
  ADD COLUMN IF NOT EXISTS discount_amount numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'completed';

-- Add supplier_id to products
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS supplier_id uuid REFERENCES public.suppliers(id) ON DELETE SET NULL;

-- Update triggers for updated_at
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON public.suppliers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
