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
}

export const useJobs = () => {
  const [jobs, setJobs] = useState<DbJob[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchJobs = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching jobs:", error);
    } else {
      setJobs(data || []);
    }
    setLoading(false);
  }, [user]);

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
      created_by: user.id,
    }).select().single();

    if (error) {
      toast({ title: "Error creating job", description: error.message, variant: "destructive" });
      return null;
    }
    toast({ title: "Job Created", description: `${jobId} – ${jobData.customer}` });
    await fetchJobs();
    return data;
  };

  const updateJob = async (id: string, updates: Partial<DbJob>) => {
    const { error } = await supabase.from("jobs").update(updates).eq("id", id);
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

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("created_at");
      if (!error) setMembers(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

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
