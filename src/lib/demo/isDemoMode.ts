// ── DEMO PREVIEW MODE DETECTION ──
// Demo Mode activates automatically when the live Supabase credentials are
// missing. When both VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are
// present, the app uses real authentication and live data (production behavior
// is unchanged). This lets the app be previewed in GitHub Codespaces without a
// Supabase account and without any required secrets.

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

const isBlank = (v: string | undefined) => !v || v.trim() === "";

/** True when Supabase credentials are missing → run the safe local Demo Mode. */
export const IS_DEMO_MODE = isBlank(url) || isBlank(key);
