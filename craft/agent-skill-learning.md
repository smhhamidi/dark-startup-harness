# Agent skill learning

> Portable craft. How an agent acquires a **new skill or domain competency** (or encodes a **new standing habit**) so “learned” means exam Pass — not a name-drop.

Specialisation of the harness learning layer. Failure learning hardens mistakes; this craft hardens **how competence is earned**.

## When it applies

Run this protocol when any of:

- The agent must acquire or claim a **new skill** or **domain competency**
- The agent encodes a **new standing habit** into craft / always-on rules **as a planned curriculum** (new portable or project habit the agent intends to claim as learned)
- The agent would otherwise say “I learned X” / “I now know Y” without an exam

**Does not apply** to: trivial typo fixes in learnings; routine failure-learning appends that harden a class (those use [`failure-stuck-loop-learning.md`](failure-stuck-loop-learning.md) — class gate required, skill-exam not required unless the agent also claims a new competency); Class B review of owner money/strategy outputs (the high-stakes class B section of [`second-order-thinking.md`](second-order-thinking.md)).

**Precedence:** If a failure produces a *novel* standing habit the agent will claim as learned competency, run **both** failure-learning (same turn) and this skill protocol before ticking “I know this habit.” If the append only patches an existing encoded class, failure-learning alone is enough.

## Protocol (order)

1. **First principles** — Write the axioms you are as sure as possible are true. Reason up from those. **Forbidden** as the sole method: analogy-only (“do what we did last time”, “copy the prior patch”).
2. **Compound / semantic tree** — Master the **trunk** (fundamentals) before **branches**, before **leaves** (details). Re-derive advanced claims from the basics before specializing. Do not hang leaves on an empty trunk.
3. **Primary sources** — Read top-tier public docs, specs, or papers relevant to the skill. Cite them. Chat memory alone is invalid. Peer craft packs ([`keep-current-shared-craft.md`](keep-current-shared-craft.md)) are optional peers — not a substitute for primaries when the skill is external knowledge.
4. **Recursive deepen** — Acquire the minimum to unblock, then deepen using what was just learned; each layer feeds the next. Do not stop at a shallow skim and claim mastery.
5. **Exam** — An independent smarter model (or forced replan if unavailable) defect-checks understanding against the axioms + sources. Same-author self-quiz is not an exam.
6. **Tick only on Pass** — Name acceptance and rejection for the exam up front. Tick “learned” only after Pass. “I read it” without Pass is incomplete.
7. **Redo the original owner task** — Exam Pass (and failure-learning) do not close the job that failed. Re-execute that task under the new playbook. Patching the failed artifact is not a redo. Gate: `assertPostLearningOwnerTaskRedo`.

```
gap → axioms → trunk/branches/leaves → primary sources → deepen → smarter exam → tick if Pass
```

## Relation to other craft

| Need | Craft |
|------|--------|
| Owner money/strategy output review | `high-stakes-smarter-review` (craft: second-order-thinking.md) |
| Failure / dispute / process miss | `failure-stuck-loop-learning` |
| Delivery Pass/Fail + TDD | `self-improving-harness` (`assertStrictGatePlan`) |
| Peer craft pack sync | `keep-current-shared-craft` |
| Folding rules into principles | `rulebook-governance` (compression test) |
| Every substantive start: fetch current best practices for externals (not only when claiming a new skill) | `pre-task-readiness` (`bestPracticeSought`) |

## Mechanical gate

`assertSkillLearningComplete` and `assertPostLearningOwnerTaskRedo` in `src/lib/skill-learning.ts` (`npm run eval:skill-learning`).

Required fields when claiming a skill or new standing habit learned:

- axioms stated (first principles)
- trunk-before-leaves (compound / semantic tree)
- **non-empty** `primarySources` list (top public docs/specs/papers — not blogs/chat/peer packs alone)
- recursive deepen acknowledged
- exam path: `smarter_subagent` | `forced_replan` (forced_replan requires smarter attempt + unavailability reason)
- `examReviewerNote` (reviewer id or replan note)
- exam Pass
- named acceptance + rejection for the exam
- `tickedLearned` only if exam passed
- After a failed owner task: exam Pass / learning does **not** close the job — `assertPostLearningOwnerTaskRedo` (full redo, not an instance patch)

Reference gate implementation: `src/lib/skill-learning.ts` (`assertSkillLearningComplete`, `assertPostLearningOwnerTaskRedo`).

## Validity boundary

- Does **not** require a smarter exam for every chat sentence or every failure-learning append that hardens an existing class.
- Does **not** replace Class B for owner-facing strategy / money / Match? / canvas.
- Does **not** license skipping domain safety invariants while “learning.”
- Does **not** close the original owner task: exam Pass is permission to redo the job, not a substitute for doing it.
