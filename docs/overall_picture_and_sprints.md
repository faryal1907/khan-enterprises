# Overall Picture & Sprints

Quick entry point for understanding Khan Enterprises and where development stands.

---

## Start here

**New to the repo?** Read the full walkthrough with analogies:

**[Khan Enterprises — Full Project Explained](./khan_enterprises_full_project_explained.md)**

That guide covers the monorepo layout, request flow, database design (serialized bikes vs. parts), intended business workflow, local dev startup, and what is built vs. planned.

---

## Documentation map

| Document | When to use it |
|----------|----------------|
| [khan_enterprises_full_project_explained.md](./khan_enterprises_full_project_explained.md) | Big-picture architecture and mental models |
| [sprint1_finalized.md](./sprint1_finalized.md) | API routes, env vars, Docker, seed, startup sequence |
| [setup_guide_and_troubleshooting_tips.md](./setup_guide_and_troubleshooting_tips.md) | First-time setup and common errors |
| [prisma_v7_upgrade_guide.md](./prisma_v7_upgrade_guide.md) | Prisma v7 client and config details |
| [README](../README.md) | Long-form spec: modules, RBAC, state machines, roadmap |

---

## Sprint snapshot

| Sprint | Focus | Status |
|--------|--------|--------|
| **Sprint 1** | Monorepo, Docker Postgres, Prisma schema (15 models), seed, read-only API (auth check, inventory, branches), Next.js scaffolds | **Done** — see [sprint1_finalized.md](./sprint1_finalized.md) |
| **Sprint 2** | JWT login/logout/refresh, RBAC guards, Postman auth tests | **Done** — see [sprint2.md](./sprint2.md) §9 |
| **Later phases** | Orders, payments (Safepay, JazzCash, Raast), delivery, PDF invoices, ERP dashboards, audit exports | Schema ready; API/UI not built |

---

## Campus at a glance

```
Customer (web :3000)  ──┐
                        ├──►  NestJS API (:4000)  ──►  PostgreSQL (:5435)
Staff (admin :3001)   ──┘         ▲
                                  │
                         packages/prisma (schema + client)
```

- **Showroom** (`apps/web`) — customer-facing; UI not built yet.
- **Back office** (`apps/admin`) — ERP dashboard; UI not built yet.
- **Operations desk** (`apps/api`) — partial REST API today.
- **Filing room** — database + migrations + seed.

---

## What to run locally

```bash
npm run db:up
npm run prisma:generate
npm run db:seed
npm run dev
```

Details and troubleshooting: [sprint1_finalized.md](./sprint1_finalized.md) and [setup_guide_and_troubleshooting_tips.md](./setup_guide_and_troubleshooting_tips.md).
