
-- Fix permissive INSERT on jobs - restrict to authenticated with created_by set
DROP POLICY "Authenticated users can insert jobs" ON public.jobs;
CREATE POLICY "Authenticated users can insert jobs" ON public.jobs FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

-- Fix permissive UPDATE on jobs - only PM or creator can update
DROP POLICY "Authenticated users can update jobs" ON public.jobs;
CREATE POLICY "Job stakeholders can update jobs" ON public.jobs FOR UPDATE TO authenticated USING (auth.uid() = created_by OR auth.uid() = pm_id OR public.has_role(auth.uid(), 'owner'));

-- Fix permissive INSERT on drying_logs
DROP POLICY "Authenticated users can insert drying logs" ON public.drying_logs;
CREATE POLICY "Authenticated users can insert own drying logs" ON public.drying_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
