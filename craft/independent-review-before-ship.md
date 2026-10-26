# Independent review before ship: no change ships without a review trace

> Portable craft. A change is not reviewed because a human clicked merge, or because the author agent pushed it. Adopted from the peer playbook's merge-trace rule (owner ruling 2026-10-10); the existing release gates and owner-facing review classes are untouched — this rule adds one thing: a recorded trace at the moment of shipping.

## Rule

Every **attended ship** — a push to a shared branch, a pull-request merge, a release — carries an **independent-review trace** recorded with the change **before** it ships:

- **Verdict** — Pass / FAIL / Pass-with-notes.
- **Reviewer** — an independent agent or model session, never the author session. A principal's merge or push click is approval, not review.
- **Scope** — the commit(s) or diff the verdict covers.

The trace may honestly say `none — <reason>` (routine housekeeping, a revert of a failed change) — but the line must exist; silence is the gap this rule closes. A FAIL verdict is a failure-learning trigger the same turn, and the ship waits for the fix or an explicit principal decision to proceed anyway.

## Where the trace lives

| Ship path | Trace location |
|---|---|
| Pull request | the PR description, on the repo's PR-template checkbox |
| Direct push | trailers in the push commit message (`Reviewed-by: <reviewer>` + `Review-verdict:` + `Review-scope:`) |

In addition, the work report to the principals states the verdict.

## Exceptions (named, never silent)

- **Unattended scheduled pushes** keep their standing release gate (fully green automatic tests, one change at a time) — their review arrives from the daily watchdog after the fact.
- **Reference-only edits** (a typo, a link fix) may ship on a `none —` trace, never on no trace.

## Relation to other craft

- the high-stakes class B section of [`second-order-thinking.md`](second-order-thinking.md): that rule reviews the owner-facing artifact before the owner sees it; this rule reviews the change before it ships. One review serves both only when it meets Class B's own bar — a smarter reviewer, defect-first against live evidence; an ordinary independent-review trace never replaces Class B.
- [`failure-stuck-loop-learning.md`](failure-stuck-loop-learning.md): a FAIL trace is a trigger there.
- [`audit-claims-pass.md`](../../docs/craft/audit-claims-pass.md): audits of a session's work before a report ships.

## Gate

`npm run check:harness` (the rule must stay wired: map row, routing line, published copy). The adoption change itself ships with a recorded trace — the rule's first application.
