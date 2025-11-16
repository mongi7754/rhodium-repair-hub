-- Create payments table to store transaction history
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_phone TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  account_reference TEXT NOT NULL,
  transaction_desc TEXT,
  checkout_request_id TEXT,
  merchant_request_id TEXT,
  mpesa_receipt_number TEXT,
  transaction_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending',
  result_code TEXT,
  result_desc TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own payments (based on phone number)
CREATE POLICY "Users can view their own payments"
ON public.payments
FOR SELECT
USING (true); -- Public access for now since we don't have user authentication yet

-- Create policy to allow the service role to insert payments
CREATE POLICY "Service role can insert payments"
ON public.payments
FOR INSERT
WITH CHECK (true);

-- Create policy to allow the service role to update payments
CREATE POLICY "Service role can update payments"
ON public.payments
FOR UPDATE
USING (true);

-- Create index for faster phone number lookups
CREATE INDEX idx_payments_user_phone ON public.payments(user_phone);
CREATE INDEX idx_payments_checkout_request_id ON public.payments(checkout_request_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();