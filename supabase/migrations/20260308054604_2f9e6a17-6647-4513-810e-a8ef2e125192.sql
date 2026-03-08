ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS payment_type text NOT NULL DEFAULT 'insurance';
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS adjuster_email text DEFAULT '';

-- Update existing jobs: if carrier is empty or null, mark as self_pay
UPDATE public.jobs SET payment_type = 'self_pay' WHERE carrier IS NULL OR carrier = '';