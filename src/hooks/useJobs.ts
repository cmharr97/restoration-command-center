import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface DbJob {
  id: string;
  customer: string;
  address: string;
  phone: string | null;
  loss_type: string;
  loss_subtype: string | null;
  stage: string;
  pm_name: string | null;
  pm_id: string | null;
  carrier: string | null;
  claim_no: string | null;
  adjuster: string | null;
  adjuster_phone: string | null;
  date_of_loss: string | null;
  contract_value: number | null;
  mitigation_value: number | null;
  recon: boolean | null;
  recon_value: number | null;
  day_of_drying: number | null;
  moisture_alerts: number | null;
  notes: string | null;
  priority: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  company_id: string | null;
  mortgage_company: string | null;
  scope_notes: string | null;
}

export interface NewJobData {
  customer: string;
  address: string;
  phone?: string;
  loss_type: string;
  loss_subtype?: string;
  carrier?: string;
  claim_no?: string;
  adjuster?: string;
  adjuster_phone?: string;
  date_of_loss?: string;
  pm_name?: string;
  priority?: string;
  notes?: string;
  mortgage_company?: string;
}

export const useJobs = () => {
  const [jobs, setJobs] = useState<DbJob[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, companyId } = useAuth();
  const { toast } = useToast();

  const fetchJobs = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    let query = supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });

    // Company-level isolation: only show jobs for current company
    if (companyId) {
      query = query.eq("company_id", companyId);
    } else {
      // No company yet — only show jobs created by this user
      query = query.eq("created_by", user.id);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching jobs:", error);
    } else {
      setJobs((data || []) as DbJob[]);
    }
    setLoading(false);
  }, [user, companyId]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const createJob = async (jobData: NewJobData) => {
    if (!user) return null;
    const jobId = `J-${Date.now().toString().slice(-4)}`;
    const { data, error } = await supabase.from("jobs").insert({
      id: jobId,
      customer: jobData.customer,
      address: jobData.address || "",
      phone: jobData.phone || "",
      loss_type: jobData.loss_type || "water",
      loss_subtype: jobData.loss_subtype || "",
      stage: "lead",
      carrier: jobData.carrier || "",
      claim_no: jobData.claim_no || "",
      adjuster: jobData.adjuster || "",
      adjuster_phone: jobData.adjuster_phone || "",
      date_of_loss: jobData.date_of_loss || null,
      pm_name: jobData.pm_name || "",
      priority: jobData.priority || "normal",
      notes: jobData.notes || "",
      mortgage_company: jobData.mortgage_company || "",
      created_by: user.id,
      company_id: companyId || null,
    } as any).select().single();

    if (error) {
      toast({ title: "Error creating job", description: error.message, variant: "destructive" });
      return null;
    }
    toast({ title: "Job Created", description: `${jobId} – ${jobData.customer}` });
    await fetchJobs();
    return data;
  };

  const updateJob = async (id: string, updates: Partial<DbJob>) => {
    const { error } = await supabase.from("jobs").update(updates as any).eq("id", id);
    if (error) {
      toast({ title: "Error updating job", description: error.message, variant: "destructive" });
      return false;
    }
    await fetchJobs();
    return true;
  };

  const deleteJob = async (id: string) => {
    const { error } = await supabase.from("jobs").delete().eq("id", id);
    if (error) {
      toast({ title: "Error deleting job", description: error.message, variant: "destructive" });
      return false;
    }
    await fetchJobs();
    return true;
  };

  return { jobs, loading, fetchJobs, createJob, updateJob, deleteJob };
};

export const useTeamMembers = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { companyId } = useAuth();

  useEffect(() => {
    const fetch = async () => {
      let query = supabase.from("profiles").select("*").order("created_at");
      if (companyId) {
        query = query.eq("company_id", companyId);
      }
      const { data, error } = await query;
      if (!error) setMembers(data || []);
      setLoading(false);
    };
    fetch();
  }, [companyId]);

  return { members, loading };
};

export const useDryingLogs = (jobId?: string) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      let query = supabase.from("drying_logs").select("*").order("day", { ascending: true });
      if (jobId) query = query.eq("job_id", jobId);
      const { data, error } = await query;
      if (!error) setLogs(data || []);
      setLoading(false);
    };
    fetch();
  }, [jobId]);

  return { logs, loading };
};

export const useClaims = (jobId?: string) => {
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { companyId } = useAuth();

  useEffect(() => {
    const fetch = async () => {
      let query = supabase.from("claims").select("*").order("created_at", { ascending: false });
      if (jobId) {
        query = query.eq("job_id", jobId);
      } else if (companyId) {
        query = query.eq("company_id", companyId);
      }
      const { data, error } = await query;
      if (!error) setClaims(data || []);
      setLoading(false);
    };
    fetch();
  }, [jobId, companyId]);

  return { claims, loading };
};

export const useSupplements = (jobId?: string) => {
  const [supplements, setSupplements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { companyId } = useAuth();

  useEffect(() => {
    const fetch = async () => {
      let query = supabase.from("supplements").select("*").order("created_at", { ascending: false });
      if (jobId) {
        query = query.eq("job_id", jobId);
      } else if (companyId) {
        query = query.eq("company_id", companyId);
      }
      const { data, error } = await query;
      if (!error) setSupplements(data || []);
      setLoading(false);
    };
    fetch();
  }, [jobId, companyId]);

  return { supplements, loading };
};

export const usePayments = (jobId?: string) => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { companyId } = useAuth();

  useEffect(() => {
    const fetch = async () => {
      let query = supabase.from("payments").select("*").order("created_at", { ascending: false });
      if (jobId) {
        query = query.eq("job_id", jobId);
      } else if (companyId) {
        query = query.eq("company_id", companyId);
      }
      const { data, error } = await query;
      if (!error) setPayments(data || []);
      setLoading(false);
    };
    fetch();
  }, [jobId, companyId]);

  return { payments, loading };
};

export const useSubcontractors = () => {
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { companyId } = useAuth();

  useEffect(() => {
    const fetch = async () => {
      let query = supabase.from("subcontractors").select("*").order("name");
      if (companyId) {
        query = query.eq("company_id", companyId);
      }
      const { data, error } = await query;
      if (!error) setSubs(data || []);
      setLoading(false);
    };
    fetch();
  }, [companyId]);

  return { subs, loading };
};

export const useActivityLogs = (jobId?: string) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { companyId } = useAuth();

  useEffect(() => {
    const fetch = async () => {
      let query = supabase.from("activity_logs").select("*").order("created_at", { ascending: false }).limit(50);
      if (jobId) {
        query = query.eq("job_id", jobId);
      } else if (companyId) {
        query = query.eq("company_id", companyId);
      }
      const { data, error } = await query;
      if (!error) setLogs(data || []);
      setLoading(false);
    };
    fetch();
  }, [jobId, companyId]);

  return { logs, loading };
};
