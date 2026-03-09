
-- Allow owners and creators to delete payments
CREATE POLICY "Owners can delete payments"
ON public.payments
FOR DELETE
USING (
  (auth.uid() = created_by) OR has_role(auth.uid(), 'owner'::app_role)
);

-- Allow owners and PMs to delete subcontractor assignments
CREATE POLICY "Owners can delete assignments"
ON public.subcontractor_assignments
FOR DELETE
USING (
  has_role(auth.uid(), 'owner'::app_role) OR has_role(auth.uid(), 'project_manager'::app_role)
);
