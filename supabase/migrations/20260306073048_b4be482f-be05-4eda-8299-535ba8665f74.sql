
-- Employees table for simple name/PIN tracking
CREATE TABLE public.employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  pin text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own employees" ON public.employees FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Activity logs table to track all employee actions
CREATE TABLE public.activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  employee_id uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  employee_name text NOT NULL DEFAULT '',
  action_type text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own activity logs" ON public.activity_logs FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Fraud alerts table for AI-flagged suspicious activities
CREATE TABLE public.fraud_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  employee_id uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  employee_name text NOT NULL DEFAULT '',
  alert_type text NOT NULL,
  severity text NOT NULL DEFAULT 'medium',
  title text NOT NULL,
  description text NOT NULL,
  details jsonb DEFAULT '{}'::jsonb,
  is_resolved boolean NOT NULL DEFAULT false,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.fraud_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own fraud alerts" ON public.fraud_alerts FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Trigger to update updated_at on employees
CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
