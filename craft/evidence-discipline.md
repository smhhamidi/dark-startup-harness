# Evidence discipline (how a claim earns the word "proven")

> Portable craft, distilled from a peer contribution on evidence, solution quality and rulebook hygiene.
> Says *when a measurement counts*; the project's own craft says *what to measure*.
> Owner-facing surfaces (merged in from `owner-facing-sensors.md`, 2026-10-10): what a claim may be built on, and what the owner may be shown.

Reference gate implementation: `src/lib/evidence-discipline.ts`, proven by its eval.

## Part I — Causation

1. **Causation is proven, never inferred.** Coincidence in time, familiarity with a component, and a persuasive narrative are not causes. Until the mechanism is observed in the system itself, the attribution is a hypothesis and is labelled as one.
2. **A single sweep is not controlled elimination.** Three guards separate an experiment from a coincidence:
   - **Background rate** — the surrounding system's error rate in the same window. If other things failed too, the witness is contaminated.
   - **Negative control** — at least one case the hypothesis says must stay healthy. If it fails too, the verdict is *inconclusive*, not *confirmed*.
   - **The clock** — when the change went live versus when the symptom stopped. If the symptom cleared before the change was live, that change is not the cause.

   Corollary: **deploy transients are indiscriminate.** A sweep run during a rollout makes any partition look meaningful.
3. **Read the error body, not the status code.** A status code is a label; an exception type and stack are an address. Prove a layer from that layer's own logs — zero errors in a component's own log means it is not the culprit, whatever the end-to-end symptom suggests.
4. **Prove the live code path, not the familiar one.** Follow route → handler → sink for the request actually served. Deep-debugging a file that was never in the execution path (usually the best-known file) is the most common recorded waste.
5. **Prove environmental assumptions the way you prove bugs** — coverage (what share of real traffic), unit of policy (user / session / request / tenant / device), layer boundary, reachability.

Recognising a contaminated witness:

| Situation | Why the obvious reading is unsafe | What proves it |
|---|---|---|
| A number "fixed itself" right after a job ran | Another writer may have been running in the same window | Timestamps of that job's own write versus the moment the number changed |
| A whole batch mismatches right after a deploy | Deploy transients hit unrelated work too | Re-run outside the rollout window, with a case that must stay healthy as control |
| "The parser broke this value" | The count fell somewhere downstream | Feed the input to the parser directly and inspect its output structure |

## Part II — When a number is evidence

6. **An observation without a reference is not evidence.** Every number sits beside the number you expected. "Fewer", "more", "empty" alone is data, not a finding. **"It went down" is not "it is wrong"**: a second filter narrows a population by construction. Compute the expectation independently — usually cheap one layer down (a direct count, a raw query, a manual tally).
   - Do not name a suspect before proving there was a crime.
   - Test a component with itself, not through a downstream count.
7. **Use the real value space, not a hand-picked example.** Sweep the whole enumerable space rather than one suspicious row.
8. **Every boundary is a transformation and a potential silent loss.** Health on both sides does not prove health across it.
   - "Has the field" ≠ "has the data" — an existence count is not a coverage metric.
   - What you read is not what the engine reads — the human-readable copy of a record and the structure actually evaluated can differ.
   - "Written" ≠ "retained", "accepted" ≠ "queryable" — allowlists, indexing and retention drop data silently. Measure retention before any claim about history.
   - A parser that skips silently is a dead feature returning a success code. Prove the effect, not the status.
9. **Absence of a record is not evidence of deletion.** Cross-check absence in a second independent source before any destructive action.
10. **Configuration divergence across peers** — instances of "the same" service can hold different configuration. Verify the instance actually serving the traffic.

## Part III — When a fix is acceptable

11. **The unit of solution is the class, not the instance.** Every deliverable has three parts: the fix, proof it works for the whole class, and the validity boundary where it stops being valid. If a fix turns exactly one case green, call it a code smell yourself.
12. **Structural guards beat written guards.** Prefer, in order: impossible by construction → fails a test automatically → written down. A guard must assert **the invariant at risk**, not the implementation you happened to build.
13. **Cost is a layer of correctness.** The unit of cost is *where the code executes*, not how many lines. Two lines inside a per-item loop are expensive; add a budget assertion when work moves into a per-item path.
14. **Error asymmetry: order, do not remove.** Consume probabilistic or inferred signals as **weights**, not membership filters. A wrong weight is visible and recoverable; a wrong filter produces invisible absence that nobody downstream can rescue. A hard filter is legitimate only with a measured justification, recorded. Prefer parking ambiguous items in a visible queue over dropping them.
15. **"I moved it" ≠ "the behaviour is the same."** Prove equivalence after a refactor at the level of output — replay real inputs through both paths and compare.
16. **The least-code ladder.** Can it not be done at all → configuration → composition of what exists → a smaller change one layer down → only then new code.

## Part IV — Epistemic hygiene in documents

17. **Every claim carries its status: Confirmed / Inferred / Unknown.** Label inline in learnings, reports and craft. Unlabelled documents hand the reader confidence the author never had.
18. **Never write a currently-true number in prose.** Counts, balances, rollout percentages and quotas change without touching the document, and a stale number reads as authoritative. State *where to read the live value*, or label the figure as an observation with its date (`Observed 2026-08-15: …`).
19. **A rule without a "why" has no validity boundary.** A bare verdict works only in the case that produced it. Record the reason, or record your inference labelled as an inference.
20. **"Pushed" is not "delivered."** A rule on a branch, in a chat log, or in a tool's private memory is not delivered. When a rule has automated consumers, verify once that the consuming path really reads from where you wrote it.
21. **Merged is not live.** The witness is the artifact actually serving traffic, not merge status or a green pipeline (`assertServingArtifactNotMerge`).
22. **Before an expensive action**, name two routes and take the cheaper time-to-first-witness (`assertFastestRouteChosen`).
23. **See what you shipped.** Human-facing output must be opened. HTTP 200, byte counts and grep prove existence (`assertHumanFacingOutputWasSeen`).
24. **Name the criterion of the answer.** A silent swap to a nearby cheaper dimension is a defect (`assertAnswerNamesItsCriterion`). Naming a substitute is not a license to skip looking for the real one.
24a. **Proof-link fill ≠ supporting-document adequacy.** Counting filled `receipt`/`invoice` link fields, or raw file piles in Drive/Dropbox/Telegram, does **not** prove اسناد مثبته are adequate. Adequacy requires (1) a named required-evidence policy by transaction class and (2) a reviewed layer (`assertDocumentCoverageClaim`). Burnt example: reporting 12/1166 linked master rows as “~99% of records lack supporting docs.”
25. **Two independent sources** for an aggregate, or label it an estimate (`assertSecondIndependentSource`).
26. **Who writes this field?** Fill rate, writer, and population are each a query (`assertFieldProvenance`).
27. **Triage by severity** before a deep dive. Ranking after the first query ranks by volume (`assertTriageBeforeDeepDive`).

## Owner-side claims

- Owner **principles, values and books-of-record** govern.
- Owner **empirical** claims about causes, users or the market are hypotheses like anyone else's — check against primary evidence and label them. This never licenses dismissing an owner dispute: a dispute is a failed-sensor signal, and the owner's number is reconciled, not argued with.
- **Goodhart as a selection rule** for any participant-visible score: publish an indicator only if improving it necessarily improves the real outcome. Concealment is not the alternative — choosing a better measure is.
- **Two-sided markets:** both sides' outcomes are first-class. Look for a design where both win (a ranking weight usually beats a hard exclusion); if genuinely zero-sum, judge and record what was given to whom and why; if uncertain, escalate to the owner.

## Evaluate vs measure (owner ruling 2026-10-18)

Evaluating how something is going and measuring how it is going are different acts (owner ruling 2026-10-18; the shared rulebook's Working section carries the condensed form). Not every question owes a measurement: a progress or quality question — "how is the work going", "is this approach paying off", "is the design good" — is answered by a direct evaluation with good taste and judgment, labelled as an evaluation (the Part IV Confirmed / Inferred / Unknown discipline applied to verification itself), never dressed as a number and never passed off as a verify status. Build a measurement only when it is cheap and decisive for the question at hand; a measurement that needs crazy contortions is itself the defect, not the missing rigor.

The standing floors are untouched, wherever they live: the measured claim floors — causation (Part I), a number as evidence (Part II), absence claims, owner-facing figures — stay measured, and a progress measure a standing rule already pins to a metric stays a measure. The process floors hold with them: a verify outcome keeps its four statuses (an evaluation is not one), and overrun or spin still requires an independent check, never a self-evaluation.

## Verify time budget (classify before you start)

Culture: **speed beats efficiency** — an honest Fail in minutes beats "still testing" for hours.

| Class | When | Wall clock to first Pass/Fail | Allowed work |
|---|---|---|---|
| **smoke** | Sanity after a small change | ≤ 3 min | Typecheck / one eval / one probe |
| **targeted** | One symptom, one customer, one path | ≤ 8 min | One measurement script + at most one live write cycle |
| **sweep** | Explicitly asked for the full population | ≤ 25 min once | Only the population named; no infinite retries |

- Do **not** silently upgrade targeted → sweep mid-loop. If the owner later asks for the full picture, start a new sweep job.
- Budget blown ⇒ stop and report Pass/Fail plus **one** hypothesis. Do not keep probing.
- After a proven Pass, do not re-run "just in case" without a new deficiency in evidence.
- Owner says it is taking too long ⇒ interrupt the long job, reclassify down, report what is known.
- Same empty/zero-output subagent twice ⇒ coordination Fail; change the prompt or run it locally.

## Verify statuses — a status is a claim, never silence

A verify outcome is one of exactly four, and only two are terminal on their own:

- **Pass** — the named check ran and is green.
- **Fail** — the named check ran and is red; the repair loop continues.
- **Blocked** — the check cannot run at all (missing access, missing dependency, a live dependency down). Not a Fail: nothing was tested. A Blocked line carries its reason or it is not a status.
- **Waived** — a principal accepted the risk of not running it. A Waived line carries who waived and the dated decision, or it is not a waiver.

Forbidden shapes: "200 so it works" and "couldn't test but logically fine" are not statuses — they are silence wearing a status word. A status field is a claim about the work, never about the absence of complaints.

Gate: `assertVerifyStatus` in `src/lib/owner-facing-report.ts`.

## Predictions are written down before they can be scored

When raising a problem that has not hurt anyone yet, write the prediction next to it: who would be hurt, and how we would know. When the check later runs — or the waiting line clears — score the prediction, in the same place. A forecast that is never scored drifts toward whatever gets attention, and the sensor never improves. Predictions live where the next run reads them (a dated learnings line), never only in chat.

## Long-running or looping work triggers an audit, not patience

When a job overruns the budget above or starts spinning, that fact alone triggers an audit answering three questions:

1. Is it making progress, or repeating itself?
2. Does its scope match the *purpose*? "Complete" and "complete enough to answer this question" differ — prefer the smallest sufficient slice (latest N, a sample, a bounded window).
3. Is there a faster route to the same goal?

**Who audits:** in-budget work that is still producing new evidence stays with the **same agent**. A looping agent is a bad auditor of its own loop, so **overrun or spin requires an independent check** — not a second copy of the whole job, and not a second agent on every task.

| Trigger | Required interrupt |
|---|---|
| Still inside smoke / targeted / sweep, new evidence each attempt | Same agent continues |
| Budget blown, same approach twice with no new evidence, or a silent stall | Stop the original loop. Run a **short parallel independent auditor** whose only job is the three questions plus a named faster route. Then follow that route. |
| Independent auditor returns empty/zero twice, or no subagent is available | **Forced replan locally** with a different method — do not spawn a third copy of the same auditor |

Validity boundary: the independent check does not write money, does not waive the parent learning checklist, and must not continue the original command sequence "while we think about it."

Gate: `assertOverrunAudit` in `src/lib/evidence-discipline.ts`.

## Owner-facing surfaces (what may appear where the principals read)

Merged in from `owner-facing-sensors.md` on 2026-10-10 — the same claims family: what a claim may be built on, and what the owner may be shown. Owner-facing reports and acceptance checks use **only** sensors the owner recognises as their own books-of-record. Internal, agent-built, mirror and debug fields stay off those surfaces.

### Class rule (not instance)

When acceptance fails because internal system state was mixed into an owner report:

1. Do **not** only patch the one bad column or name.
2. Encode the **class**: owner-facing tables exclude every non-authoritative internal field.
3. Add or extend a **mechanical gate** so the next mirror or debug field cannot sneak in the same way.
4. VOID conflicting prior learnings the same turn.

Any agent-built mirror, engineer-only probe, or circular self-check presented as "your books" is the same class of error.

### Separation

| Layer | Owner acceptance **tables** | Owner **prose**, checklists, where-to-look |
|---|---|---|
| Owner books-of-record (the document they already open, its tab, its column) | Yes | **Primary** — lead with the link, the tab and the column |
| The system's committed figure | Yes — as "Amount in system" | Only as needed for the comparison; never as "open this endpoint" |
| Internal mirrors, agent-built artifacts, debug probes, raw API dumps | **No** | **No in the main body** — even "ignore the internal copy" is forbidden. Put it under `## Details` only if the owner asked for engineer depth |

### Owner prose (class)

When the owner asks where something lives or what to check:

1. Lead with: the subject (customer, order, account), the link to the document they already use, the exact tab, the exact column, and what "good" looks like.
2. If they want the system's own view, give a human page, not an API dump.
3. Do not name internal artifacts in the main checklist.
4. Do not lead with credential commands, table names or endpoints.
5. Engineer storage goes under **Details**, only when useful.

### Owner human pages (class)

When the system exposes a human-readable books page for the owner:

1. The **hero balance** must be the same metric as owner Match? (for Payments client-balance sheets: ops_* Track A = Payments Total H).
2. Never show a mixed bank+invoice+ops Track A sum as “the ledger balance” on that page — that is the same class of failure as putting an internal mirror on a Match? table.
3. Gate: `assertOwnerBooksHtmlUsesMatchMetric` + `buildOwnerBooksView` in `src/lib/owner-books.ts`.
4. **Displayed fields that exist on the owner's document** (Date, Type, Amount, vendor) must be proven against that document before calling them missing. A stored blank in the system copy is not proof the owner's cell is empty. Overlay the live document value for display; do not UPDATE historical money rows.

### Mechanical gate (owner surfaces)

A helper module should expose, at minimum:

- an assert that rejects forbidden internal **column headers** on an owner table,
- an assert that rejects internal or API phrases in owner **main-body prose**,
- a builder that produces owner-vs-system comparison rows and nothing else,
- an assert that owner **/books** HTML binds the Match? metric (`owner_client_balance`), not mixed Track A `data.balance`.
- an assert that a filled owner-document Date cannot render as blank (`assertOwnerBooksDateNotAssumedBlank`).
- an assert that owner-facing **counts** (activity, vendors, volume) use unique workbooks, not alias registry rows (`assertOwnerFacingCountUsesUniqueWorkbook`).
- an assert that owner-facing **partitions** (credit / debit / flat) add to the stated population (`assertOwnerFacingCountPartition`).
- an assert that **named money figures** on an owner brief were re-read at publish, not copied from a stale sweep (`assertOwnerFacingNamedFiguresLive`).
- When a business number is corrected, the **generator**, the analysis note, the owner-facing artifact, and the knowledge note that names the old value update in the same turn. A correction that never reaches the reader did not happen.

The **first sentence** of owner-facing prose is the result. Do not prefix it with a label. Match the owner's language. Quotes mean verbatim.

When prose is **Persian plus English**, put English on its **own line** (or under جزئیات) — zero Latin on Persian lines; backticks mid-sentence still scramble Cursor chat — gate: `assertBilingualFaEnLayout`. Craft: `bilingual-fa-en-layout.md`.

The **decision layer of a work report is a fixed schema, not free prose** (agent inference 2026-10-12, from the twice-caught «گام بعد» defect and the owner's root-cause order «برو»): each slot accepts exactly one content kind — نتیجه holds only delivered work; گام بعد holds only an offer awaiting the owner's word («پیشنهاد — اگر بگویید …»), the owner's A-B-C decision, or «هیچ». Before sending a work report to a principal, the draft is validated mechanically: write it to a file, run `npm run check:report -- <draft.md>` — red on a done-marker or an ungated first-person promise on the گام بعد slot, a promise inside نتیجه, a missing slot, or Latin on a Persian line. An ask of the owner on the گام بعد slot states its OWN analysis — the benefit (فایده) of saying go, the no-go consequence, the options and the recommendation; a bare offer is red (owner correction 2026-10-13, rule `offer_without_benefit` — the dogfood red fixture is the catch itself). The two real caught defects are permanent red fixtures in `tests/evals/report-skeleton.eval.ts`; the next catch of this class adds a red fixture there, never another prose rule. Gate: `assertReportSkeleton` / `validateReportSkeleton` in `src/lib/owner-facing-report.ts` (bilingual check reused from `src/lib/bilingual-fa-en-layout.ts`, never re-implemented).

Domain-specific report builders may wrap these, but must still call the asserts.

### Memory supersession

When the owner says "forget prior guidance" or "update your memory":

1. Append a dated VOID/supersede entry — never delete history.
2. Harden craft and the always-on rule so the obsolete path is forbidden.
3. Re-issue the owner report under the new schema only, with no obsolete columns "for context".

### Autonomous business learning

The owner should not have to teach measurable definitions as routine — which column is the balance, fee versus total, what a tab is for. Learn that from the live records, the project KB, the craft and the code; measure with proof; encode durable rules. Owner corrections are sensors that a prior learning failed, not the teaching routine.

### Listing tools vs source completeness

1. A failed Worker (or other) walk is **not** proof the owner's Drive folder is unreadable. If a public Drive index or another listing succeeded, say that — and keep invoice-level completeness Unknown until measured.
2. Newer files for **some** banks do not supersede the whole pack. Name the rails that still have no newer copy.
3. Gate: `assertToolFailureNotSoldAsSourceAbsence`, `assertPartialCoverageNotCollapsed` in `src/lib/owner-facing-report.ts`.

## Using the gate

```ts
import {
  assertCausalClaim,
  assertClassFix,
  assertOverrunAudit,
  assertReferencedFinding,
} from "../lib/evidence-discipline";

// A cause may only be reported at the status it earned.
assertCausalClaim(
  {
    hypothesis: "the sync job overwrote the balance",
    mechanismEvidence: "row written at 12:04 by source=sync",
    backgroundRateChecked: true,
    negativeControlName: "an account that must stay healthy",
    negativeControlHealthy: true,
    timelineChecked: true,
  },
  "confirmed",
);

// A number is a finding only beside an independently sourced expectation.
assertReferencedFinding({
  label: "customer balance",
  observed: 4200,
  expected: 5217.2,
  expectedSource: "direct sum of the owner's typed rows",
});
```
