# Pre-task readiness inventory

> Portable craft. Before starting a **substantive** task, inventory and obtain what the loop needs — skills, tools, access, information — so work does not begin on hope.

Specialisation of the harness sensor + tool layers. Complements (does not replace):
- Project **ops-access-before-ask** craft (when installed) — access probe before asking the owner
- [`agent-skill-learning.md`](agent-skill-learning.md) — close skill gaps with exam Pass before claiming ready
- [`self-improving-harness.md`](self-improving-harness.md) — Pass/Fail named before acting

## One-shot human secrets (inventory bucket)

When the task needs a **one-shot secret the agent cannot obtain** (app login code, cloud 2FA password, SMS OTP, payment 3DS/captcha):

1. Put it in the **opening inventory** as an Information gap — not a mid-task surprise.
2. Automate everything *around* it (phone submit, keep daemon/`wait_code` warm, prepare the POST).
3. **Ask once**, plain language, then submit immediately when the owner replies.
4. Do **not** OCR screens, scrape Desktop UIs, or fork Multitask Mode to avoid the ask.

This is the same class as Mode A vendor payments (agent does all except iframe PAN / 3DS).

- Accounting / Match? / reconciliation
- Money writes or claims
- New domain work where competence is not already exam-ticked
- Any task that needs credentials, Drive, Sheets, Telegram, or specialized tools

**Does not apply** to: routine smoke replies, pure Q&A with no delivery, or continuing a turn after readiness was already completed for the same goal.

## Protocol (order)

1. **Name the task** and whether it is substantive.
   - **Search past lessons for this problem first** (owner review 2026-10-05): open the project's lessons index, find the one or two entries for this kind of problem, read only those. Lessons are notes — never loaded by default and never treated as rules; a lesson becomes a rule only through rulebook governance.
2. **Inventory in one opening batch** (lists may be empty only if you explicitly considered the bucket and need nothing):
   - **Skills** — domain competencies required
   - **Tools** — CLIs, scripts, MCP servers, browsers, evals
   - **Access** — credentials and live probes
   - **Information** — SoT docs, KB, owner acceptance, primary sources
   - **Test data** — fixtures, samples, dry-run inputs needed to finish without a mid-task ask
3. **Obtain gaps before starting** (one round of owner asks, not five scattered ones)
   - Skill gap → [`agent-skill-learning`](agent-skill-learning.md) until exam Pass (or block)
   - Access gap → inventory files + live probe (`ops-access-before-ask`); ask owner only for probe-failed gaps
   - Tool/info gap → install, fetch, or escalate as a hard block
4. **Only then** begin. After the opening batch, **run to completion**. Do not stop mid-task for a second owner ask that belonged in the inventory.
5. **Fetch ladder** before "unreachable": simple fetch → real browser for JS pages → local download → alternate source. Only the last rung licenses that claim.
6. **Orient before the first analysis** (money source, population, channel bias, existing docs). Availability bias is not a map.
7. **Seek current best practices** for any external tool, API, plugin, SDK, or unfamiliar domain in scope — primary docs / vendor guides / project craft — **before** implementing from chat memory alone. Mark N/A only when nothing external applies, or the competency is already exam-certified this session. Analogy-only is a fail (`bestPracticeSought`).
8. **Do not end on a closeable blocker.** If a retry is possible now (transient network, or a query shape already found this turn), do it this turn.

```
task → one-batch inventory (skills/tools/access/info/test data) → obtain gaps → best-practice seek → ready → run to completion
```

## Exploratory tasks — progressive readiness

The one-batch inventory is the bar for **predictable** execution. Research and exploratory work discovers information requirements during the investigation, and that is not a planning failure. For an exploratory task: inventory and obtain what the **first safe step** needs; start there; record each emerging gap as a blocker attached to its work item ([`task-continuity-contract.md`](task-continuity-contract.md)) and obtain it when the next dependent action needs it — one ask at the moment of need, independent branches continuing meanwhile. A requirement genuinely undiscoverable at start is not an inventory defect; an ask the opening batch should have covered still is.

## Blockers

"No access" is a **result**, not an observation. Name and try at least two routes; name the failure layer (missing key / missing path / wrong key / service down). A cookie is a credential. Gate: `assertRoutesTriedBeforeBlocker`.

**Desktop app “not running” / “can’t send”:** same class. One empty `Get-Process` name filter is not absence. Before telling the owner the app is missing: try ≥2 probes (process name **and** `Win32_Process` / `MainWindowTitle` / install path). If the owner says it is open, that is ground truth — re-probe; do not re-defend the empty result. Gate: `assertDesktopAppAbsentClaim`. Burnt example: Telegram Desktop (2026-08-25).

## Anti-patterns (forbidden)

- Starting the task, then discovering mid-loop that skill/access was missing (owner has to tell you).
- Treating chat familiarity as skill readiness without skill-learning when the domain is new or disputed.
- Implementing an external tool/API/plugin from training memory or analogy without fetching current primary docs (`bestPracticeSought=false`).
- Asking the owner for credentials without an access inventory + probe.
- Skipping the inventory because “I’ll figure it out as I go.”
- Five scattered mid-task asks. One opening inventory is cheap; drip-asks are the expensive failure mode.
- Creating disposable one-off search/query scripts (`find-*.ts`) for every ad-hoc data lookup instead of utilizing or building generalized query tooling (`npm run query`, DuckDB/SQL) or using `scratch/`.
- Claiming a desktop app is absent from one shallow process filter, then treating owner correction as optional.
- **Partial failure-learning:** admitting + one chat fix + a learnings paragraph, without craft + always-on rule + mechanical gate for the class.

## Gate

`assertPreTaskReadiness` / `assertRoutesTriedBeforeBlocker` / `assertDesktopAppAbsentClaim` in `src/lib/pre-task-readiness.ts` (`npm run eval:pre-task-readiness`).

Substantive + starting → buckets inventoried including test data; skills/tools/access/information ready; `orientedBeforeAnalyse` and `bestPracticeSought` true. `scatteredOwnerAsksAfterStart`, `leftCloseableBlocker`, and `contentFetchLadderDone` fire even mid-task (a fetch failure is not only a start-of-task event). Routine inventory is a no-op; those three locks still apply.

## Validity boundary

Does not replace Pass/Fail naming (`assertStrictGatePlan`), Class B review, or second-order thinking on high-impact acts. Readiness is the **pre-start** bar; those gates still apply once work begins.
