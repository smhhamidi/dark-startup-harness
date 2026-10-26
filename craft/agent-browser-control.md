# Agent browser control (the owner's real browser)

> Portable craft
> How an agent drives a browser efficiently — the owner's signed-in sessions above all: probe before any control, one ask for the one owner-only click, the forbidden moves, and the consent/SMS/2FA handoff. Per-box install specifics (daemon path, extension id, ports) live in the per-box setup map, never here.

Source: distilled 2026-10-27 from a live deployment's browser-control records (born from a burnt day: the control route "existed" only inside agent-created throwaway profiles, so every later agent found nothing and improvised — one attempt signed the owner out of all their browser profiles).

## The two layers, probed before any control

- A browser-control route is two things: a **local daemon** plus a **browser extension** (or a debug-protocol port). Probe both before the first attempt: daemon responding AND extension connected. A failing route is a state to read, never a thing to flail at.
- **Daemon down** → start it yourself (its start command is a safe no-op) and re-probe. That layer is never an owner ask.
- **Extension not connected** → the one owner-only click (install/enable it in the real browser). Ask **once**, keep the task warm, continue when connected. Never OCR the screen, never clone profiles, never retry blind.

## The forbidden moves (each one burnt somewhere)

- Force-stopping the owner's browser.
- Cloning the user-data-dir to reach the owner's cookies — it signs the owner out of everything.
- Installing the control tool into a throwaway debug profile and calling it "installed".
- A second identical failed attempt with no new evidence — that is a stuck loop, not work.

## Two browser classes, by sign-in

- Pages needing **no** owner sign-in → the agent harness's own built-in browser is the right tool (cheaper, isolated, no owner surface at risk).
- The owner's **signed-in** sessions → the daemon+extension route, or the owner's own hands.

## Consent windows, SMS and 2FA — the handoff protocol

- OAuth/consent windows are short (tens of seconds to ~2 minutes): compress all clicks into **one scripted sequence** inside the window, and never touch the OAuth callback port with a codeless request — it kills the round.
- **Self-heal first:** an expired token often auto-refreshes on a plain retry — retry the protected call **once before** redoing the whole consent dance. A raw API call without the browser session is not a substitute for the session (it has none of the login state).
- A console the **owner already has** (CDN, host, registrar, bank): open the login in one named session → ask the owner **once** to complete login, including SMS/2FA → never loop the SSO, never auto-resend an OTP, never OCR the phone → wait for the authenticated surface to appear → then drive the console yourself and finish the original job.
- An OTP already requested in chat: submit it **in the browser session's UI**, never a second silent resend.
- Where the default browser profile blocks debugging, a **debug-profile browser** (its own user-data-dir plus a debug port) is the workable route; bot-check walls sometimes need it or the owner's own browser.

## Cleanup, same turn

Control sessions group tabs per task — close the agent's **own** session at job end; never the owner's tabs. The close-what-you-open rule in this pack governs the rest.
