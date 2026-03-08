
-- Add company_id to jobs table
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id);
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS mortgage_company text DEFAULT '';
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS scope_notes text DEFAULT '';

-- Create claims table
CREATE TABLE public.claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id text NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  company_id uuid REFERENCES public.companies(id),
  estimate_submitted_date date,
  carrier_response_status text DEFAULT 'pending',
  supplement_status text DEFAULT 'none',
  denied_items jsonb DEFAULT '[]'::jsonb,
  pending_approvals jsonb DEFAULT '[]'::jsonb,
  recoverable_depreciation numeric DEFAULT 0,
  payments_received numeric DEFAULT 0,
  outstanding_balance numeric DEFAULT 0,
  reinspection_requested boolean DEFAULT false,
  reinspection_date date,
  notes text DEFAULT '',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read claims" ON public.claims FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert claims" ON public.claims FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Stakeholders can update claims" ON public.claims FOR UPDATE TO authenticated USING (auth.uid() = created_by OR has_role(auth.uid(), 'owner'::app_role));

-- Create supplements table
CREATE TABLE public.supplements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id text NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  company_id uuid REFERENCES public.companies(id),
  supplement_number integer DEFAULT 1,
  status text DEFAULT 'draft',
  contractor_estimate_url text DEFAULT '',
  carrier_estimate_url text DEFAULT '',
  contractor_total numeric DEFAULT 0,
  carrier_total numeric DEFAULT 0,
  difference numeric DEFAULT 0,
  missing_items jsonb DEFAULT '[]'::jsonb,
  quantity_differences jsonb DEFAULT '[]'::jsonb,
  scope_differences jsonb DEFAULT '[]'::jsonb,
  pricing_differences jsonb DEFAULT '[]'::jsonb,
  justification text DEFAULT '',
  submitted_date date,
  response_date date,
  approved_amount numeric DEFAULT 0,
  notes text DEFAULT '',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.supplements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read supplements" ON public.supplements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert supplements" ON public.supplements FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Stakeholders can update supplements" ON public.supplements FOR UPDATE TO authenticated USING (auth.uid() = created_by OR has_role(auth.uid(), 'owner'::app_role));

-- Create payments table
CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id text NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  company_id uuid REFERENCES public.companies(id),
  payment_type text NOT NULL DEFAULT 'initial',
  amount numeric NOT NULL DEFAULT 0,
  date_received date,
  source text DEFAULT '',
  check_number text DEFAULT '',
  deductible_amount numeric DEFAULT 0,
  deductible_collected boolean DEFAULT false,
  mortgage_hold boolean DEFAULT false,
  mortgage_hold_amount numeric DEFAULT 0,
  customer_responsibility numeric DEFAULT 0,
  notes text DEFAULT '',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read payments" ON public.payments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert payments" ON public.payments FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Stakeholders can update payments" ON public.payments FOR UPDATE TO authenticated USING (auth.uid() = created_by OR has_role(auth.uid(), 'owner'::app_role));

-- Create subcontractors table
CREATE TABLE public.subcontractors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.companies(id),
  name text NOT NULL,
  company_name text DEFAULT '',
  trade text NOT NULL DEFAULT 'general',
  phone text DEFAULT '',
  email text DEFAULT '',
  license_number text DEFAULT '',
  insurance_expiry date,
  notes text DEFAULT '',
  status text DEFAULT 'active',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.subcontractors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read subcontractors" ON public.subcontractors FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert subcontractors" ON public.subcontractors FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Owners can update subcontractors" ON public.subcontractors FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'owner'::app_role));

-- Create subcontractor_assignments table
CREATE TABLE public.subcontractor_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id text NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  subcontractor_id uuid NOT NULL REFERENCES public.subcontractors(id) ON DELETE CASCADE,
  trade text NOT NULL,
  status text DEFAULT 'assigned',
  scheduled_date date,
  completed_date date,
  amount numeric DEFAULT 0,
  notes text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.subcontractor_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read assignments" ON public.subcontractor_assignments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert assignments" ON public.subcontractor_assignments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Stakeholders can update assignments" ON public.subcontractor_assignments FOR UPDATE TO authenticated USING (true);

-- Create activity_logs table
CREATE TABLE public.activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id text REFERENCES public.jobs(id) ON DELETE CASCADE,
  company_id uuid REFERENCES public.companies(id),
  user_id uuid,
  user_name text DEFAULT '',
  action_type text NOT NULL DEFAULT 'note',
  title text NOT NULL,
  description text DEFAULT '',
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read activity logs" ON public.activity_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert activity logs" ON public.activity_logs FOR INSERT TO authenticated WITH CHECK (true);

-- Create job_photos table
CREATE TABLE public.job_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id text NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  company_id uuid REFERENCES public.companies(id),
  url text NOT NULL,
  caption text DEFAULT '',
  photo_type text DEFAULT 'general',
  taken_at timestamptz DEFAULT now(),
  uploaded_by uuid,
  uploaded_by_name text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.job_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read job photos" ON public.job_photos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert job photos" ON public.job_photos FOR INSERT TO authenticated WITH CHECK (true);

-- Enable realtime for activity_logs
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_logs;
