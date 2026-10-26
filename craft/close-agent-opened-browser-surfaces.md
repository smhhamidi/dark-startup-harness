# Close agent-opened browser surfaces

> Portable craft. Testing clutter is the agent's debt, not the owner's.

## One-line hardening

Close every agent-opened browser surface when its job slice ends; never close owner-created surfaces.

## Axioms

1. Tabs, windows, debug browser profiles, remote-debugging ports, WebBridge sessions, and Cursor browser tabs the **agent** opened for probes, setup, screenshots, or tests are temporary tools.
2. Temporary tools that outlive the job become noise, login traps, and focus thieves for the next turn.
3. The owner's personal browser profile and tabs are not disposable. Closing them (or `Stop-Process` on every browser binary) signs them out and destroys live work.

## Required behaviour

- When the job slice ends (Pass, Fail, or Blocked), **same turn**: close agent-opened tabs/windows; quit agent-only debug profiles (dedicated `user-data-dir`); release CDP/WebBridge the agent started.
- Prefer closing the **specific** agent window or profile over any global kill.
- Using an owner's **already-open** logged-in tab as the fastest safe route is allowed — do not close those. Still close anything **new** the agent created alongside.

## Anti-patterns (forbidden)

- Leaving a side Chrome with `--remote-debugging-port` and Login pages open after the task.
- Ending a turn on "I'll leave the test tab open."
- `Stop-Process` / kill-all on the browser family to "clean up."
- Closing the owner's personal tabs "to reduce clutter."

## Gate

`assertAgentBrowserCleanup` in `src/lib/agent-browser-cleanup.ts` (`npm run eval:agent-browser-cleanup`).

## Validity boundary

Does not forbid owner-started debug Chrome the owner chose to keep. Does not replace secrets discipline or the ban on killing the owner's browser to steal a session. Does not require closing IDE editor tabs unless the agent opened a browser surface.
