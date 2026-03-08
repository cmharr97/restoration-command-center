
-- Fix the 3 remaining WITH CHECK (true) INSERT policies

-- activity_logs: require user_id to be set
DROP POLICY IF EXISTS "Authenticated users can insert activity logs" ON public.activity_logs;
CREATE POLICY "Users can insert activity logs" ON public.activity_logs FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- job_photos: require uploaded_by to match
DROP POLICY IF EXISTS "Authenticated users can insert job photos" ON public.job_photos;
CREATE POLICY "Users can insert job photos" ON public.job_photos FOR INSERT TO authenticated
  WITH CHECK (uploaded_by = auth.uid());

-- subcontractor_assignments: require job belongs to user's company
DROP POLICY IF EXISTS "Authenticated users can insert assignments" ON public.subcontractor_assignments;
CREATE POLICY "Users can insert assignments" ON public.subcontractor_assignments FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.jobs j
      WHERE j.id = subcontractor_assignments.job_id
      AND (j.company_id = public.get_user_company_id(auth.uid()) OR j.created_by = auth.uid())
    )
  );
