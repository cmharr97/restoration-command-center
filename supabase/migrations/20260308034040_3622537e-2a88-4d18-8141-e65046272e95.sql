
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('owner', 'project_manager', 'estimator', 'office_admin', 'field_tech', 'subcontractor');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  role app_role NOT NULL DEFAULT 'field_tech',
  avatar TEXT DEFAULT '',
  certs TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'office',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- User roles table (security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Jobs table
CREATE TABLE public.jobs (
  id TEXT PRIMARY KEY,
  customer TEXT NOT NULL,
  address TEXT NOT NULL DEFAULT '',
  phone TEXT DEFAULT '',
  loss_type TEXT NOT NULL DEFAULT 'water',
  loss_subtype TEXT DEFAULT '',
  stage TEXT NOT NULL DEFAULT 'lead',
  pm_id UUID REFERENCES public.profiles(id),
  pm_name TEXT DEFAULT '',
  carrier TEXT DEFAULT '',
  claim_no TEXT DEFAULT '',
  adjuster TEXT DEFAULT '',
  adjuster_phone TEXT DEFAULT '',
  date_of_loss DATE,
  contract_value NUMERIC,
  mitigation_value NUMERIC,
  recon BOOLEAN DEFAULT false,
  recon_value NUMERIC,
  day_of_drying INTEGER,
  moisture_alerts INTEGER DEFAULT 0,
  notes TEXT DEFAULT '',
  priority TEXT DEFAULT 'normal',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read jobs" ON public.jobs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert jobs" ON public.jobs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update jobs" ON public.jobs FOR UPDATE TO authenticated USING (true);

-- Messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id TEXT NOT NULL,
  sender_id UUID REFERENCES auth.users(id) NOT NULL,
  sender_name TEXT NOT NULL,
  text TEXT NOT NULL,
  mentions TEXT[] DEFAULT '{}',
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read messages" ON public.messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own messages" ON public.messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Drying logs table
CREATE TABLE public.drying_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id TEXT REFERENCES public.jobs(id) NOT NULL,
  day INTEGER NOT NULL,
  date TEXT NOT NULL,
  tech_name TEXT NOT NULL,
  gpp NUMERIC,
  temp NUMERIC,
  rh NUMERIC,
  readings JSONB DEFAULT '[]',
  equipment JSONB DEFAULT '{}',
  notes TEXT DEFAULT '',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.drying_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read drying logs" ON public.drying_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert drying logs" ON public.drying_logs FOR INSERT TO authenticated WITH CHECK (true);

-- Automation rules table
CREATE TABLE public.automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  trigger_type TEXT NOT NULL,
  action_type TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  config JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.automation_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read automation rules" ON public.automation_rules FOR SELECT TO authenticated USING (true);
CREATE POLICY "Owners can manage automation rules" ON public.automation_rules FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'owner'));

-- Auto-create profile on signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'field_tech')
  );
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'field_tech')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
