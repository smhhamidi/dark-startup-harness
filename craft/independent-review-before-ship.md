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

## Machine form (the gate is code, not prose)

The deny path of the working-discipline hook (`scripts/agent-discipline-hook.mjs`, logic in `scripts/lib/discipline-gates.mjs`) refuses four attended acts in an **attended** session — interactive, fork, or selection-side-chat — unless a fresh, independently-written PASS card is on file for that act: a git push / PR merge, a production money write, a Telegram outward send, and a rule-file rewrite (`AGENTS.md`, `harness/…`, `.cursor/rules/…`, `.cursorrules`, and the discipline harness's own scripts).

- The independent reviewer runs `node scripts/review-card.mjs write --author-session <author> --act push|money-write|telegram-send|rule-write --reviewer <you> --scope "<what changed>" --verdict PASS --reason "<one line>"`. The card records the reviewer's *own* session id from its environment, so the orchestrator only asks the reviewer to run the command — no id transcription.
- Independence is verified against the session table: the gate admits only a card naming a real `subagent_child` whose `parent_id` is the author session. This stops an accidental self-certification or a borrowed card; it is not a bar against a determined agent who can write files to disk — the floor is a compliant agent, and the daily watchdog reads the diffs after the fact.
- A card is fresh for one hour and names one act; a FAIL card is a failure-learning record, never an admit.
- The `none — <reason>` trace has no self-writable card form — a machine cannot verify "reference-only", so a rule-file typo still gets a PASS card whose scope/reason note the edit is reference-only. The gated set is deliberately broader than the prose exception: the cost of a false-positive (spawn a reviewer for a typo) is far below the cost of an unreviewed rule change.
- The gate is fail-OPEN: subagent / workflow sessions (the reviewers and isolated runners) and an unreadable database never block a session, and the deny message carries the exact remedy.
- A "production money write" means this repo's real write rails: `wrangler d1 migrations apply --remote`, `wrangler d1 execute` with `--file` (space or `=`) / a write verb, the write wrapper scripts (`rails:approve`, `topups:pass`, `batch:accounting`, `db:migrate:remote` and its `:init`/`:0002`/`:0003` sub-scripts), and a `curl` POST/PUT to a `/api/admin/` endpoint. A local migration (`db:migrate:local`, `migrations apply --local`) or a read-only `d1 execute --command "SELECT …"` is not gated.
- Known limits, all deliberate: a `git push` or rule-file rewrite wrapped in an executed heredoc or a plain redirection (`echo "x" > AGENTS.md`) is not matched (the direct form and `-c`/`-e` script bodies are; redirection is also not counted as a content edit for the lost-work counter); a `git commit --allow-empty`, a commit attempt followed by a branch switch, or a failed commit whose landing window overlaps another session's commit all move HEAD and clear the lost-work counter though nothing may be saved (the last two are single-tool-call windows; the harm is a delayed forced commit, never an unreviewed ship); and a review card is a time-boxed approval, not a single-use token bound to one commit. `npm run eval:discipline-gates` pins the deny / admit / bypass / lost-work forms.

The companion **lost-work** gate (same hook, same library) refuses the (limit+1)th file edit with no `git commit`, so a long uncommitted run cannot lose its work to a checkpoint-less context wipe. Its reset signal is this **session's** landed commit, not repo-global HEAD movement: a commit that fails, another session's commit, or a bare branch switch does not clear the counter. In a directory with no readable HEAD — no git repo, or a fresh repo before its first commit — the gate is inert (a fresh `git init`'s first edits are unguarded; a rare, accepted state).

## Gate

`npm run check:harness` (the rule must stay wired: map row, routing line, published copy). The adoption change itself ships with a recorded trace — the rule's first application.
