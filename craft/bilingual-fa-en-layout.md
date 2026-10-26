# Bilingual FA/EN layout (owner prose)

> Portable craft. When the owner reads Persian, **no Latin letters may sit on the same line** as Persian. Cursor chat still scrambles RTL/LTR when English is mid-sentence — even inside backticks.

## Problem

Chat and markdown UIs bidirectionally reorder mixed scripts. A Persian sentence with English in the middle (bare **or** backticked) often renders with punctuation and words in the wrong order. "Match the owner's language" does not fix layout. Owner dispute 2026-08-23: backticks mid-Persian still looked broken.

## Law

When owner-facing prose includes **both** Persian script and English technical text:

1. **Own-line English (primary)** — paths, commands, rule ids, npm scripts, URLs, and status labels go on their **own line**, under **جزئیات** / **Details**, or in a **fenced block**. Zero Latin letters on any Persian line.
2. **Persian carries the sentence** — the first sentence and section headers stay Persian when the owner writes Persian.
3. **Backticks mid-Persian are not enough** for Cursor chat — treat them as a fail for owner replies.
4. **Tables** — prefer Persian-only cells in the main body; put English identifiers on separate lines under جزئیات. Do not mix Persian headers with English values in one scrambled row if the owner still sees breakage.
5. **Numbers** — write amounts in Persian prose when possible, or put the English label on its own line with the figure.

## Validity boundary

- **Mitigation, not a client fix.** Own-line English reduces mixed-script scramble. It does **not** give Cursor chat RTL, and it does **not** fix **left-aligned** RTL paragraphs in this UI.
- **Standing default (owner-locked 2026-08-23):** In Cursor chat, prefer **English** for owner-facing replies. Persian only when the owner explicitly asks that turn; expect left-aligned text if used.
- English-only replies, fenced code, and Persian-only lines with no Latin remain in scope for the gate as written.
- Does not replace nine-check owner-seat. Does not apply to storefront HTML `dir` / `lang` (product UI craft).
- When the owner needs readable Persian: use an RTL-capable surface, or accept English in Cursor chat.

## Patterns

| Bad (layout breaks) | Good |
|---|---|
| قاعده `one-floor` اعمال شد | قاعده اعمال شد. سپس خط جدا: \`one-floor-in-every-tool\` |
| مسیر `.cursor/rules/x.mdc` را ببین | مسیر را ببین. سپس خط جدا با مسیر |
| `npm run eval` سبز شد | دستور سبز شد. سپس خط جدا با دستور |
| جدول با فارسی و انگلیسی در یک سلول | جدول فقط فارسی؛ شناسه‌ها در جزئیات |

## Gate

Before sending Persian owner prose, run `assertBilingualFaEnLayout` on the draft (`npm run eval:bilingual-fa-en`). The gate rejects **any** Latin letter on a Persian line (backticks do not exempt). Pair with the last check in the shared reporting rules (AGENTS.md).

Reference: `src/lib/bilingual-fa-en-layout.ts` (`findBilingualLayoutViolations`, `assertBilingualFaEnLayout`).
