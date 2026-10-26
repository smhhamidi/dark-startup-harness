# Model-weight routing

> Portable craft. Assign model strength to **task weight**, not to habit. A cheap model on judgment work produces a confident wrong answer whose cost exceeds the token saving.

Complements the high-stakes class B section of [`second-order-thinking.md`](second-order-thinking.md) (owner-facing review must be strongest) and [`evidence-discipline.md`](evidence-discipline.md) (a wrong judgment is not caught by HTTP 200).

## First principles (trunk)

1. Work has a **detectability** of error. Independently verifiable work (format, search, a failing test) can use a cheaper model because the gate catches a miss.
2. Judgment work (architecture, ambiguous root-cause, money/security paths, any review/audit) has **low detectability**. The failure mode is a fluent wrong answer.
3. Token cost is linear; a wrong judgment on money, trust, or direction is not. Optimise for error cost, not for token cost, on that class.

## Routing

| Weight | Examples | Model |
|--------|----------|--------|
| Mechanical | search, format, boilerplate, mechanical edits | Light |
| Bounded implementation | a named change with a named test | Medium |
| Judgment | architecture, unclear RCA, money/security, any review/audit/exam | Strongest |

**When in doubt:** higher tier if the answer cannot be independently verified; lower tier if a test or live probe will catch a miss.

This does **not** force the host editor to switch the parent chat model. It **does** gate: subagent model choice, review/audit assignment, and claiming that judgment work is done after a light pass.

## Anti-patterns

- Using a light model for a review and ticking Class B / exam Pass.
- Labelling architecture as "just implementation" to justify a cheaper model.
- Picking strongest for every mechanical grep (waste, not a gate failure).

## Gate

`assertModelWeight` in `src/lib/model-weight-routing.ts` (`npm run eval:model-weight`).

## Validity boundary

Does not replace Class B, TDD, or domain safety. Does not claim a particular vendor ranking — "strongest" means the strongest model available to this agent for that turn, not a branded name.
