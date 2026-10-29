# Censored-network agent access (the box-reality layer)

> Portable craft
> How agent tooling reaches the outside from a box where direct routes flip without notice and some protocols are blocked outright. The per-box setup map (kept per deployment, never in a portable doc) holds the live ports, socket paths and unit names; this doc holds the method.

Source: distilled from a live deployment's records — the transparent-redirect fix landed 2026-10-22 after the blocked-protocol tool failed for days; made portable 2026-10-26 at the principal's word that the method is generally relevant in the Iran context.

## Probe both routes before any network call

Proxy vs direct **flips over time** on a censored box — never assume yesterday's route is alive. Before the first github / cloud / package-registry call of a session, probe both and use whichever answers:

```
curl -sS -m 8 https://api.github.com/zen                            # direct
curl -x socks5h://127.0.0.1:<proxy-port> -sS -m 8 https://api.github.com/zen   # via the box's proxy client
```

CLIs that ignore proxy settings sometimes (gh login, cloud deploy tools) need the live route exported: `HTTPS_PROXY`/`HTTP_PROXY` pointing at the proxy client's local port for that one command.

## Loopback traffic must bypass the proxy — and globs are not honored

Source: distilled 2026-10-30 from a live incident (a whole automation lane read "dead" while every part of it was healthy; an independent review corrected the first diagnosis the same day — both halves below are the proven ones).

On a box where a session-wide env proxy is exported (`http_proxy`/`https_proxy`/`all_proxy`), every local-loopback call (`127.0.0.1`, `::1`) transits the proxy unless `no_proxy` matches it — and **glob entries like `127.*` or `10.*` are not honored** by curl or by Node ≥ 24 env-proxy matching (both match exact names and domain suffixes only). The fix belongs at the SOURCE: the setting that exports `no_proxy` must carry explicit entries (`127.0.0.1,::1,localhost`), never globs. Per-consumer patches leave every other spawned process holding the trap — auto-launchers, keepalive pings, tool servers that fetch a local port.

What transit actually does (each half proven live; the first diagnosis wrongly assumed only the first half):

- A **live** local origin answers normally through the proxy — a 200 whose response carries a proxy-connection header. Transit alone breaks nothing.
- A **dead** local origin surfaces as a proxied **HTTP 503** instead of a connection refusal. A liveness probe written as bare `curl -s` (no `-f`, body discarded) checks only the exit code, so the 503 reads as UP. Burnt form: an auto-launcher's port probe false-positived on the proxied 503, printed "already running", and never started the service — every client downstream then read "cannot connect" and the lane looked dead.

Rules of the trap: liveness probes use `curl -sf` (or inspect the body) whenever a proxy can answer for the origin. A 503 carrying a proxy-connection header is the proxy speaking — bypass the proxy before judging a local service down, but never conclude the proxy *breaks* local traffic without testing a live origin through it. The diagnostic control must differ only in the tested variable: a both-arms-down comparison (503 via proxy vs connection-refused when bypassed) proves transit, not causation.

## Why some tools ignore every proxy setting

A tool that speaks its **own protocol to hard-coded IP ranges** (MTProto clients are the canonical case) dials the service's data-center CIDRs directly — it bypasses environment variables, `LD_PRELOAD` wrappers and `proxychains` alike. Proven on the live box: `proxychains` around the binary changed nothing; the route below fixed it. Do not spend a second attempt on the `LD_PRELOAD` route for this class of tool — the mechanism does not see it.

## The transparent-redirect recipe (the mechanism that works)

Route the tool's packets at the firewall instead of inside the process:

1. **Match the service's CIDRs and ports, scoped to the tool's user** (`--uid-owner <daemon-user>`), in the nat OUTPUT chain, REDIRECT to a free local port — e.g. the worked example, the MTProto ranges:

   ```
   iptables -t nat -C OUTPUT -p tcp -m owner --uid-owner <daemon-user> \
     -d 149.154.160.0/20 -m multiport --dports 443,80,5222 -j REDIRECT --to-ports <door-port> \
   || iptables -t nat -A OUTPUT …same rule…
   ```

   Repeat per CIDR (the example service has four ranges). The `-C || -A` pair makes the script idempotent — re-running adds nothing.

2. **Listen on `<door-port>` with a dokodemo-door (transparent inbound) in the local proxy core** — e.g. an xray config with `dokodemo-door` on `127.0.0.1:<door-port>` forwarding to the proxy client's SOCKS outbound (its own local port). The packets arrive NAT-redirected; the door unwraps and forwards them.

3. **Wrap both in a systemd unit** (`Restart=on-failure`) so a reboot or crash re-arms the rules and the listener together — the rules without the listener are a black hole for the tool.

4. **Verify the whole chain in one look:** the tool connects, and `iptables -t nat -S OUTPUT | grep <door-port>` lists the rules. A unit that is active while the rules are missing means the `-C` pre-check believed the rule was already present — look for a typo'd CIDR, port, or user name in the script (the `-C || -A` pair only adds what `-C` says is absent).

## Box floor rules

- Ports, socket paths, unit names and the proxy client's own port are **per-box state** — they live in the per-box setup map, never here, and are re-probed at the top of every session on a new box.
- The redirect is scoped by user and destination CIDR on purpose: it must catch the tool's traffic only, never the box's other traffic. Keep the `--uid-owner` scope.
