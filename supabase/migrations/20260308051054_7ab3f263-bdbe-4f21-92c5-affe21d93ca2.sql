
-- Drop all RESTRICTIVE policies and recreate as PERMISSIVE (default)
-- This fixes the issue where having only restrictive policies blocks all access

-- ===== JOBS =====
DROP POLICY IF EXISTS "Users can read company jobs" ON public.jobs;
DROP POLICY IF EXISTS "Users can insert jobs" ON public.jobs;
DROP POLICY IF EXISTS "Job stakeholders can update jobs" ON public.jobs;
DROP POLICY IF EXISTS "Owners can delete jobs" ON public.jobs;

CREATE POLICY "Users can read company jobs" ON public.jobs FOR SELECT TO authenticated
  USING (company_id = get_user_company_id(auth.uid()) OR created_by = auth.uid());

CREATE POLICY "Users can insert jobs" ON public.jobs FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Job stakeholders can update jobs" ON public.jobs FOR UPDATE TO authenticated
  USING (auth.uid() = created_by OR auth.uid() = pm_id OR has_role(auth.uid(), 'owner'::app_role));

CREATE POLICY "Owners can delete jobs" ON public.jobs FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'owner'::app_role));

-- ===== PROFILES =====
DROP POLICY IF EXISTS "Users can read company profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can read company profiles" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR company_id = get_user_company_id(auth.uid()));

CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- ===== COMPANIES =====
DROP POLICY IF EXISTS "Owner can manage own company" ON public.companies;
DROP POLICY IF EXISTS "Team can read own company" ON public.companies;

CREATE POLICY "Owner can manage own company" ON public.companies FOR ALL TO authenticated
  USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Team can read own company" ON public.companies FOR SELECT TO authenticated
  USING (id = get_user_company_id(auth.uid()) OR owner_id = auth.uid());

-- ===== CLAIMS =====
DROP POLICY IF EXISTS "Users can read company claims" ON public.claims;
DROP POLICY IF EXISTS "Authenticated users can insert claims" ON public.claims;
DROP POLICY IF EXISTS "Stakeholders can update claims" ON public.claims;

CREATE POLICY "Users can read company claims" ON public.claims FOR SELECT TO authenticated
  USING (company_id = get_user_company_id(auth.uid()) OR created_by = auth.uid());

CREATE POLICY "Users can insert claims" ON public.claims FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Stakeholders can update claims" ON public.claims FOR UPDATE TO authenticated
  USING (auth.uid() = created_by OR has_role(auth.uid(), 'owner'::app_role));

-- ===== SUPPLEMENTS =====
DROP POLICY IF EXISTS "Users can read company supplements" ON public.supplements;
DROP POLICY IF EXISTS "Authenticated users can insert supplements" ON public.supplements;
DROP POLICY IF EXISTS "Stakeholders can update supplements" ON public.supplements;

CREATE POLICY "Users can read company supplements" ON public.supplements FOR SELECT TO authenticated
  USING (company_id = get_user_company_id(auth.uid()) OR created_by = auth.uid());

CREATE POLICY "Users can insert supplements" ON public.supplements FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Stakeholders can update supplements" ON public.supplements FOR UPDATE TO authenticated
  USING (auth.uid() = created_by OR has_role(auth.uid(), 'owner'::app_role));

-- ===== PAYMENTS =====
DROP POLICY IF EXISTS "Users can read company payments" ON public.payments;
DROP POLICY IF EXISTS "Authenticated users can insert payments" ON public.payments;
DROP POLICY IF EXISTS "Stakeholders can update payments" ON public.payments;

CREATE POLICY "Users can read company payments" ON public.payments FOR SELECT TO authenticated
  USING (company_id = get_user_company_id(auth.uid()) OR created_by = auth.uid());

CREATE POLICY "Users can insert payments" ON public.payments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Stakeholders can update payments" ON public.payments FOR UPDATE TO authenticated
  USING (auth.uid() = created_by OR has_role(auth.uid(), 'owner'::app_role));

-- ===== ACTIVITY LOGS =====
DROP POLICY IF EXISTS "Users can read company activity logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Users can insert activity logs" ON public.activity_logs;

CREATE POLICY "Users can read company activity logs" ON public.activity_logs FOR SELECT TO authenticated
  USING (company_id = get_user_company_id(auth.uid()) OR user_id = auth.uid());

CREATE POLICY "Users can insert activity logs" ON public.activity_logs FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- ===== DRYING LOGS =====
DROP POLICY IF EXISTS "Users can read company drying logs" ON public.drying_logs;
DROP POLICY IF EXISTS "Authenticated users can insert own drying logs" ON public.drying_logs;
DROP POLICY IF EXISTS "Users can update own drying logs" ON public.drying_logs;
DROP POLICY IF EXISTS "Users can delete own drying logs" ON public.drying_logs;

CREATE POLICY "Users can read company drying logs" ON public.drying_logs FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM jobs j WHERE j.id = drying_logs.job_id AND (j.company_id = get_user_company_id(auth.uid()) OR j.created_by = auth.uid())));

CREATE POLICY "Users can insert drying logs" ON public.drying_logs FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own drying logs" ON public.drying_logs FOR UPDATE TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Users can delete own drying logs" ON public.drying_logs FOR DELETE TO authenticated
  USING (created_by = auth.uid());

-- ===== JOB PHOTOS =====
DROP POLICY IF EXISTS "Users can read company job photos" ON public.job_photos;
DROP POLICY IF EXISTS "Users can insert job photos" ON public.job_photos;
DROP POLICY IF EXISTS "Users can delete own photos" ON public.job_photos;

CREATE POLICY "Users can read company job photos" ON public.job_photos FOR SELECT TO authenticated
  USING (company_id = get_user_company_id(auth.uid()) OR uploaded_by = auth.uid());

CREATE POLICY "Users can insert job photos" ON public.job_photos FOR INSERT TO authenticated
  WITH CHECK (uploaded_by = auth.uid());

CREATE POLICY "Users can delete own photos" ON public.job_photos FOR DELETE TO authenticated
  USING (uploaded_by = auth.uid() OR has_role(auth.uid(), 'owner'::app_role));

-- ===== SUBCONTRACTORS =====
DROP POLICY IF EXISTS "Users can read company subcontractors" ON public.subcontractors;
DROP POLICY IF EXISTS "Authenticated users can insert subcontractors" ON public.subcontractors;
DROP POLICY IF EXISTS "Owners can update subcontractors" ON public.subcontractors;

CREATE POLICY "Users can read company subcontractors" ON public.subcontractors FOR SELECT TO authenticated
  USING (company_id = get_user_company_id(auth.uid()) OR created_by = auth.uid());

CREATE POLICY "Users can insert subcontractors" ON public.subcontractors FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Owners can update subcontractors" ON public.subcontractors FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'owner'::app_role));

-- ===== SUBCONTRACTOR ASSIGNMENTS =====
DROP POLICY IF EXISTS "Users can read company assignments" ON public.subcontractor_assignments;
DROP POLICY IF EXISTS "Users can insert assignments" ON public.subcontractor_assignments;
DROP POLICY IF EXISTS "Owners and PMs can update assignments" ON public.subcontractor_assignments;

CREATE POLICY "Users can read company assignments" ON public.subcontractor_assignments FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM jobs j WHERE j.id = subcontractor_assignments.job_id AND (j.company_id = get_user_company_id(auth.uid()) OR j.created_by = auth.uid())));

CREATE POLICY "Users can insert assignments" ON public.subcontractor_assignments FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM jobs j WHERE j.id = subcontractor_assignments.job_id AND (j.company_id = get_user_company_id(auth.uid()) OR j.created_by = auth.uid())));

CREATE POLICY "Owners and PMs can update assignments" ON public.subcontractor_assignments FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'owner'::app_role) OR has_role(auth.uid(), 'project_manager'::app_role));

-- ===== MESSAGES =====
DROP POLICY IF EXISTS "Authenticated users can read messages" ON public.messages;
DROP POLICY IF EXISTS "Users can insert own messages" ON public.messages;

CREATE POLICY "Authenticated users can read messages" ON public.messages FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can insert own messages" ON public.messages FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = sender_id);

-- ===== AUTOMATION RULES =====
DROP POLICY IF EXISTS "Owners can manage automation rules" ON public.automation_rules;
DROP POLICY IF EXISTS "Users can read automation rules" ON public.automation_rules;

CREATE POLICY "Owners can manage automation rules" ON public.automation_rules FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'owner'::app_role));

-- ===== USER ROLES =====
DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;

CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
