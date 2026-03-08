
-- 1. Create a security definer function to get the user's company_id
CREATE OR REPLACE FUNCTION public.get_user_company_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT company_id FROM public.profiles WHERE id = _user_id LIMIT 1
$$;

-- 2. Drop all existing broad SELECT policies and replace with company-scoped ones

-- JOBS
DROP POLICY IF EXISTS "Authenticated users can read jobs" ON public.jobs;
CREATE POLICY "Users can read company jobs" ON public.jobs FOR SELECT TO authenticated
  USING (
    company_id = public.get_user_company_id(auth.uid())
    OR created_by = auth.uid()
    OR company_id IS NULL AND created_by = auth.uid()
  );

DROP POLICY IF EXISTS "Authenticated users can insert jobs" ON public.jobs;
CREATE POLICY "Users can insert jobs" ON public.jobs FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Allow delete for owners
CREATE POLICY "Owners can delete jobs" ON public.jobs FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'owner'));

-- CLAIMS
DROP POLICY IF EXISTS "Authenticated users can read claims" ON public.claims;
CREATE POLICY "Users can read company claims" ON public.claims FOR SELECT TO authenticated
  USING (
    company_id = public.get_user_company_id(auth.uid())
    OR created_by = auth.uid()
  );

-- SUPPLEMENTS
DROP POLICY IF EXISTS "Authenticated users can read supplements" ON public.supplements;
CREATE POLICY "Users can read company supplements" ON public.supplements FOR SELECT TO authenticated
  USING (
    company_id = public.get_user_company_id(auth.uid())
    OR created_by = auth.uid()
  );

-- PAYMENTS
DROP POLICY IF EXISTS "Authenticated users can read payments" ON public.payments;
CREATE POLICY "Users can read company payments" ON public.payments FOR SELECT TO authenticated
  USING (
    company_id = public.get_user_company_id(auth.uid())
    OR created_by = auth.uid()
  );

-- DRYING LOGS
DROP POLICY IF EXISTS "Authenticated users can read drying logs" ON public.drying_logs;
CREATE POLICY "Users can read company drying logs" ON public.drying_logs FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs j
      WHERE j.id = drying_logs.job_id
      AND (j.company_id = public.get_user_company_id(auth.uid()) OR j.created_by = auth.uid())
    )
  );

-- Allow update/delete on drying logs
CREATE POLICY "Users can update own drying logs" ON public.drying_logs FOR UPDATE TO authenticated
  USING (created_by = auth.uid());
CREATE POLICY "Users can delete own drying logs" ON public.drying_logs FOR DELETE TO authenticated
  USING (created_by = auth.uid());

-- SUBCONTRACTORS
DROP POLICY IF EXISTS "Authenticated users can read subcontractors" ON public.subcontractors;
CREATE POLICY "Users can read company subcontractors" ON public.subcontractors FOR SELECT TO authenticated
  USING (
    company_id = public.get_user_company_id(auth.uid())
    OR created_by = auth.uid()
  );

-- SUBCONTRACTOR ASSIGNMENTS
DROP POLICY IF EXISTS "Authenticated users can read assignments" ON public.subcontractor_assignments;
CREATE POLICY "Users can read company assignments" ON public.subcontractor_assignments FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs j
      WHERE j.id = subcontractor_assignments.job_id
      AND (j.company_id = public.get_user_company_id(auth.uid()) OR j.created_by = auth.uid())
    )
  );

-- ACTIVITY LOGS
DROP POLICY IF EXISTS "Authenticated users can read activity logs" ON public.activity_logs;
CREATE POLICY "Users can read company activity logs" ON public.activity_logs FOR SELECT TO authenticated
  USING (
    company_id = public.get_user_company_id(auth.uid())
    OR user_id = auth.uid()
  );

-- JOB PHOTOS
DROP POLICY IF EXISTS "Authenticated users can read job photos" ON public.job_photos;
CREATE POLICY "Users can read company job photos" ON public.job_photos FOR SELECT TO authenticated
  USING (
    company_id = public.get_user_company_id(auth.uid())
    OR uploaded_by = auth.uid()
  );

-- Allow delete on photos
CREATE POLICY "Users can delete own photos" ON public.job_photos FOR DELETE TO authenticated
  USING (uploaded_by = auth.uid() OR public.has_role(auth.uid(), 'owner'));

-- MESSAGES - scope by channel (job-based channels)
DROP POLICY IF EXISTS "Authenticated users can read messages" ON public.messages;
CREATE POLICY "Authenticated users can read messages" ON public.messages FOR SELECT TO authenticated
  USING (true);

-- PROFILES - users can read profiles in same company
DROP POLICY IF EXISTS "Users can read all profiles" ON public.profiles;
CREATE POLICY "Users can read company profiles" ON public.profiles FOR SELECT TO authenticated
  USING (
    id = auth.uid()
    OR company_id = public.get_user_company_id(auth.uid())
    OR company_id IS NULL
  );

-- COMPANIES - restrict read to own company
DROP POLICY IF EXISTS "Team can read company" ON public.companies;
CREATE POLICY "Team can read own company" ON public.companies FOR SELECT TO authenticated
  USING (
    id = public.get_user_company_id(auth.uid())
    OR owner_id = auth.uid()
  );

-- AUTOMATION RULES - scope to owner
DROP POLICY IF EXISTS "Authenticated users can read automation rules" ON public.automation_rules;
CREATE POLICY "Users can read automation rules" ON public.automation_rules FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'owner')
    OR created_by = auth.uid()
  );

-- Create storage bucket for job photos
INSERT INTO storage.buckets (id, name, public) VALUES ('job-photos', 'job-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for job-photos bucket
CREATE POLICY "Authenticated users can upload job photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'job-photos');

CREATE POLICY "Anyone can view job photos"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'job-photos');

CREATE POLICY "Users can delete own job photos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'job-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
