# Second-order thinking

> Portable craft. Before a **high-impact** action, name what happens first **and** what that causes next — then state where the chain stops being claimed.

Specialisation of the policy / decision layer. First-order thinking asks “what does this do?” Second-order thinking asks “and then what?”

## Axioms (first principles)

1. Every action has immediate effects **and** effects of those effects.
2. Optimising only the first hop often creates a worse second hop (or an invisible failure).
3. Naming the chain does not prove causation — label Confirmed / Inferred / Unknown — but **omitting** the chain is incomplete for high-impact work.
4. A consequence chain without a **validity boundary** is unbounded speculation; stop conditions matter as much as the next hop.

## When it applies

Run this protocol before acting when the decision is any of:

- Money write or money-claim surface (ledger, Match?, owner books)
- Tenancy / cross-tenant risk
- Production side effect (deploy, live data mutation, irreversible ops)
- Encoding or changing a standing habit / always-on rule
- Owner-facing product choice that moves money or tenancy

**Does not apply** to: routine smoke ticks, in-budget digs with no irreversible write, typo fixes, or every chat sentence.

## Protocol

1. **First-order effects** — What changes immediately if we do this? (one or more concrete effects)
2. **Second-order effects** — What do those first effects cause next? (knock-ons must not merely repeat the first-order list)
3. **Validity boundary** — Where does this chain stop being claimed? What would falsify or bound it?
4. **Act or revise** — If a second-order effect violates a safety invariant or the owner’s books-of-record, revise before acting.

```
high-impact decision → 1st-order → 2nd-order → validity boundary → act or revise
```

## High-stakes smarter review (class B)

Merged in from `high-stakes-smarter-review.md` on 2026-10-10 — the same family: slow down before the high-impact surface reaches the owner.

**Owner decision (class B, locked 2026-08-16):** review **only** high-stakes surfaces — not every chat line (A), and not only overrun (C).

### What is high-stakes

Treat as high-stakes when the deliverable is any of:

| Kind | Examples |
|------|----------|
| Strategy / board brief | CEO readiness, mandate, operating model, risk table |
| Money / books acceptance | Match?, parity, balances, fee SoT claims, dry-run verify tables |
| Owner money **where-to-look** | Pointing the owner at a human ledger/books page or naming the figure they should trust |
| Standalone canvas | Any `.canvas.tsx` (or equivalent) the owner opens as the artifact |
| Product A/B/C that moves money or tenancy | Expanding write authority, fee changes, assign policies |

Sending the owner to a money surface without verifying that surface shows the Match? metric is high-stakes — not a routine checklist.

### What is routine (no smarter review required)

Ingest ticks, SKIPPED_EXISTING, deploy SHAs, typecheck green, “Worker cooled after 503”, short status that does not assert a new board-level or Match? truth.

**`npm run self-verify` is not Class B.** That suite runs fixture evals and `assertHighStakesReview` *examples*. It does not launch a second agent. Never tick Class B because the build was green. Accounting claims that set `selfVerifyUsedAsClassB` fail `assertAccountingClaim`.

If unsure: classify **high-stakes** and review.

### How to review

1. **Classify** the outbound artifact (high-stakes vs routine) before showing the owner.
2. If high-stakes: run an **independent smarter reviewer** (stronger model / separate agent) whose only job is defect-first critique against live evidence and locked decisions — not a rewrite of the whole job.
3. **Integrate** the review: fix stale or wrong claims; then show the owner the corrected artifact.
4. If the review **FAIL**s: that is a failure-learning trigger the same turn — dated learnings + class gate, not a canvas-only patch (`assertIndependentReviewClose`).
5. If the smarter reviewer is **unavailable** (API limit, empty twice): **forced local replan** with a different method (fresh live reads + defect list), label that path, and still correct before showing. Same-author self-congratulation without a replan is not a review.
6. Never claim “reviewed” when no independent smarter pass and no forced replan happened.

### Validity boundary of the review

- Does **not** require a second agent on every message or every tool result.
- Does **not** replace overrun/spin independent checks (`assertOverrunAudit`) — those remain.
- Does **not** license money writes; reviewers stay read-only on books.
- Domain safety (money accuracy, immutability, secrets) still outranks process speed.

### Mechanical gate

`assertHighStakesReview` in `src/lib/high-stakes-review.ts`:

- classifies kind → `high_stakes` | `routine`
- for high-stakes, requires `review_path`: `smarter_subagent` | `forced_replan`
- rejects `none` / same-author-only on high-stakes

Eval: `npm run eval:evidence` (includes high-stakes cases) or focused import of the assert.

## Relation to other craft

| Need | Craft |
|------|--------|
| Prove a cause / stamp numbers | `evidence-discipline` |
| Owner money/strategy review | the class B section above (merged 2026-10-10) |
| Fix + class + boundary as deliverable | `evidence-discipline` / self-improving harness |
| New skill / habit curriculum | `agent-skill-learning` |

Second-order thinking **feeds** Class B and evidence discipline; it does not replace them.

## Mechanical gate

`assertSecondOrderThinking` in `src/lib/second-order-thinking.ts` (`npm run eval:second-order-thinking`).

When `acting` on a non-`routine` impact:

- non-empty `firstOrderEffects`
- non-empty `secondOrderEffects` (at least one effect not identical to a first-order string)
- non-empty `validityBoundary`

Reference gate implementation: `src/lib/second-order-thinking.ts` (`assertSecondOrderThinking`).

## Primary sources (skill trunk)

- Ray Dalio, *Principles* — second- and third-order consequences before deciding
- Howard Marks, *The Most Important Thing* — second-level thinking (look past the obvious first conclusion)
- Donella Meadows, *Thinking in Systems* — feedback, leverage, unintended system responses

## Validity boundary

- Does **not** require a written chain for every low-impact message.
- Does **not** turn every Inferred knock-on into a Confirmed cause — evidence-discipline still governs proof.
- Does **not** replace Class B smarter review or domain safety invariants.
