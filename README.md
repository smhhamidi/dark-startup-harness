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
  agents grow). Load the one the task needs, never all of them.
- `skills/` — the portable skills (reproduce-and-isolate, decision-framework,
  jobs-to-be-done), scrubbed company-local sections, provenance and
  bibliography intact. Install into the agent's skills directory.

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
3. Keep the two halves in sync mechanically: a small check that fails on a
   rule citing no craft, an unmapped craft doc, or a drifted copy.

## How this pack updates

This repository only ever receives **built output**. It is regenerated from a
private source repo by a build script and passes a scrub gate before every
push. Do not send pull requests here with content changes — the content
originates upstream. See [PROVENANCE.md](PROVENANCE.md) for what is
deliberately not here, and [CREDITS.md](CREDITS.md) for the pattern's roots.

Licence: [LICENCE](LICENCE) (MIT).
