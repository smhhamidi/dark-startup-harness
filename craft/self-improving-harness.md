# The self-improving harness (portable core)

> Portable craft. Governs every project the harness is installed into. Project-specific instantiations live in that project's own craft folder.

## What a dark startup means here

A dark factory runs production without people on the floor; people set the goals and handle the edge. The equivalent for a business operation is: sensors read reality, policy decides, tools act, gates verify, and the loop encodes what it learned — so the next run needs less human input than the last. Humans stay at the edge: novel judgement, ethics, high-stakes approvals, and deciding what the business should want.

## Loop anatomy

| Layer | Question it answers | What "good" looks like |
|---|---|---|
| **Sensor** | What is actually true right now? | Measured signals, not assumptions: queue depth, error rate, unassigned volume, mismatch counts, owner corrections |
| **Policy** | What should happen next, and what needs a human? | Written thresholds; money writes, cross-tenant effects and production side effects stay human-gated. High-impact acts: [`second-order-thinking.md`](second-order-thinking.md) (1st → 2nd → validity boundary). |
| **Tool** | How does it get done durably? | An API, script or automation that can run again tomorrow — not a one-off manual fix |
| **Gate** | How do we know it worked? | Tests, evals, dry-runs, parity against the owner's records; fail closed when risk is high |
| **Learning** | What changes so this is cheaper next time? | A dated lesson, plus a check where one can block the family. A new rule only as a labelled agent inference, shown once to the principals ([`rulebook-governance.md`](rulebook-governance.md)) |
| **Feedback** | What does the next iteration see? | Results written back where the next run's sensors read them |

## Legibility

If it was not recorded, it did not happen to the intelligence. Durable memory (learnings, edge cases, craft, rule map) is the compounding asset; generated dashboards and one-off reports are disposable. Prefer regenerating a view from durable state over hand-maintaining the view.

## What stays human

- Approving money into a named account
- Production side effects without a sandbox
- Novel or ethical disputes
- Changing correctness tolerances

## Anti-patterns

- Bolting automation onto a manual workflow for a small speedup instead of redesigning the loop.
- Ending a turn with advice while the goal is still open.
- Reporting a failed gate as the outcome instead of continuing the repair loop.
- One-shot answers where a durable tool was the same amount of work.
- Asking the owner to run mechanics (commit, push, re-test) the agent can do unattended.
- Scheduling background timers (e.g. `schedule` tool) to poll or wait for local background shell commands / tests / subagents when the runtime already provides reactive wakeup upon completion.

## Quality gates (strict — default mode)

Before acting on a change that will be shown as done:

1. **Name Pass and Fail** — concrete acceptanceCriteria and rejectionCriteria (not "looks good").
2. **Name the evaluation** — which test, eval, dry-run, or live probe decides Pass/Fail.
3. **TDD is the default** for code/eval changes: write or update the failing check first, then the smallest fix, then keep green.
4. **Review / audit is part of the gate**, not optional garnish:
   - High-stakes owner output → Class B smarter review (or forced replan if unavailable).
   - Overrun / spin → independent check (`assertOverrunAudit`).
   - Smoke-only work may use `not_required_smoke` — never `missing`.
5. **Prove the effect, not the status** — URL up / HTTP 200 / `{ ok: true }` is not Pass.
6. Fail closed: a red evaluation is not a reportable done; revise and re-run the **same** check.

Gate: `assertStrictGatePlan` in `src/lib/failure-learning.ts` (`npm run eval:failure-learning`).

## Deterministic before model judgement

If the answer for a fixed input must be the same every time, it is a script, not a model call. Three commands cover the recurring cases here:

- `npm run ci:state` — one reading of the PR's checks (green / red / pending / no-checks / none), failing jobs named, `--gate` exiting 1 unless green. It reports and exits; waiting is a separate act, never a loop.
- `npm run evals:for` — the verification suites a change needs, derived from the changed paths. An unmatched path is reported and `--strict` exits 2, so the caller runs the full self-verify instead of guessing; a git failure exits 3 (an unknown change set is never "nothing changed"). `--run` executes the selection.
- `npm run check:discipline` / `npm run discipline:tick` — the session scorecard (round-trips, one-call share, timer polling, repeated verification) read by the daily watchdog.

What stays a model call: the diagnosis, the choice between routes, and the prose a principal reads.

## Verify budgets and stuck work

Classify every verify job before starting: **smoke** ≤ 3 min, **targeted** ≤ 8 min, **sweep** ≤ 25 min once. Speed beats efficiency.

In-budget work that still produces new evidence stays with the same agent. Overrun or spin (same approach twice with no new evidence) is not a reason to wait: stop the original loop and run an **independent check** — a short parallel auditor, or a local forced replan with a different method. Method: [`evidence-discipline.md`](evidence-discipline.md). Gate: `assertOverrunAudit`.

Separately, **high-stakes owner outputs** (strategy / money / Match? / canvas) need a smarter review before the owner sees them — not every chat line. Method: the high-stakes class B section of [`second-order-thinking.md`](second-order-thinking.md). Gate: `assertHighStakesReview`.

On failure (including self-admission or process challenge): run [`failure-stuck-loop-learning.md`](failure-stuck-loop-learning.md) the same turn — automatically. Before restarting the fix, **realign** acceptance/rejection/evaluation with the owner (or “run it”). Gates: `assertFailureLearningTurn`, `assertFailureAcceptanceRealign`.

**Before starting a substantive task:** search past lessons for this problem first (notes, never rules, never loaded by default); then one opening inventory of skills, tools, access, information, **and test data**; obtain gaps; seek current primary docs / best practices for external tools-APIs-plugins in scope (`bestPracticeSought`); then run to completion (no scattered mid-task asks). Gate: `assertPreTaskReadiness`. Craft: [`pre-task-readiness.md`](pre-task-readiness.md).

Assign models by **task weight** (mechanical → light, bounded implementation → medium, judgment/review → strongest). Gate: `assertModelWeight`. Craft: [`model-weight-routing.md`](model-weight-routing.md).

Product/strategy claims name Customer / Product / Business outcomes **and** value create + capture, with measured or parametric-break-even links. Gate: `assertOutcomeChain`. Craft: [`outcome-chain.md`](outcome-chain.md).

New skill or standing habit: run [`agent-skill-learning.md`](agent-skill-learning.md) — first principles, compound (trunk then leaves), primary sources, recursive deepen, smarter exam, tick only on Pass. After fail → learn → exam Pass, redo the original owner task (`assertPostLearningOwnerTaskRedo`). Gate: `assertSkillLearningComplete`.

High-impact decision before acting: run [`second-order-thinking.md`](second-order-thinking.md) — first-order effects, second-order knock-ons, validity boundary. Gate: `assertSecondOrderThinking`.

Before the owner reads a reply: the last check in the shared rulebook's reporting rules (project agent entry file). Unauthenticated public URLs: [`public-publish-needs-ask.md`](public-publish-needs-ask.md). Agent-opened browser tabs/windows/debug profiles: close when the job slice ends — [`close-agent-opened-browser-surfaces.md`](close-agent-opened-browser-surfaces.md). Multi-turn goals: [`parallel-sessions-announce.md`](parallel-sessions-announce.md). Every rule reaches every agent: [`one-floor-in-every-tool.md`](one-floor-in-every-tool.md).

## Installing the harness in a new project

1. Copy `harness/rules/*.mdc` into the project's rule folder and route each rule from the project's agent entry file (task type → doc to read first).
2. Add the project's own domain rules **on top**; never weaken a harness gate in a project rule.
3. Add a rule↔craft map and a gate that fails when a rule is unmapped or its copy drifts from the source.
