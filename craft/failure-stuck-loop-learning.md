# Failure and stuck-loop learning

> Portable craft. Specialisation of the harness learning layer: owner disputes plus **learn the class**, not the ticket. **Self-improve automatically** on failure — do not wait for the owner to order a harness fix.

## Triggers (start learning in the same turn — automatic)

- Task failure / acceptance not met
- Stuck in a loop: same approach twice with no new evidence, retry ping-pong, a silent multi-minute stall
- Optional post-success work hangs the session
- Owner must repeat an instruction
- **Owner disputes a reported result** ("that is not what I see", names a different number)
- **Owner voids prior guidance** ("forget what I said", "update your memory")
- **Owner challenges process compliance** ("why did you narrow the goal?", "did you follow the harness?", "did you learn from the failure?", "URL is not a gate")
- **Independent review FAIL** on an owner-facing brief, canvas, Match?, or money claim (Class B / auditor)
- **Agent self-admission** — the agent states in chat that it skipped a harness step, mis-classified work, or delivered an unreliable answer

An owner dispute, process challenge, void, or agent self-admission is **acceptance failure**, not clarification chat. Treat the owner's stated observation (and the agent's own admission) as a sensor.

**Forbidden:** waiting until the owner says "fix the harness" / "update your rules" before starting this protocol. If the trigger fired, the protocol is already mandatory.

## Mechanism (order)

1. **Break the bad loop** — stop repeating the action, including stopping any re-defence of the prior report.
2. **Diagnose with evidence** — name the authoritative sensor versus the internal one you nearly mixed in.
3. **Realign acceptance (same page)** — before restarting the repair: restate **acceptance**, **rejection**, and the **evaluation** that decides Pass/Fail. Get a short owner confirm, or treat an explicit “run it” / “decide yourself” / chosen A/B/C as confirm of that plan. **Do not** dive into TDD/repair against an unspoken criterion after a failure.
4. **Write a durable lesson** — a dated entry in the project's learnings; chat memory alone is invalid. VOID superseded entries explicitly.
5. **Fix the class** — the smallest script or check that makes this *family* of mistakes impossible, where one can. Not one column, one customer, one string. Prefer **TDD**: failing eval/gate first, then the fix. A new *rule* drawn from the failure is an **agent inference** (owner ruling 2026-10-04, review 2026-10-05): labelled with the incident and date, shown once to the principals, kept small; prefer a check or a routing line over another rule ([`rulebook-governance.md`](rulebook-governance.md)).
   Name **which** of these four (or a finding) it was: lock missing / lock did not fire / lock was prose and was skipped / lock itself was the wrong over-correction / **finding** (new evidence, not a defect — update the belief, do not lock a world-conclusion).
6. **Re-evaluate** the agreed acceptance criteria under the new playbook, including the owner's own check — **and resume the owner job that was paused**. A harness commit that eats the original goal is itself a miss (`resumedAbandonedWork`).
7. **Escalate last** — one plain ask after real autonomous attempts. When two legitimate product truths disagree, present A/B/C with a recommendation. Never escalate a measurable fact the agent could read for itself.

**Validity:** First-pass work still names Pass/Fail before acting (strict gate plan) without a pause. The realign pause is for **restart after failure / dispute / stuck-loop repair** — not every smoke task.

## Learn the class (mandatory)

| Question | Bad (instance-only) | Good (class) |
|---|---|---|
| What broke? | "One wrong column on one customer's report" | "Owner-facing tables mixed internal state with the owner's records" |
| What prevents recurrence? | "Do not show that column" | "Forbid every internal/mirror/debug field on owner reports, asserted mechanically" |
| Memory | Leave the contradictory tip live | VOID and supersede the same turn |

A lesson without a check is fine when no check can block the family; a new rule is the last resort, never the default (the rulebook stays small).

## Scale the response to the incident

The five-way diagnosis in mechanism step 5 classifies the **cause**; this table scales the **response**. Every row still appends the durable lesson — what scales is the ceremony:

| Incident | Response |
|---|---|
| **Finding** (new evidence, not a defect) | Update the belief; no lock, no realign round-trip |
| **Isolated execution error**, acceptance unchanged | Correct and verify under the existing authorization — no confirmation round-trip (a repair with clear acceptance reuses it, task-continuity contract) |
| **Recurring mechanism** — same class observed again | Targeted safeguard: the smallest check that blocks the family, and one rung up, because the first response did not hold |
| **High-consequence systemic failure** | This whole protocol, realign-confirm included |

Recurrence is an **observed** event — the same class seen again — and it drives escalation. Never estimate how many recurrences were prevented: a prevention count is a counterfactual nobody can observe, and a measurement needing such contortions is itself the defect ([`evidence-discipline.md`](evidence-discipline.md)).

## Same-turn checklist (every trigger above)

1. Acknowledge that the prior report, process, or guidance failed the human check (or the agent's self-check).
2. **Realign** — restate acceptance + rejection + evaluation; confirm with the owner (or “run it” / “decide yourself” / chosen option) before repair continues.
3. Append the durable learning (VOID obsolete rules when the owner resets memory).
4. Fix the class with a check where one can block it (TDD when code/eval changes); any new rule is a labelled agent inference.
5. Re-measure and re-issue under the new schema only — no obsolete fields "for context".

Delegating to a subagent does **not** waive this checklist.

Gates: `assertFailureLearningTurn`, `assertFailureAcceptanceRealign`, and `assertIndependentReviewClose` in `src/lib/failure-learning.ts` (`npm run eval:failure-learning`).

## Anti-patterns (forbidden)

- Re-asserting success as the primary reply after the owner names a different number.
- Encoding a "lesson" that only blames the owner's view instead of treating human-visible ground truth as a failed sensor.
- Closing without a learnings append plus a re-measure or a product choice.
- Treating agent-created artifacts as co-equal owner truth without owner confirmation.
- Keeping prior guidance after the owner says forget or void.
- Shipping an instance patch and calling the learning loop done.
- Closing an owner job after failure-learning or exam Pass **without re-executing that job** (the failed canvas/report patch is not a redo).
- Patching only the owner-facing canvas/report after an independent review FAIL, without a dated learnings append and a class gate (`assertIndependentReviewClose`).
- Explaining a harness miss in prose **without** running this protocol the same turn.
- Waiting for the owner to order "fix the harness" after a self-admission or process challenge.
- Restarting a repair loop after failure **without** restating and confirming acceptance/rejection/evaluation (silent criterion drift).
- **Secret-scrape stuck loops:** OCR, desktop UI click-paths, notification-DB digs, or multitask forks to extract one-shot secrets (app login codes, cloud 2FA passwords, OTP, 3DS). After the waiter is primed, **ask once**, keep it warm, submit immediately. Two scrapes with no new evidence = already stuck — stop and ask.

## Stuck-loop specifics

- Two identical failed attempts with no new evidence is the threshold, not five.
- A job past its verify budget triggers an audit: progress or repetition? scope matched to purpose? faster route?
- **Independent check on trigger:** the looping agent must not be the only auditor. Stop the original loop and run a short parallel independent auditor (three questions + named faster route), or a local forced replan with a different method if a subagent is unavailable or already returned empty twice. Same-agent self-talk is not an audit.
- An empty or zero-output subagent twice is a coordination failure — change the prompt or do it locally.
