# The self-driving goal loop (an agent that leads, no person starting it)

> Portable craft
> How the loop is shaped: it starts by the clock, finds its own work, executes one step, proposes its own repairs, and escalates only what a person must decide. The wiring — repos, clock host, secret names — is built per project; this doc is the recipe.

Source: distilled from a live deployment's goal runner (first slice live 2026-10-23, born from the owner's order: an agent that leads, not one that is babysat). Made portable 2026-10-26.

## The shape — two halves

1. **Execution half. ONE step per run.** It loads a **spec queue** (human-authored rows: `area`, `priority`, `step`, `command`, `capability`, `done_check` — edited only through a reviewed change, never by the loop) and a **state overlay** (the loop's own record of attempts and results — the loop writes state, never the spec). It picks the highest-priority READY row its capability class allows, runs its command, gates *done* on `done_check` exiting 0, and appends **one log line per step** so the daily check can read what the loop actually did.
2. **Repair/refill half.** Stuck rows and the daily watcher's findings convert into a **numbered inbox of proposals** — each proposal exactly the next step with its evidence and stop point. A proposal is **never executable**: the queue loader refuses proposal-shaped rows, so a proposal becomes work only through a reviewed spec change. The loop prepares its own repairs; people author them.

## The floor is code, not promises — and it is two-sided

- Every row carries a **capability class**; the selector refuses rows above the runner's class. A fooled selector still cannot write money, because:
- **The clock job carries no money-capable secrets.** A read-only command with no secrets cannot write money even when it is wrong. Neither side alone is the floor; both together are.
- **Time-box each step** (kill at the box) and gate done on the check, never on the step's own claim of success.

## State discipline

- The loop writes only under output paths the deploy pipeline ignores — a state tick never redeploys production.
- A CI guard fails the build if a state file is gitignored (the state commit would silently no-op — a measured trap).
- **A missing spec file resolves nothing**: fail loud, never silently skip. One loud contract beats a quiet wrong answer. A missing **state overlay** bootstraps empty *by design* — the run says so in its log line, and an already-done row can run once more (the overlay records it again; the done-check gate keeps the step idempotent).

## Clock reality

- A shared CI clock runs late (hours, measured) and skips top-of-hour slots — measure before trusting, and pick off-peak minutes.
- **Correctness never depends on timing:** each run reads state to know what is due, so a late run loses nothing and a doubled run is fenced by a concurrency group with no cancel-in-progress (a second run must not overwrite the state the first is still writing).
- A second, reliable fire: the loop also ticks whenever CI completes — the loop turns when the repo actually moves, independent of the schedule backlog.

## Building it in a new project

The agent needs: the spec schema above, four files (queue, state overlay, log, inbox), a no-secrets clock job, the two-sided floor, and the daily check reading the log. The loop executes and proposes; people author the specs and the rules. Same goal, different context — the recipe transfers, the machine is built fresh.
