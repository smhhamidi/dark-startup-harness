# AGENT-SETUP — one paste, the first session on a new machine or project

The owner pasted you one line: "read AGENT-SETUP.md in the harness pack and
do what it says." Do this whole pass now, in one session, then report. After
this pass everything durable lives in the repo, and this file is never
needed again — the setup is a bootstrap, not a habit.

0. **Improvise the route, keep the invariants.** Some harnesses already
   build in part of this behaviour (batched tool calls, todo discipline,
   verification gates, checkpoints, session summaries). Do not rebuild what
   your harness already does — adopt the pack on top of it. The invariants
   are the four below: every rule reachable by the next session, the two
   state files started, gates earned by real defects, and the closing
   verify-and-report. The route between them is yours.

1. **Adopt the rules layer.** Copy `rules/*.mdc` from this pack into the
   project's rule directory (or as includes of the entry instruction file).
   Rules are always-managed, not always-loaded: the entry file carries the
   routing table only.
2. **Add the routing table** to the entry instruction file: task type → which
   craft doc to read first. Craft is read on demand; never load all of it.
3. **Start the two state files the pack deliberately does not carry** (see
   [PROVENANCE.md](PROVENANCE.md)): a dated **decision log** (every ruling:
   source label + date + scope + the words it came from) and a dated
   **learnings ledger** (one entry per lesson, one index line per entry).
   Empty on day one is correct — they fill as work lands. This is also how
   this machine's state reaches the standing state fast: every durable
   answer lands in a repo file the same day, never only in chat.
4. **Build the first gate early:** one self-check command the session can run
   before claiming work done — the cheapest check with the biggest effect.
   Every further gate is added only when a real defect earns one; a gate
   nobody's mistake has earned is unproven weight.
5. **Install the shipped skills** — `skills/` in this pack travels with it.
   Install each into the agent's skills directory with its provenance intact.
   A skill not shipped here arrives from the owner by hand, never from files,
   and never guessed at.
6. **If this project was started by someone else:** adopt the playbook as a
   layer on top, never a rewrite. Their code style, file layout, history and
   decisions stay theirs; the rules govern how work proceeds from now on.
   Land the adoption as one reviewed change in their repo, keep their
   conventions in everything you touch, and let the first report name what
   was adopted and what their project keeps unchanged.
7. **Updates travel by git — check for them.** At each session start (or
   the moment the owner says an update is out): pull the pack's clone
   (`git pull`), re-run the sync check — it fails on unrecorded drift vs
   upstream, which is the update arriving — adopt what changed with
   provenance recorded, and report what changed.
8. **Verify, then report.** Run the sync check (rules ↔ craft ↔ routing —
   write it if it does not exist; the pack's README names what it fails on)
   and the self-check. The report states: what was installed, what is
   deliberately absent and arrives from the owner in person (live access,
   secrets, account logins — never from files), and one next step.
