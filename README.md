# dark-startup-harness

A self-improving **agent harness** for a dark company — a business run by
agents end to end, where no human is involved until a decision genuinely
needs one. This pack is the portable half of such a harness, extracted from a
live deployment and scrubbed of everything that identifies it.

## What is in the pack

- `rules/` — one file per workflow rule, in the AGENTS.md / editor-rule
  format understood by coding agents (drop them into your agent's rules
  directory; they are written to be always-managed, not always-loaded).
- `craft/` — read-by-task guides (how to prove a claim, how to fail and
  learn, how to review high-stakes output, how to govern a rulebook that
  agents grow). Load the one the task needs, never all of them:
  agent-browser-control, agent-skill-learning, agent-telegram,
  agent-watchdog, bilingual-fa-en-layout, censored-network-access,
  close-agent-opened-browser-surfaces, evidence-discipline,
  failure-stuck-loop-learning, independent-review-before-ship,
  keep-current-shared-craft, model-weight-routing, one-floor-in-every-tool,
  outcome-chain, parallel-sessions-announce, pre-task-readiness,
  proactive-onboarding-arc, public-publish-needs-ask, rulebook-governance,
  second-order-thinking, self-driving-goal-loop, self-improving-harness,
  task-continuity-contract.
- `skills/` — the portable skills (reproduce-and-isolate, decision-framework,
  jobs-to-be-done, persian-writing), scrubbed company-local sections,
  provenance and bibliography intact. Install into the agent's skills
  directory.
- `scripts/` + `MANIFEST.json` — the machine checks that travel with the pack:
  `check-scrub.mjs` (the publisher's scrub gate, fails closed), `check-sync.mjs`
  (rules ↔ craft ↔ routing consistency, drift versus this clone, and the
  manifest), `adoption-test.mjs` (a dress rehearsal of the install), and
  `MANIFEST.json` — the packing slip: every shipped file with its fingerprint,
  so a received pack can be proven complete and untampered, file by file.

Every rule names its source (owner ruling / agent default / agent inference)
and every binding lesson names a machine check. Rules nobody uses retire.

## How to adopt

Fastest route: paste your agent one line — "read AGENT-SETUP.md in this repo
and do what it says." It performs the whole first-session setup pass in one go.

1. Copy `rules/*.mdc` into your agent's rule directory (e.g.
   `.cursor/rules/` or your editor's equivalent).
2. Add one routing table to your entry instruction file: task type → which
   craft doc to read first. Craft is read on demand; only the routing table
   is always loaded.
3. Keep the two halves in sync mechanically: `scripts/check-sync.mjs` ships
   with the pack. Internal consistency always (an orphan rule, a broken
   citation, an unmapped craft doc, an unresolved skill dependency); with
   `--pack <clone>` it also fails on drift versus the pack clone — an
   update arriving. Projects that adopted the pack under their own file
   names pair them in `sync-map.txt` (next to the entry file, one line per
   file: `pack-file -> local-file`), and a provenance header stamped ahead
   of a craft copy's bytes is tolerated. Run `--self-test` once and confirm
   it fires before trusting it.
4. Test-drive the install once: `node scripts/adoption-test.mjs` from the
   pack root rehearses the whole adoption in a throwaway project — it proves
   the checks actually fire there (a planted drift fails, a recorded override
   passes, missing configuration fails closed) and that the received pack
   matches its manifest. Files copied is not files working; this is the
   difference, proven in one command.

## How this pack updates

This repository only ever receives **built output**. It is regenerated from a
private source repo by a build script and passes a scrub gate before every
push. **Receiving side:** the setup pass plants one line in the adopting
project's entry instruction file — session start: pull the pack clone and
re-run the sync check, which fails on drift versus the pack clone when an
update has arrived; adopt what changed and report. Fetching grants no
authority by itself: portable craft, tooling and fixes adopt on pull, and
a changed or new binding rule joins the project's rulebook only on the
owner's yes.

**Not technical? One paste does the whole update.** Send your project's
agent this:

> Update the harness pack: in the pack clone run `git pull`, then run
> `node scripts/adoption-test.mjs`. Then reconcile our project copies: run
> `node scripts/check-sync.mjs --rules <our rules dir> --craft <our craft dir>
> --entry <our entry file> --pack <this clone>`, and for every file it flags
> as drift, copy the pack's version over ours — anything we deliberately keep
> different goes in the overrides file, never silently. A file we adopted
> under a different name is paired in sync-map.txt, next to the entry file.
> Rerun until it passes.
> If our entry instruction file doesn't already carry the session-start update
> line from AGENT-SETUP.md step 7, add it, so future updates check themselves
> instead of waiting on a reminder. Then report in plain language: what
> changed, what was adopted, and anything that needs my decision.

(The plain `node scripts/check-sync.mjs` run proves the received pack itself
is intact; the `--rules/--craft/--pack` run is the one that compares the pack
against your project copies — a green pack check is not a green project.)

Do not send pull requests here with content changes — the content
originates upstream. See [PROVENANCE.md](PROVENANCE.md) for what is
deliberately not here, and [CREDITS.md](CREDITS.md) for the pattern's roots.

Licence: [LICENCE](LICENCE) (MIT).
