---
name: reproduce-and-isolate
description: >-
  Make a symptom happen on command, then search for its cause instead of staring
  at it. Use when a failure is intermittent, "works on my machine", hits only
  some users, or cannot be reproduced; and when the question is which change,
  field, flag, document or hop causes it. Triggers: can't reproduce, flaky,
  sometimes, only in production, one user in twenty, narrow it down, bisect,
  which deploy broke this, «بازتولید», «گاهی», «برای من کار می‌کند». Returns a
  reproduction recipe, a minimal failing case, the isolated cause and the
  on/off evidence. Not the first move when a purpose-built explain or trace
  tool exists for the symptom, not a substitute for proving the layer first, and
  not the tool for building a reproduction from nothing — the user-scope
  diagnosing-bugs skill builds the feedback loop; search here once a loop exists.
---

# Reproduce it, then halve it

> **Source:** the root playbook credited in [CREDITS.md](../../CREDITS.md), MIT licence, imported 2026-10-07 by the principal's pick under the outside-playbook rule. This copy is the workspace canonical with the company-local sections and this provenance scrubbed for public travel; re-derive it on upstream re-import (the weekly outside-playbook check). The body is otherwise the imported original.

Two ways debugging goes wrong: you experiment against a failure you cannot summon on demand, so
every result is noise; or you *stare* at a system instead of *searching* it. This skill is the
search procedure only.

**It sits under two things, not over them.** Prove the layer first: write down the layers a request
crosses in your system (client, CDN, gateway, each service, the data store, the pipelines that feed
it, and analytics as a layer of its own) and name the sub-module, not just the layer — a worked layer-map template is at the top of
`references/debugging-method.md`. And if your
system has a purpose-built explain or trace tool for the symptom (a query explainer, a request
tracer), run it before anything here — but know its scope: it may model only the default path, and
its endpoint may lag the live service, so cross-check before a definitive claim.

## 0. Write the contrast pair, or a positive control

Two lines before any tool:

- **FAILING**: the exact case that misbehaves.
- **PASSING**: the nearest case that behaves — older version, another user or record, another
  region, the same request logged in, yesterday.

A contrast pair is what step 3 halves, so look for one. When there is none — a total outage, a
route broken for everyone, a feature that never worked — do not stall: substitute a **positive
control**, a deliberately high-yield case that proves your instrument works (a zero from a
misspelled field name is indistinguishable from a real zero until a deliberately fat query
returns rows).

## 1. Make it fail on demand

A reproduction is a command with **every axis pinned**, not a description. Inherit nothing.

Axes that commonly change the answer — build your own table for your system and keep it with
the system's notes:

| Axis | Why it flips the result |
|---|---|
| `Host` header / hostname | behind a shared ingress or gateway it can pick a different backend, and both may return 200 |
| referrer / entry parameter | an entry parameter (e.g. `ref=`) can route the same request down a different path |
| entry shape | a path-based filter with an empty query looks nothing like a text query; filtering logs on the text parameter hides it entirely |
| auth / role | a logged-out view never proves absence |
| locale / region parameters | two similarly named parameters (e.g. `region` vs `display_region`) can carry different values |
| text form | Unicode variants: zero-width joiners, look-alike letters, joined vs split words |
| running build | read what the orchestrator actually runs, not the config file — declared tags in GitOps values are often stale |
| flag / cache state | a feature-flag cache may be per region or per worker; warm all of them before concluding a flag is off |

Do **not** pin "document freshness" on a business timestamp synced from the source system; it is
not the store's write time. Use the store's own version counter or fields that change on every
write, and dissect source → transform → freshness separately.

**How many runs?** More than one, and always with a **negative control** — a case your hypothesis
says should stay healthy. If the control fails too, the verdict is inconclusive and you are
looking at background noise, not your bug (a clean-looking sweep of a dozen queries can really be a
platform-wide infrastructure restart). A hit rate is a rate: report it as
successes over attempts in a stated window, never as a single point.

**If it fires one time in N**, do not "try again":

1. **Find the hidden axis** that splits the N — the table above is the suspect list; add cache
   state, which DC answered, and concurrency.
2. **Record instead of retry.** Capture the failing run's inputs once and replay them offline;
   that is the general answer to non-determinism (rr/Pernosco). Service-level equivalents: a debug
   flag that echoes the downstream request and response, the downstream request URL in the
   service's own logs, and replaying the captured request from inside the cluster.

When capture is impractical on this stack, raise the reproduction rate instead — loop the
trigger, parallelise, stress, narrow timing windows (diagnosing-bugs Phase 1) — and capture
the inputs the moment you catch a failure.

Never conclude from a non-deterministic test: both algorithms below lie confidently on a flaky
oracle.

**Harvest before the window closes.** Measure your log retention: a size-capped index may hold
only minutes to hours, and ingestion can have multi-day gaps, so a before/after comparison on it can
be comparing two holes. Check the gap before claiming a delta, and know the direct route to live
logs (the container or node itself) for when the index has already rolled over.

## 2. Build the oracle before you search

One command. Exit 0 = healthy, non-zero = this bug. Seconds, not minutes, because everything below
consumes it. This *is* the work.

- It must fail for the **right reason** — assert the specific symptom, not "an error occurred". A
  loose oracle makes a reducer converge on a different bug entirely.
- It must reject **invalid** input explicitly. Regehr's validity problem: a reducer free to emit
  input the system never accepts will walk off into nonsense and report it.
- **Prove the oracle red before you trust it green.** Break the thing it watches on purpose and
  confirm it fails; a gate that stays green under mutation was never testing your code.
- If two oracles claim to check the same promise, confirm they read the same field set — a
  mismatch there can produce a whole night of research on a regression that does not exist.

## 3. Shrink the input (delta debugging / ddmin)

Cut the input in half; if a half still fails, recurse on it. If neither half fails, split into *n*
chunks and test each **complement** (input minus one chunk); **when a complement fails, continue
with that complement and drop the granularity back to `max(n-1, 2)`**. When no complement fails,
double *n*, up to single elements. It terminates when `n` reaches the element count, leaving a
**1-minimal** case: removing any one element makes it pass. Best case is binary-search fast, worst
case quadratic — still finite, still cheaper than reading code.

Reduce over whatever the input really is: query tokens, filter parameters, request-body fields,
one record's fields, config keys, the enabled flag set, the candidate document set, CSV rows.

Two refinements that matter more than the algorithm:

- **Reduce the difference, not the input.** With a failing and a passing case, halve the *delta*
  between them. That names a cause; shrinking the failing case alone yields a smaller symptom.
- **Delete structure, not bytes.** Cutting characters out of JSON, a query or non-Latin text
  produces invalid input, which the oracle must reject. Delete whole nodes, tokens, keys, records.

## 4. Bisect over change

```bash
git bisect start --term-old works --term-new broken
git bisect broken HEAD
git bisect works <last-known-good-rev>
git bisect run ./oracle.sh
git bisect reset
```

Endpoints must be marked or `run` has nothing to bisect. Script exit codes: **0** = old/works,
**1–127 except 125** = new/broken, **125** = this revision cannot be tested, skip it (`make ||
exit 125`), **≥128** = abort the whole run.

The axis need not be commits. Bisect over deployed image tags (from your deploy history),
config values, the flag set, which documents are affected, or time windows in logs.

**Ask what changed today before bisecting a code range.** A deploy, a flag flip, a data or
dictionary update, a CDN or load-balancer setting, a reindex — the change may not be in the repo at
all, and bisecting the wrong axis is an expensive way to find nothing.

## 5. Bisect over the path

When the input is minimal and the request crosses many hops, halve the *path* and replay the same
input at the midpoint. Use the layer list you wrote down at the start rather than an ad-hoc chain —
keep each service, per-tenant or per-index configuration and the data pipelines distinct, and
include **analytics as a layer of its own**, because a "regression" can be manufactured entirely
there. Then name the sub-module inside the layer.

For "slow" rather than "wrong", walk resources with **USE**: per resource, check Utilization,
Saturation (queued work) and Errors. Gregg puts it at roughly 80% of server issues for 5% of the
effort, with latency-based methods needed to approach the rest — so a clean USE pass is not
evidence of health.

## 6. One variable per experiment, and keep the trail

Change one thing, predict the result **before** running it, record what happened. Two changes plus
a passing result teaches nothing. Half the value of the written trail is catching that you ran the
wrong command, not that you held the wrong hypothesis.

## 7. A diagnosis, not a disappearance

Write the chain: **defect** (the wrong line, value or config) → **the state it corrupts** → **the
observed failure**. A diagnosis must show both *how* the defect produces this exact failure and
*why* that code is wrong. "It stopped happening" is not a diagnosis.

Then turn the cause off and on — but the on/off result is evidence only after three checks that
are routinely skipped:

1. **The clock.** Did the failure stop *after* the change took effect? If a spike ended at 09:05
   and the rollback came up at 09:30, the causal story is temporally impossible.
2. **The background rate.** Was anything else moving in that window — a platform restart, a
   deploy, a traffic shift?
3. **The boundary.** Do the cases that *should* be unaffected stay healthy? If the hypothesis
   cannot separate the failing set from the healthy set, it is not the cause.

Then ask whether the fix closes the class rather than the case, preferring a guard that makes
the class impossible by construction.

## What to report

1. The contrast pair, or the positive control that stood in for it.
2. The reproduction command with every axis pinned, and its hit rate as successes/attempts.
3. The minimal failing case.
4. The isolated cause — commit, image tag, flag, field, document or hop — and how it was isolated.
5. The cause-effect chain, and the on/off evidence with its clock and boundary checks.
6. What is still unknown, with the radius searched.

## Traps

- A flaky oracle: ddmin and bisect both return a confident wrong answer.
- An oracle that matches any failure: the reducer finds a different bug than yours.
- An oracle never proven red: green means nothing.
- Repo HEAD ≠ the running tag, and the declared config tag ≠ the running tag either.
- A reduced case that is invalid input: "fixed" for a reason that was never the reason.
- Deleting the field that *carries* the symptom instead of the one that *causes* it — which is why
  step 3 reduces the difference.
- Bisecting code when the change was a deploy, a flag or the data.
- Reading an improvement after rollback as proof, without the clock.

Sources for every method above: `references/sources.md`.
