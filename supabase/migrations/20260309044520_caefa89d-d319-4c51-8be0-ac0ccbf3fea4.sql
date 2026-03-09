-- Create customers table for CRM
CREATE TABLE public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text DEFAULT '',
  phone text DEFAULT '',
  address text DEFAULT '',
  city text DEFAULT '',
  state text DEFAULT '',
  zip text DEFAULT '',
  notes text DEFAULT '',
  source text DEFAULT 'direct', -- direct, referral, web, insurance_referral
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create leads table for pipeline
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  phone text DEFAULT '',
  email text DEFAULT '',
  address text DEFAULT '',
  loss_type text DEFAULT 'water',
  source text DEFAULT 'direct', -- direct, referral, web, insurance_referral
  stage text DEFAULT 'new', -- new, contacted, inspection_scheduled, estimate_sent, contract_signed, converted, lost
  priority text DEFAULT 'normal', -- low, normal, high, urgent
  notes text DEFAULT '',
  inspection_date timestamptz,
  estimated_value numeric DEFAULT 0,
  assigned_to uuid REFERENCES auth.users(id),
  assigned_to_name text DEFAULT '',
  converted_job_id text,
  lost_reason text DEFAULT '',
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- RLS policies for customers
CREATE POLICY "Users can read company customers" ON public.customers
  FOR SELECT USING (
    company_id = get_user_company_id(auth.uid()) OR created_by = auth.uid()
  );

CREATE POLICY "Users can insert customers" ON public.customers
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update company customers" ON public.customers
  FOR UPDATE USING (
    company_id = get_user_company_id(auth.uid()) OR created_by = auth.uid()
  );

CREATE POLICY "Owners can delete customers" ON public.customers
  FOR DELETE USING (has_role(auth.uid(), 'owner'));

-- RLS policies for leads
CREATE POLICY "Users can read company leads" ON public.leads
  FOR SELECT USING (
    company_id = get_user_company_id(auth.uid()) OR created_by = auth.uid()
  );

CREATE POLICY "Users can insert leads" ON public.leads
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update company leads" ON public.leads
  FOR UPDATE USING (
    company_id = get_user_company_id(auth.uid()) OR created_by = auth.uid()
  );

CREATE POLICY "Owners can delete leads" ON public.leads
  FOR DELETE USING (has_role(auth.uid(), 'owner'));