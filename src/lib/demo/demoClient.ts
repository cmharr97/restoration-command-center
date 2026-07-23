// ── DEMO SUPABASE CLIENT ──
// A drop-in stand-in for the Supabase JS client used ONLY in Demo Mode. It
// implements the small subset of the Supabase API surface the app uses
// (`from().select()/insert()/update()/delete()` query builder, `auth`,
// `storage`, and realtime `channel`) against an in-memory fixture store.
//
// IMPORTANT: This client never opens a network connection and never writes to a
// live Supabase project. All "writes" mutate the local in-memory store only, so
// Demo Mode is safe to explore freely and can never corrupt real data.

import { createDemoStore } from "./fixtures";
import { demoAuth } from "./demoAuth";

type Row = Record<string, any>;
type Result<T = any> = { data: T; error: null };

const store = createDemoStore();

const nextId = (table: string) =>
  `${table.slice(0, 3)}-demo-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e4)}`;

// Parse a Supabase `.or("a.ilike.%q%,b.eq.x")` filter string.
const matchesOr = (row: Row, orExpr: string): boolean =>
  orExpr.split(",").some((clause) => {
    const [col, op, ...rest] = clause.split(".");
    const raw = rest.join(".");
    const val = String(row[col] ?? "").toLowerCase();
    if (op === "ilike" || op === "like") {
      return val.includes(raw.replace(/%/g, "").toLowerCase());
    }
    if (op === "eq") return String(row[col] ?? "") === raw;
    return false;
  });

interface Filter {
  col: string;
  val: any;
}

class DemoQueryBuilder<T = any> implements PromiseLike<Result<T>> {
  private op: "select" | "insert" | "update" | "delete" = "select";
  private payload: any = null;
  private filters: Filter[] = [];
  private orExpr: string | null = null;
  private orderCol: string | null = null;
  private orderAsc = true;
  private limitN: number | null = null;
  private wantSingle = false;
  private returning = false;

  constructor(private table: string) {}

  private get rows(): Row[] {
    if (!store[this.table]) store[this.table] = [];
    return store[this.table];
  }

  select(_columns?: string): this {
    if (this.op === "select") this.op = "select";
    // For insert/update, chaining .select() means "return the affected rows".
    if (this.op === "insert" || this.op === "update") this.returning = true;
    return this;
  }

  insert(values: Row | Row[]): this {
    this.op = "insert";
    this.payload = values;
    return this;
  }

  update(values: Row): this {
    this.op = "update";
    this.payload = values;
    return this;
  }

  delete(): this {
    this.op = "delete";
    return this;
  }

  eq(col: string, val: any): this {
    this.filters.push({ col, val });
    return this;
  }

  or(expr: string): this {
    this.orExpr = expr;
    return this;
  }

  order(col: string, opts?: { ascending?: boolean }): this {
    this.orderCol = col;
    this.orderAsc = opts?.ascending !== false;
    return this;
  }

  limit(n: number): this {
    this.limitN = n;
    return this;
  }

  single(): this {
    this.wantSingle = true;
    return this;
  }

  maybeSingle(): this {
    this.wantSingle = true;
    return this;
  }

  private applyFilters(rows: Row[]): Row[] {
    let out = rows.filter((r) => this.filters.every((f) => r[f.col] === f.val));
    if (this.orExpr) out = out.filter((r) => matchesOr(r, this.orExpr as string));
    return out;
  }

  private resolve(): Result<T> {
    const now = new Date().toISOString();

    if (this.op === "insert") {
      const incoming = Array.isArray(this.payload) ? this.payload : [this.payload];
      const inserted = incoming.map((v) => {
        const row: Row = { created_at: now, updated_at: now, ...v };
        if (row.id == null) row.id = nextId(this.table);
        this.rows.push(row);
        return row;
      });
      const data = this.returning ? (this.wantSingle ? inserted[0] ?? null : inserted) : null;
      return { data: data as T, error: null };
    }

    if (this.op === "update") {
      const targets = this.applyFilters(this.rows);
      targets.forEach((r) => Object.assign(r, this.payload, { updated_at: now }));
      const data = this.returning ? (this.wantSingle ? targets[0] ?? null : targets) : null;
      return { data: data as T, error: null };
    }

    if (this.op === "delete") {
      const targets = new Set(this.applyFilters(this.rows));
      store[this.table] = this.rows.filter((r) => !targets.has(r));
      return { data: null as T, error: null };
    }

    // select
    let out = this.applyFilters(this.rows).map((r) => ({ ...r }));
    if (this.orderCol) {
      const col = this.orderCol;
      out.sort((a, b) => {
        const av = a[col];
        const bv = b[col];
        if (av === bv) return 0;
        if (av == null) return 1;
        if (bv == null) return -1;
        return (av < bv ? -1 : 1) * (this.orderAsc ? 1 : -1);
      });
    }
    if (this.limitN != null) out = out.slice(0, this.limitN);
    if (this.wantSingle) return { data: (out[0] ?? null) as T, error: null };
    return { data: out as T, error: null };
  }

  then<TResult1 = Result<T>, TResult2 = never>(
    onfulfilled?: ((value: Result<T>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): PromiseLike<TResult1 | TResult2> {
    return Promise.resolve(this.resolve()).then(onfulfilled, onrejected);
  }
}

// ── AUTH SHIM ──
const auth = {
  onAuthStateChange(callback: (event: string, session: any) => void) {
    const unsubscribe = demoAuth.onChange((event, session) => callback(event, session));
    // Emit the current session asynchronously, like supabase-js does.
    Promise.resolve().then(() => callback("INITIAL_SESSION", demoAuth.getSession()));
    return { data: { subscription: { unsubscribe } } };
  },
  async getSession() {
    return { data: { session: demoAuth.getSession() }, error: null };
  },
  async getUser() {
    return { data: { user: demoAuth.getUser() }, error: null };
  },
  async signInWithPassword({ email }: { email: string; password: string }) {
    // In demo mode any credentials are accepted; default to the owner role.
    demoAuth.signInAsRole("owner");
    void email;
    return { data: { session: demoAuth.getSession() }, error: null };
  },
  async signUp({ options }: { email: string; password: string; options?: { data?: { role?: string } } }) {
    demoAuth.signInAsRole(options?.data?.role || "owner");
    return { data: { session: demoAuth.getSession() }, error: null };
  },
  async signOut() {
    demoAuth.signOut();
    return { error: null };
  },
};

// ── STORAGE SHIM (photos etc.) ──
const storage = {
  from() {
    return {
      async upload() {
        return { data: { path: `demo/${nextId("file")}` }, error: null };
      },
      getPublicUrl(path: string) {
        return { data: { publicUrl: path } };
      },
    };
  },
};

// ── REALTIME SHIM (no-op) ──
const makeChannel = () => {
  const channel: any = {
    on() {
      return channel;
    },
    subscribe() {
      return channel;
    },
  };
  return channel;
};

export const demoSupabase: any = {
  from: (table: string) => new DemoQueryBuilder(table),
  auth,
  storage,
  channel: () => makeChannel(),
  removeChannel: () => {},
};
