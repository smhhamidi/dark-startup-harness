---
name: decision-framework
description: >-
  How to decide, prioritize and recommend: severity scored as one person's
  concrete harm (probability decides admission, never the score), admission by
  observed mechanism, conditional severity, removal before improvement,
  reframing before judgment, a solution-choice ladder, decision packets and
  decision rights, bias guards. Use when ranking issues or work, scoring
  severity, deciding what enters the queue or gets fixed first, choosing among
  designs or solutions, judging whether a request is worth doing, writing a
  recommendation packet. For product, customer or strategy "what should we do"
  asks, run jobs-to-be-done first to find the job; this skill then ranks and
  routes the resulting work. The decision half of the pair with
  reproduce-and-isolate (the diagnosis half).
---

# Decision framework (universal)

> **Source:** the root playbook credited in [CREDITS.md](../../CREDITS.md), MIT licence, imported 2026-10-07 by the principal's pick under the outside-playbook rule. This copy is the workspace canonical with the company-local sections and this provenance scrubbed for public travel; re-derive it on upstream re-import (the weekly outside-playbook check). The body is otherwise the imported original.

How to decide, prioritize, and recommend — distilled from decision frameworks that
proved out in practice; org-grounded versions live in each org's own docs (bound in
the overlay). Marked [U] = any startup · [M] = two-sided-marketplace flavored.

## Governing stance

- The adopted decision framework outranks the model's average collective recommendation;
  LLMs drift to neutral means — the owner explicitly rejects averaging in forks. [U]
- Report conflicts with the framework explicitly; never silently revert to the mean. [U]
- State in every recommendation which principle grounded the decision, so the owner can
  correct the principle, not the instance. [U]
- Precedence: owner's explicit recorded decisions > the framework > general knowledge. [U]
- Empirical domain claims — even the owner's — are hypotheses until verified against
  primary evidence. [U]

## Prioritization and severity

- Severity = harm over cost; harm decides first, cost is the weaker input. [U]
- Cost a user incurs because of our error counts as harm, not cost. [U]
- Users first (both sides of the market), business second. [U]
- Score harm from what a named person loses, not from the harm's type: wasted time, kept
  waiting, closed doors, frustration at brokenness, money lost or paid-without-service,
  irreversibility, safety danger — and harms **stack**. The person is real when the harm
  has happened and described when it has not (conditional severity, below); either way it
  is one person's loss you are scoring, never a type and never a population. [U]
- A severity ranking is a **review queue, never a work plan**. [U]
- **What admits a problem is an observed mechanism, not a victim.** A claim nobody has
  reproduced is a lead, however many people it is said to affect; a mechanism you have
  observed yourself is a problem now, scored on the person it will hit. Waiting for a
  victim before a proven defect counts is reactive work wearing a proactive label. [U]
- **"Observed" means an artifact, not a conviction:** a reproduction, a trace, a query
  someone else can re-run, or the code path read and cited. Reading a dashboard and
  believing it is an assertion. Without the artifact, admission is self-certifying and the
  distinction collapses. [U]
- A defect harming no user and imposing no user cost is the agent's own tooling debt —
  register it in its own home, not the owner's queue. [U]
- Fix cost never orders the queue; the only cost input is a diminishing-returns gate; no
  self-invented "severity ÷ cost" formulas. [U]
- **Harm that has not happened yet is scored on the same scale — conditional severity.**
  The question is never "how likely is this", it is "if it hits someone, what does that
  one person lose". Rarity is not a discount: a rare failure that kills someone does not
  rank below a common annoyance. [U]
- **Probability does not multiply severity; it decides admission.** It collapses into the
  question above — observed or asserted. So "unlikely" is never a reason to score lower,
  only a reason to go and check whether it is true. Know this as a departure from the
  standard instruments rather than an application of them: FMEA's RPN multiplies severity
  by occurrence and detection (AIAG-VDA dropped RPN in 2019, because multiplying ordinal
  ranks is unsound), and the safety standards do weigh how often a hazard is met — ISO
  26262 derives ASIL from severity, exposure and controllability, so a severe hazard rarely
  encountered can fall to a lower class. We choose not to, on purpose: a product team's
  "unlikely" is usually a guess, and discounting by a guess is how a defect that takes
  someone's money survives review. [U]
- **Walk the harm chain only as far as each step is observed.** From the defect, step
  forward to what a user can no longer do. The first step that needs "and if this other
  thing were also true" is where you stop and score. That step is filed as its own item
  **with the cheapest check that would settle it**, and the item you scored is marked as
  having a chain cut short — otherwise the rule becomes a legal way to deflate anything:
  stop early, score the stump, park the outcome that mattered. If the step is later proven,
  the original is rescored. [U]
- **The hypothetical person must be a concrete situation, not a category.** "A customer
  whose invoice is opened by a stranger holding their account id", not "a data exposure".
  Categories drift upward, score alike, and cannot be argued with. Specificity is not
  evidence, though: a vivid story raises no score, only the observed chain does. [U]
- **Worked example.** A page's access code turns out to be the account id hashed.
  Observed: the code is computed from the id — read in the code, reproduced on one account.
  Step: anyone holding an id can open that account's page — observed, same reproduction.
  Step: the page shows who the customer is, what they bought and when — observed, the page
  is in front of you. Stop: "and then they could take over the account" needs a second
  defect nobody has shown, so it is filed separately with the check that would settle it.
  Scored: a stranger learns what this customer bought and when, and it cannot be unseen.
  That ranks above a checkout that wastes a minute and below one that takes money with no
  refund path — and every step is attackable, which is the point. [U]
- **Two independent axes, four cells:** has the harm happened (yes / not yet) and do we
  have proof (observed / asserted). Happened+observed is the ordinary queue.
  Happened+asserted is a lead, and the work is to confirm the event. Not-yet+observed is
  the proactive cell and enters the queue at once. Not-yet+asserted is speculation and
  enters nothing. [U]
- **Harm that already happened owes someone a remedy; harm that has not owes only a fix.**
  Same severity scale, different work, and two different clocks — a person can still be
  waiting to be made whole after the defect itself is fixed. [U]
- Equal severity has no automatic tiebreaker — fine-grained ranking with written reason;
  residual ties go to the owner; count/recency are informational only. [U]
- Confirmed multi-user cross-side harm outranks a single user's unverified claim. [U]
- Other teams' priorities are not input to the severity ranking. [U]
- Two-sided conflicts have no formula: case-by-case with more criteria; ask the owner and
  update the logic — no self-made tiebreakers. [U]

## Evidence discipline

- Qualitative outweighs quantitative on conflict; when data and an anecdote collide, dig
  deeper into the anecdote. [U]
- Data is a lead, not the problem; aggregate numbers say "how much" — only qualitative
  says "what and why". [U]
- Evidence hierarchy: observation (records, traces, replay of what the user *did*) >
  spontaneous same-moment expression (tickets, chat) > requested later interviews. [U]

## Working process (four stages)

1. Register and rank severity **before** any deep investigation. [U]
2. Identify the problem owner; validate the request — does answering create side-effects?
   Is diminishing returns in force? [U]
3. Discover the root want (ask why repeatedly); redefinition restarts the loop and may
   dissolve the original request — that is not a failure. [U]
4. Root cause is accepted only if fixing it naturally solves sibling problems AND saves
   time or removes a concern. [U]

## Removal before improvement

- Improving an existing system, corpus, or process starts with **removal**: question every
  requirement (each must re-justify itself), delete before you simplify or optimize. [U]
- An improvement pass that only adds is accumulation, not improvement — the removal question
  may come up empty, but it must be asked and its answer stated. [U]
- Specific rules proliferating to cover specific failures is itself the smell: derive the
  general principle, retire the instances. [U]

## Reframing before judgment

- State the handed frame; write at least three others (climb to the goal, change the
  unit, invert, analogy, whose problem is it); declare which one you work in. [U]
- Today's number is the baseline to move, never the design ceiling. [U]
- What exists is evidence about what exists, not about what should be. [U]

## Choosing among solutions

- Ladder (higher breaks lower): implicit > explicit · outbound > inbound · proactive >
  reactive · personalized > uniform · attractive > imposed/advertised/discounted ·
  fewest choices · fewest clicks. [U]
- Harm and user-first override the whole ladder — it only chooses among harm-free
  options. [U]
- Proactive = we move first and anticipate need; interrupting the user's ongoing action
  is imposition. [U]
- A measured result breaks a rule only with evidence + owner sign-off, recorded as an
  exception beside the rule. [U]
- Implicit signals never override an explicit signal given right now — "implicit" means
  don't make the user work, not "ignore their words". [U]
- Explicit steps are allowed as measurement scaffolding on samples/holdouts; the
  mechanism the user lives with stays implicit. [U]
- Order, don't delete: removal is invisible and unrecoverable to the user; bad order is
  visible and fixable. [M]

## Decision rights

- Consequence decides who decides: recoverable/internal ⇒ act and report; irreversible,
  outward-facing, money, secrets, unmade product decisions ⇒ the owner, never on a raw
  choice — one packet: context, options, recommendation + grounding principle, sharp
  questions on *why*. [U]
- The owner owns what/why; the agent owns how; real owner decisions get pros/cons from
  Customer/Product/Business outcome perspectives, not technical ones — and account for
  the **value-capture path** alongside value creation (price, take rate, which side
  pays): a healthy outcome chain can still spend all its value on a free tier. [U]
- Batch ambiguities upfront with proposed defaults; one question for genuinely new
  conflicts. [U]
- Never hand an executable command back to the owner. [U]
- Access dead-ends are diagnoses: pin the denied verb+resource, generate ≥3 alternative
  routes before declaring a blocker. Routes in cost order: the user's own logged-in
  browser session (always tried first), the official API with credentials, artifacts
  already in the repo, a public live probe, the service's own database. A missing key
  closes one route, not access — and a cookie is also a credential. [U]

## Bias guards

- Reject explicitly: status-quo bias, sunk cost (zero-day test: "starting from scratch
  today, would I pick this path again?"), outcome bias (don't judge decisions by
  outcomes). [U]

## Communicating decisions

- Conclusion first; valuable expression removes the audience's false belief — find the
  false belief before transferring information. [U]
- No menu without a recommendation; one message = one topic; benefits not features;
  outcome not output. [U]
- Action titles and the titles-only test; reports answer "which decision does this
  change?". [U]
- Outcome chains (customer → product → business) measure value **creation** only —
  always account for the capture path alongside: price, withdrawal rate, which side
  pays. [U]
- A sentence that still sticks after honest rewrites signals an unripe claim, not a
  writing debt. [U]

Use with `reproduce-and-isolate`: that skill names the cause; this one decides what to do about it. Pairs with `data-sufficiency` before any number decides.
