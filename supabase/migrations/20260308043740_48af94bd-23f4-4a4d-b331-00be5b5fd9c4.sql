
-- Fix: DROP POLICY doesn't use FOR clause
DROP POLICY "Stakeholders can update assignments" ON public.subcontractor_assignments;
CREATE POLICY "Owners and PMs can update assignments" ON public.subcontractor_assignments FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'owner'::app_role) OR has_role(auth.uid(), 'project_manager'::app_role));
