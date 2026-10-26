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
- **Live surface** — no hosts, endpoints, account ids, file paths, tokens or
  tool inventories.
- **History** — this repository was born fresh and only ever received built
  output, so no scrubbed original hides in an earlier commit. The private
  source's history is not, and cannot be, part of this pack.
- **The build script and the source repo identity** — the derivation tooling
  stays private; if you adopt the pattern, write your own gate and prove it
  fires on a planted marker before trusting it. The gate's marker list is
  private by the same necessity: it is the list of names that must never be
  published, so it never ships here — the gate fails closed without it, and
  you write your own list.

Dates and source labels (owner ruling / agent default / agent inference) are
kept deliberately: they are the portability lesson itself, and a date alone
identifies nothing.
