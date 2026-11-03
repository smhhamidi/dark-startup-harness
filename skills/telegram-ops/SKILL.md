---
name: telegram-ops
description: The trigger for any Telegram work — reading chats, sending or forwarding messages, login/auth, or debugging a Telegram CLI/daemon. Opens the project's Telegram guide before the work starts. Use when a task mentions Telegram, a chat, a channel, a DM, or sending a message.
---

# Telegram ops (trigger skill — the guide is the method)

Any Telegram work in this project starts by opening the Telegram guide — the harness pack's `craft/agent-telegram.md`; the project's entry-file routing table names its path. This skill exists so the guide is never skipped: CLI-over-daemon first, login over the daemon's HTTP API (never the TUI), named profiles pinned per task, approval before any send, untrusted-message handling.

If the routing table does not name the guide, that is an install gap: report it, do not improvise.
