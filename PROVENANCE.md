# Provenance — what is deliberately NOT here

This pack is derived from a live, private deployment of the harness. The
build strips by construction, and a machine gate blocks a push if any of the
following appear:

- **The business itself** — no company, product, colleague or customer names;
  no client codes; no vendor names; no currencies or figures from the books.
- **The decision log** — dated rulings exist upstream; here only the pattern
  survives (every rule names its source and date, rulings bind through a
  decision log you keep on your side).
- **Project-specific craft** — guides that depend on this deployment's
  vendors, books or channels are labelled upstream and excluded from the
  build; only craft labelled portable is copied.
- **Live surface** — no hosts, endpoints, account ids, tokens or secrets,
  and no file paths that open anything live. Rule and craft bodies may cite
  the source deployment's code paths, commands and evals as *references*
  (they name where a rule is enforced, and none of them resolve or
  authenticate from outside); what never ships is anything reachable.
- **History** — this repository was born fresh and only ever received built
  output, so no scrubbed original hides in an earlier commit. The private
  source's history is not, and cannot be, part of this pack.
- **The build script and the source repo identity** — the derivation tooling
  stays private; if you adopt the pattern, write your own gate and prove it
  fires on a planted marker before trusting it. The gate's marker list is
  private by the same necessity: it is the list of names that must never be
  published, so it never ships here — the gate fails closed without it, and
  you write your own list.

## Referenced, not shipped

The pack's text cites a few items that are deliberately absent. Every one is
listed here so a reader can tell "deliberately absent" from "broken install":

| Referenced | Cited from | Status | If absent |
|---|---|---|---|
| `data-sufficiency` skill | jobs-to-be-done (frontmatter, judge step), decision-framework (closing note) | not shipped — owner-supplied by hand | Degrades, never blocks: judge with a named evaluation instead of a number |
| `ops-access-before-ask` craft | pre-task-readiness ("when installed") | not shipped — project-local craft, write your own | Degrades: the access-probe rules in pre-task-readiness still apply |
| `src/lib/*.ts` gates, `npm run eval:*` | every craft doc's gate lines | reference only — they name where the rule is enforced in the source deployment; none resolve from outside | Instructed, not enforced (see the levels below) |
| `check-harness.ts` | rulebook-governance | the portable equivalent ships here: `scripts/check-sync.mjs` | No gap: run the shipped check |

## Enforcement levels

Per task-continuity-contract: **instructed** (prose only) / **fixture-tested**
(a synthetic scenario passes) / **host-integrated** (wired into the host) /
**witnessed end-to-end** (observed live). In this pack, every gate line
citing `src/lib/*.ts` or `npm run eval:*` is **instructed**. What ships and
runs: `scripts/check-scrub.mjs` (fails closed; prove it fires on a planted
marker), `scripts/check-sync.mjs` (`--self-test` proves it fires on seven
planted defect classes, including a manifest fingerprint mismatch), and
`scripts/adoption-test.mjs` — a fixture install of the whole pack into a
throwaway project, the pack's own **fixture-tested** proof that the checks
behave on the receiving side, not just on the publisher's. `MANIFEST.json`
fingerprints every shipped file; `node scripts/check-sync.mjs` verifying the
manifest is the received pack's completeness check — nothing missing,
nothing swapped after packing. An installation report states **enforcement
coverage** — which checks are green because a machine ran them — never just
copied files and reachable documents.

Dates and source labels (owner ruling / agent default / agent inference) are
kept deliberately: they are the portability lesson itself, and a date alone
identifies nothing.
