import { describe, it, expect, beforeEach } from "vitest";
import { IS_DEMO_MODE } from "@/lib/demo/isDemoMode";
import { demoSupabase } from "@/lib/demo/demoClient";
import { demoAuth } from "@/lib/demo/demoAuth";
import { DEMO_ROLES } from "@/lib/demo/fixtures";

describe("demo mode", () => {
  beforeEach(() => {
    demoAuth.signOut();
  });

  it("activates when Supabase credentials are missing", () => {
    // No VITE_SUPABASE_* env vars are set in the test environment.
    expect(IS_DEMO_MODE).toBe(true);
  });

  it("exposes all six required demo roles", () => {
    const values = DEMO_ROLES.map((r) => r.value);
    expect(values).toEqual([
      "owner",
      "project_manager",
      "estimator",
      "office_admin",
      "field_tech",
      "subcontractor",
    ]);
  });

  it("reads realistic demo jobs from the in-memory store", async () => {
    const { data, error } = await demoSupabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });
    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toHaveProperty("customer");
  });

  it("filters rows with eq() and returns a single row", async () => {
    const { data } = await demoSupabase
      .from("drying_logs")
      .select("*")
      .eq("job_id", "J-1042")
      .order("day", { ascending: true });
    expect(data.length).toBeGreaterThan(0);
    expect(data.every((r: { job_id: string }) => r.job_id === "J-1042")).toBe(true);
  });

  it("supports local inserts without touching a live database", async () => {
    const before = (await demoSupabase.from("payments").select("*")).data.length;
    const { error } = await demoSupabase
      .from("payments")
      .insert({ job_id: "J-1042", payment_type: "deposit", amount: 500 });
    expect(error).toBeNull();
    const after = (await demoSupabase.from("payments").select("*")).data.length;
    expect(after).toBe(before + 1);
  });

  it("signs in as a selected role and resolves that role's profile", async () => {
    demoAuth.signInAsRole("field_tech");
    const session = demoAuth.getSession();
    expect(session?.user.user_metadata.role).toBe("field_tech");

    const { data } = await demoSupabase
      .from("profiles")
      .select("*")
      .eq("id", session!.user.id)
      .single();
    expect(data.role).toBe("field_tech");
  });

  it("signs out and clears the demo session", () => {
    demoAuth.signInAsRole("owner");
    expect(demoAuth.getSession()).not.toBeNull();
    demoAuth.signOut();
    expect(demoAuth.getSession()).toBeNull();
  });
});
