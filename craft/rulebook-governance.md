# Governing the rulebook itself

> Portable craft. A rulebook maintained by agents grows on its own: every incident adds a rule and nothing removes one. Unread rules do not change behaviour, and rules written from one remark bind the principals in words they never chose. The fix is one short rule (owner review, 2026-10-05): every rule names its source, and rules nobody uses retire.

Reference gate implementation: `scripts/check-harness.ts`; the portable equivalent shipped with this pack: `scripts/check-sync.mjs` (it fails on the first four of the definition-of-done list below — the fourth, a drifted copy, only when run with `--pack <clone>`; the fifth — unstamped currently-true numbers — is project-specific and stays with the source gate).

## 1. Every rule names its source

| Label | Meaning | Binds |
|---|---|---|
| **Owner ruling** | A principal's own words or lettered pick, quoted with its date | Immediately |
| **Agent default** | A call agents made under general delegation (tools, cadence, formats) | Immediately; any principal can change it, and changing it is a setting, never a rebuild |
| **Agent inference** | A rule an agent drew from a remark or an incident, quoted with the remark and date | After it is shown once to the principals; on money or customers, only after a principal's explicit yes |

A remark is not a ruling. "Why don't you push these now?" answers one situation; promoting it to a general rule is an inference and must say so.

## 2. Keep the rulebook small

- Before adding a rule, look for one that already covers the case. Most "new rules" restate an existing one in other words.
- A mistake that recurs despite a rule is a **discoverability** defect. Fix the routing (which doc must be read before which task), not the pile.
- A one-off order (a price, a stop order, a cadence) is a dated **decision**. It lives in the decision log and stays in effect there; it does not join the rulebook.
- Prefer a mechanical check over prose where a check can block a whole family of mistakes. Do not require a guide, a rule and a check for every habit; that requirement is what made the pile grow.
- Nothing joins the always-loaded shared block unless it is rule material — always-binding. Per-task knowledge belongs in the routing/craft layer (read when a task touches it, allowed to go stale); dated prices and cadences belong in the decision log. A rule that a newer rule or principle now covers is removed in the same change, with the removal recorded as a dated decision-log note; numbers are not reused (adopted 2026-10-10 from the peer playbook's compression move, owner pick A+B; first application: the AI-credit price moved from the shared block to the decision log).

## 3. Rules nobody uses retire

A rule retires when no task has needed it, when the tool or workflow it served is gone, or when a later ruling replaced it. Retiring means removing it everywhere it is loaded (rule file, craft, map, routing line, published copies) and leaving a dated note in the decision log. Dated rulings and lessons themselves are never rewritten; they get appended amendments.

Usage is measured, not remembered (agent default, adopted 2026-10-10 from the Claude Code creator post lesson — a rules file that only grows eats adherence): every routed read is logged in the project's usage log, and a monthly retirement pass lists rules and craft docs with no logged read in the last 30 days as retirement candidates for the principals. The pass surfaces candidates; retiring itself stays a removal with a dated decision-log note.

## 4. Lessons are notes, not rules

Lessons from past incidents are searched at the start of a task on the same problem. They are never loaded by default and never treated as binding rules. A lesson becomes a rule only through section 1.

## 5. Portable versus project

- A habit that would hold in any project (how to prove a claim, how to close the loop) belongs in the portable harness.
- A habit that depends on this business's records, vendors, customers or channels is a project rule and names those specifics openly.
- Never smuggle project specifics into a portable rule.

## Definition of done for a rulebook change

1. The source label on the rule.
2. A craft doc and a rule file citing it.
3. A row in the project's rule↔craft map and a routing line in the agent entry file.
4. The rulebook gate green: it fails on an orphan rule, an unmapped craft doc, a rule citing no craft, a drifted copy, and unstamped currently-true numbers.
