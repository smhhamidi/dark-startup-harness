# Keep current with a shared craft pack

> Portable craft. Applies only when the project configures an external pack of peer craft. No hub, host or vendor is named here or in the rule — the location comes from configuration, and the habit is skipped when none is set.

## Law (owner ruling 2026-10-05, D-030 C)

Check the pack **weekly**. Do **not** claim "up to date" from chat memory: currency means the live pack version matches the version recorded in the project's stamp file.

The project's own rulebook and principles remain the source of truth. An external pack is **peer craft**, never product truth, and nothing in it binds the project until a principal says yes.

## Scope — two lanes

This guide governs **external peer packs**: another team's playbook the project borrows from. The harness pack's own update channel is a different lane (its AGENT-SETUP step 7): there, portable craft, tooling and fixes adopt on pull, and only changed or new binding rules arrive here as suggestions. In both lanes the material is respected and followed as craft — "peer craft, never product truth" settles **precedence** (whose ruling wins when the project's owner and the pack disagree), never the craft's worth.

## Check triggers (any one)

1. A week has passed since the stamp.
2. A principal asks about the pack, or whether you are up to date.
3. A failure looks like stale craft.

## Process (same turn)

1. Read the live version and the pack, read-only.
2. Update the stamp file.
3. Diff the pack's rules against the project's rulebook.
4. Each genuinely new or changed transferable rule goes to the principals in the next report as a **suggestion**, labelled agent inference, with the pack rule it came from and a one-line why. It joins the rulebook only on a principal's yes; a "no" is recorded in the stamp as a deliberate non-adoption.
5. Never import a rule silently, and never turn every new habit into a rule by default.

## Adopt the transferable part only

A shared pack usually carries another product's domain content — its stack and build scripts, its infrastructure quirks, its market, pricing and packaging, its app-release mechanics. **Do not import that.** Take the transferable craft, and record in the stamp which areas you deliberately did not adopt and why, so an unadopted area is a stated decision rather than a silent gap.

## Stamp shape (gated even with no pack URL)

The stamp is not prose in a JSON file. `assertCraftPackStampShape` (`npm run eval:craft-pack-stamp`) requires:

- a non-empty `version`
- a retrievable `locator` (`https://…`) so a later refresh can re-find the pack
- `sha256` a 64-char hex digest **or explicit `null`** — placeholders are not a hash
- non-empty `standing_habits_enforced`
- non-empty `not_adopted_deliberately`, each row long enough to be a reason

`check:craft-pack` validates that shape **before** skipping live fetch when `CRAFT_PACK_BASE_URL` is unset. Live compare still needs the URL.

## Write policy

- Reading is free.
- Writing or contributing requires an **explicit** owner order in that turn.
- Never put credentials, tokens or private operational data into a shared pack.
