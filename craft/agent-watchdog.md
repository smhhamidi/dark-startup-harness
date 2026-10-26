# Agent watchdog

> Portable craft. A daily check, by a second agent, of what the main agent did. Owner ruling 2026-10-05 (D-030): "we need a watchdog for an agent, so it doesn't make big mistakes." It replaces the 2026-08-24 local watchdog, which ran inside a retired editor and had not run since 24 Aug. Live since the 2026-10-09 books restart (D-040).

## Why this exists

Rules and failure-learning only help when the agent that failed actually runs them. A main agent working alone for hours can book the wrong customer, release a broken change or send a wrong message, and nobody notices until a customer does. A second agent from a different vendor reads the day's work with fresh eyes. It is a **meta-sensor**, not a second worker.

## What is checked (daily)

| Area | Big mistake looks like |
|---|---|
| Money bookings | A payment booked to the wrong customer or amount; a booking without bank evidence; anything written to a tab the system must never write |
| Releases | A change that went live with a failing test, more than one change in an unattended release, or a release the rules exclude |
| Customer messages | Sent from the wrong identity, sent without a send order, wrong numbers or prices, customer data in the wrong chat |
| Rule changes | A rule added without its source label, an inference treated as binding on money or customers without a principal's yes, a copy of the shared rulebook drifting |
| Runner acts | The goal runner executed a step outside its read-only authority, wrote state outside data/output, or an unattended run tried to publish code (the deploy canary refuses the last; the watchdog reads it anyway). Parked rows (needs-review or blocked) are the runner's designed waiting states — reported, never flagged |

## Tick protocol

1. Read the day's record: commits and deploys, ledger approvals and bookings, sent-message logs, rule-file diffs, the main agent's own reports. Machine feed: `npm run scan:sessions -- --days 7` (cross-session failure scanner, `scripts/session-scan.ts`) enumerates the agent's own protocol-log failure signals — its "no new incident" line or its severity-ranked incident bundles (each needs a dated learning + a gate + a commit) are part of the tick's input. Second machine feed: `npm run discipline:tick` reads the per-session scorecards the Stop hook writes to `~/.zcode/cli/agent-discipline/` and exits non-zero while any session in the window carries a violation (timer polling, one-call turns, repeated verification). `npm run discipline:report` re-derives the same numbers from the rollout transcript when a scorecard is missing. A session that ignores the working discipline is caught by this tick, never by a principal. Third machine feed: the goal runner's record (`data/output/goal-runner-log.jsonl`, one JSON line per executed step — ts, row, capability, status, attempts, blocker). Inside the per-area binary, parked rows (needs-review or blocked) are waiting states: they surface as a report line until a principal or a reviewed spec fix unblocks them, never as a flag. A big mistake is an authority violation — a step executed outside read-only, state written outside data/output, or an unattended push that tried to publish code. Liveness is the workflow's own run record, not this log: an idle run writes nothing. The tick's own findings are written to `data/output/watchdog-findings.json` (a wrapper file {version, updated, findings: [{id, area, finding, needs: principal|spec-fix}]} — the converter refuses any other shape loudly, and a missing file resolves nothing); the goal feedback converter (`npm run goal:feedback`, hourly with the goal runner) turns each finding into a repair proposal in `data/output/goals-inbox.json`. Proposals are never executable — they become work only through a reviewed spec change; the tick writes findings, never queue rows.
2. Decide per area: quiet, or a big mistake with evidence (what, where, why it is wrong, the correct state).
3. Flag big mistakes to the main agent's queue. The main agent reverses them and reports the reversal on its next daily line. Reversals are new opposite entries; history is never edited or deleted.
4. Report to the principals: one line on a quiet day; otherwise the flagged items, plain language, outcome first.
5. Append each big mistake to the collective failures ledger (`harness/collective/failures.md` template; `npm run watchdog:bootstrap` seeds a working copy) so the class is visible to the next run.
6. Record the tick (`npm run watchdog:tick`), which updates the autonomy score.

## Autonomy score → pace

Score 0–100. Daily is the default pace. Repeated big mistakes tighten the pace (`nextIntervalSec` halves, floor 900 seconds) until days stay quiet; quiet days relax it back to daily. Gates: `src/lib/agent-watchdog.ts` (`npm run eval:agent-watchdog`).

## Anti-patterns

- Grading style instead of catching big mistakes.
- The checker fixing things itself instead of flagging them to the main agent.
- Prose-only oversight with no ledger write.
- A long report on a quiet day.
- Treating the watchdog as a money source of truth.
- A check that silently stops running (the 2026-08-24 version's fate).

Companion rules: `failure-stuck-loop-learning`, `parallel-sessions-announce`, `one-floor-in-every-tool`.
