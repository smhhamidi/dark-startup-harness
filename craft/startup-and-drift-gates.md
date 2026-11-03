# Startup and drift gates (the machine behind the session-start habit)

> Portable craft
> How the adopting project puts a machine behind two instructed habits: the session-start pull-and-check line, and "never commit drifted pack copies". Ships as recipes and examples — the pack itself ships no hooks (PROVENANCE, "Enforcement levels"); the adopting project installs them and labels the result honestly.

Source: distilled 2026-11-03 from the origin deployment's own machinery (a git pre-commit drift gate, live there since 2026-10) and the first outside adoption's third field report: three failures, all text-only rules — a session-start line skipped until the owner asked, a numeric claim repeated unchecked, a lesson saved to agent memory only (the last under a rule that already read "chat memory alone is invalid" — prose present, machine absent, habit lost).

## The two gates

1. **harness:start (visibility).** One command: pull the pack clone, run the sync check, print a SHORT verdict — pack revision, problem count, file names. Session start runs it and the output lands where the agent reads.
2. **The pre-commit drift gate (the floor that refuses).** The project's pack copies are compared against the pack clone at commit time; a drifted commit is refused until the change is adopted with provenance (sync-map) or reverted. Visibility without refusal is a note; the commit gate is where harm actually lands.

## harness:start — adapt the three paths

    #!/bin/sh
    # harness:start — pull the pack clone + sync check, one-line verdict
    cd "<pack-clone-dir>" || exit 0
    git pull --ff-only || { echo "harness: pull failed (offline?) — check skipped, not forgotten"; exit 0; }
    node scripts/check-sync.mjs --rules "<project rules dir>" --craft "<project craft dir>" --pack . 2>&1 | tail -5

Best-effort always: an offline box prints one line and exits 0 — the starter must never block a session. The `2>&1` matters: the check's failure lines print to stderr, and the failure path is the path this gate exists for.

## Claude Code SessionStart hook — example

    { "hooks": { "SessionStart": [ { "hooks": [ { "type": "command", "command": "<project>/harness-start.sh" } ] } ] } }

- The hook refires on startup/resume/clear/compact — keep the injected output to two lines or it becomes the per-session bloat the rulebook itself bans.
- Exit 0 on EVERY path: a failing SessionStart hook can block CLI startup (upstream issue #23359).
- Successful stdout enters the agent's context — that is the whole point.
- Verify the exact settings schema against the host's current docs before installing; this example is the pattern, not a pinned schema.

## git pre-commit drift gate — example (the origin repo's own pattern)

    #!/bin/sh
    # pre-commit (via .git/hooks or core.hooksPath) — refuse committing drifted pack copies
    # --entry names the project's OWN entry instruction file (the one carrying the routing
    # table) — without it the check looks for ./README.md and a differently-named entry
    # file reads as a configuration problem, refusing every commit for the wrong reason.
    out="$(node "<pack-clone-dir>/scripts/check-sync.mjs" \
      --rules "<project rules dir>" --craft "<project craft dir>" \
      --entry "<project entry instruction file>" \
      --pack "<pack-clone-dir>" 2>&1)" || {
      printf '%s\n' "$out" | tail -3
      echo "commit refused: pack copies drifted vs the pack clone (or the check is misconfigured — the lines above say which) — adopt with provenance (sync-map) or revert, then re-commit"
      exit 1; }

## Enforcement honesty

Label every installed gate with the pack's enforcement levels: instructed (text only) / fixture-tested (a planted drift proves it fires) / host-integrated (the host actually ran it) / witnessed (seen refusing in real use). A gate installed but never proven to fire is instructed, whatever its config says.
