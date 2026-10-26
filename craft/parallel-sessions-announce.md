# Parallel sessions announce

> Portable craft. Unfinished work and "someone is holding this right now" are different facts. Only a live claim carries the second.

## Axioms

1. Two sessions can both be right and still duplicate a goal if neither can see the other.
2. A list of unfinished tasks does not say who is working **this minute**.
3. A stale open claim is worse than none — it blocks the next session from a finished job.

## Protocol

1. Before starting a **multi-turn** goal, read the shared claims file in the repo.
2. If another session already holds that goal, join it or pick another. Do not start a second copy.
3. Write this session's claim: goal, since when, which session.
4. When done or abandoned, close the claim the same turn.

The claims file does not store unfinished-work state. That lives on the task record. This file only answers **who holds what now**. Name the file in the project's durable memory; do not keep the claim only in chat.

## Gate

`assertActiveGoalClaim` in `src/lib/active-goal-claim.ts` (`npm run eval:active-goal-claim`).

Starting a multi-turn goal: `readSharedClaims`, then either write a new claim (`wroteOwnClaim`) or set `joiningExistingClaim` when another session already holds it. A collision without joining fails. Finishing: `closedClaimWhenDoneOrAbandoned`.

## Validity boundary

Does not apply to a single-turn question. Does not replace the task file or the collab router. Does not lock a conclusion about the world.
