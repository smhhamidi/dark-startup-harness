# One floor in every tool: every rule reaches every agent

> Portable craft. A rule that only one agent knows is not a team rule. Owner ruling 2026-10-05 (D-030): "I don't have to explain the same thing to claude and zcode two times."

## Law

Every rule reaches every agent the team uses. When you add or change a rule, wire it the **same turn** into **every** place an agent actually reads rules. If an agent cannot read it, record a **named exception with a reason** — never leave the gap for someone to discover later.

Models are the ceiling; rules and checks are the floor. Two agents on different vendors will be assumed to behave the same. The difference shows up exactly where it hurts: in front of a principal who has to repeat the same instruction.

## Floors (declare all, wire or exception)

| Floor | What "wired" means |
|---|---|
| Shared rulebook copy in each repository's agent entry file | The identical shared block is present; agents opened inside a repository never read above its root |
| Each agent's own pointer file | The file that agent auto-loads points at the agent entry file and does not restate policy |
| Repository rule folder + routing | Task-specific rules routed from the agent entry file (task type → doc to read first) |
| Private agent memory | Holds facts and history only; a principle found there is moved into the shared rulebook |

Retired editors are not floors. Rules are not published into the settings or plugin folders of a tool nobody uses; if it is ever used again, it reads the same agent entry files.

## In practice

1. **One rulebook, many readers** — not one copy per agent that drifts.
2. **Parity is mechanical** — a check compares every copy byte for byte (line endings aside) and fails on drift (`parityCheckId`).
3. **Justified asymmetry is declared** — e.g. a cloud session that cannot see a sibling repository; say so as a named exception, not in chat memory.
4. **Required floors** — `requiredFloorIds` is mandatory (≥2). Omitting the list is the same class of miss as wiring one agent only.

## Simple test

Ask each agent, opened inside each repository, a question the new rule answers. If one answers from the rule and another does not know it, you are not done.

## Gate

`assertOneFloorWired` requires: ≥2 floors; non-empty `requiredFloorIds` (≥2) with every entry declared; wired floors with evidence ≥8 chars; unwired floors with a named reason ≥24 chars; `parityCheckId` naming the mechanical check (≥8 chars — not a bare true). Eval: `npm run eval:one-floor`. Copy parity: `npm run check:harness` (shared rulebook copies when the sibling repositories are present, rule map, routing, published copies).
