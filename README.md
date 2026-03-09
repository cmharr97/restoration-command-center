# ReCon Pro

**Restoration & Reconstruction Operations Platform**

ReCon Pro is an internal operations platform built for restoration companies. It provides a centralized command center to manage the full lifecycle of restoration and reconstruction jobs — from initial lead through final invoice and close.

## Core Capabilities

- **Job Management** — Create, track, and manage restoration jobs through a 12-stage lifecycle (Lead → Closed)
- **Insurance Tracking** — Manual internal tracking of carrier claims, adjuster communications, and supplement progress
- **Drying Logs** — Record moisture readings, GPP, temperature, and equipment placement for water damage jobs
- **Supplement Management** — Compare contractor vs. carrier estimates, track approvals and denied items
- **Payment Tracking** — Track insurance payments, deductibles, mortgage holds, and homeowner balances
- **Subcontractor Management** — Maintain a trade partner directory, assign subcontractors to jobs, and track completion
- **Customer CRM** — Store customer records linked to jobs with contact info, notes, and source tracking
- **Lead Pipeline** — Manage incoming leads with stage tracking and conversion to jobs
- **Homeowner Portal** — Provide homeowners with job progress visibility, photos, and direct messaging
- **Role-Based Access** — Granular permissions for Owner, Project Manager, Estimator, Office Admin, Field Tech, and Subcontractor roles
- **Real-Time Communication** — Job-specific messaging channels for Internal Team, Homeowner, and Subcontractor communication

## Technology Stack

- React + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Supabase (database, auth, real-time, storage, edge functions)

## Getting Started

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Environment Variables

The following environment variables are required:

- `VITE_SUPABASE_URL` — Backend URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` — Public API key

## License

Proprietary — All rights reserved.
