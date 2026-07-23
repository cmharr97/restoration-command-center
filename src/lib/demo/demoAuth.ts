// ── DEMO AUTH ──
// A tiny local auth layer for Demo Mode. It manages a fake "session" entirely in
// the browser (kept in memory + persisted to localStorage) and notifies
// subscribers on sign-in / sign-out — mirroring the small slice of the Supabase
// auth API that the app relies on. This layer itself makes no network calls.

import { demoRoleByValue } from "./fixtures";

export interface DemoUser {
  id: string;
  email: string;
  user_metadata: { name: string; role: string };
}

export interface DemoSession {
  user: DemoUser;
  access_token: string;
}

type Listener = (event: "SIGNED_IN" | "SIGNED_OUT", session: DemoSession | null) => void;

const STORAGE_KEY = "recon-demo-session";
const listeners = new Set<Listener>();
let session: DemoSession | null = load();

function load(): DemoSession | null {
  try {
    const raw = typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    return raw ? (JSON.parse(raw) as DemoSession) : null;
  } catch {
    return null;
  }
}

function persist() {
  try {
    if (typeof localStorage === "undefined") return;
    if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore storage errors in demo mode */
  }
}

function notify(event: "SIGNED_IN" | "SIGNED_OUT") {
  listeners.forEach((l) => l(event, session));
}

export const demoAuth = {
  getSession(): DemoSession | null {
    return session;
  },

  getUser(): DemoUser | null {
    return session?.user ?? null;
  },

  /** Sign in as one of the predefined demo roles (used by the demo sign-in screen). */
  signInAsRole(roleValue: string): DemoSession {
    const role = demoRoleByValue(roleValue);
    const name = role.label.split(" / ")[0];
    session = {
      access_token: `demo-token-${role.userId}`,
      user: {
        id: role.userId,
        email: `${role.value}@demo-restoration.com`,
        user_metadata: { name, role: role.value },
      },
    };
    persist();
    notify("SIGNED_IN");
    return session;
  },

  signOut() {
    session = null;
    persist();
    notify("SIGNED_OUT");
  },

  onChange(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
