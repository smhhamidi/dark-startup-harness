# Debugging method (universal)

> **Source:** the root playbook credited in [CREDITS.md](../../../CREDITS.md), MIT licence, imported 2026-10-07 by the principal's pick under the outside-playbook rule. This copy is the workspace canonical with the company-local sections and this provenance scrubbed for public travel; re-derive it on upstream re-import (the weekly outside-playbook check). The body is otherwise the imported original.

> **Layer map template** — write the map for the system in hand before any RCA; analytics is a layer of its own:
> - **Frontend path:** browser → edge/CDN → app server / BFF → API — note where deploy state can differ from repo HEAD
> - **Data path:** client → API gateway → cache → primary store → derived/read stores (each hop can hold a stale copy)
> - **Background pipelines:** schedulers → sync jobs → the stores they write (their lag is a layer of its own)
> - **Probes/alerting:** cron → read-only probes of every pillar → operator alerts (a probe's own failure can mimic an outage)
> - **Analytics (its own layer):** dashboards, status pages, read replicas — a "regression" can be manufactured entirely here

## Prove the layer before fixing

- No fix proposal before the failing **layer** is definitively identified. Write your
  org's layer map (client → edge → services → engine → data → source → analytics) and
  keep its numbering canonical.
- Separate layers with controlled experiments: old/new body × old/new index, route A vs
  B, time curve vs deploy timestamp.
- The measurement/analytics layer is itself a layer that can *be* the problem.
- Build one call that returns layer evidence live (route, filters, per-item scoring,
  real position) instead of hand-reproducing the pipeline.
- Design-shaped questions ("change the source?") smuggle in the assumption that the
  layer is known — test the assumption before answering in its frame.
- Root cause can be the *absence* of a whole layer/module — "is this happening because
  X doesn't exist?" Then the fix is building the layer, not patching the neighbor.

## Evidence quality

- Derived/cached fields fail on three independent axes — source / transform / freshness;
  fastest separator: force-refresh one record end-to-end; "surface A shows X, surface B
  shows Y" defaults to snapshot staleness, not different sources.
- Environmental assumptions are proven like bugs: coverage (% of traffic), policy unit
  (time vs volume), layer boundary, reachability (actually closed vs untried).
- "Odd old behavior" is an assumption — read the exception history before loosening any
  gate; it may be a previous disaster's fix.
- User-reachability questions are answered only via the user's actual path; key-based
  joins are proxies. Every identity matcher needs both controls, run in the same run:
  negative (fake identity ≈ 0 hits) and positive (known-present population ≈ 100%).
- A single sweep is not a controlled removal: check background error rate in the window,
  read error *bodies* not status codes, verify causal ordering with timestamps, ≥2 runs
  plus a should-stay-healthy negative control — else the verdict is INCONCLUSIVE.
- Smaller ≠ wrong: no number is bug evidence without a reference number; ground truth is
  usually cheap one layer lower; don't name a suspect before proving a crime exists.
- An absence claim needs a completeness proof: for probe competence, a positive control
  (a deliberately high-yield probe in the same window); for view completeness, the full
  counted set — never a head/limit/pagination sample, which invents absence. A guard's
  silence may just mean it sees no data.
- Form vs function: is the behavior wrong, or the presentation/measurement of it?
- Differential exploration: one probe never judges — vary one parameter at a time and
  read the delta.
- Prove the **live** code path (route → controller → sink), not the familiar file name.
- Agent-reported success ≠ final effect: multi-stage chains report hand-offs; check
  which stages a status covers and run one case with an upstream failure — if the status
  stays green, it is not an oracle.

## Incident handling

- Enumerate every realistic path that could produce the symptom, then rank: timeline
  from the change boundary, probability, evidence, recoverability, how to prove/disprove.
  Mark impossible paths with reasons; label everything unproven; lazy defaults ("user
  error") are not hypotheses. The deliverable is a ranked list, not a fix.
- In a fix-check-record loop the ranked list is the diagnosis step, never a stopping point; the fix follows the list in the same turn unless a genuine fork reaches the owner.

## Where the fix belongs

- Before any fix: in a correctly designed system, which layer owns preventing this
  class? The fix belongs there even if another layer is faster to patch.
- No over-customization: a rushed exception/tier for one symptom is an anti-pattern; if
  the layer wasn't proven guilty, touch nothing — "did nothing" is a valid RCA outcome.

## Fixes must be general

- Every RCA output has three parts: the point fix; the generality proof (how it holds
  for the whole class) + validity boundary; and one general/outside-the-box step even if
  out of scope.
- Do no harm: the fix must preserve every previously solved problem (closed findings are
  a regression contract — check siblings and say why they can't be hurt).
- Durability: survives data change, growth, deploys; non-durable signs = hand-maintained
  lists, thresholds tuned to today's distribution, per-case exceptions, TTL-less caches.
  If forced to pick, state the trade-off — never deliver non-durable as durable.
- The right design usually resolves hundreds of same-class problems at once; if the fix
  only catches this case, the angle is wrong.
- Structural guard over written guard: make violation impossible by construction — test:
  "could someone who never read the rule violate it?" But prove structural guards per
  axis; a mechanism can be safe on one axis and fragile on another.
