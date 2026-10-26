# Public publish needs an ask

> Portable craft. Hosting on an unauthenticated URL is a product decision, not a delivery detail.

## Axioms

1. "Give me the file" and "give me the link" mean deliver the artifact. They do not mean make it world-readable.
2. An unguessable URL is not access control. Anyone with the address can open it.
3. Warning the owner after the URL is live is not permission.

## What needs an explicit "make it public"

Financial statements, revenue and cost, valuations, contracts, personnel, customer or user data, third-party contracts, credentials, infrastructure maps. If it is unclear whether it is public, it is not.

## Allowed without that ask

- The file itself, in this conversation.
- A place that requires login.
- Push to a **private** git remote (unattended delivery). That is not public hosting.

## Gate

`assertPublicPublishAsked` in `src/lib/public-publish.ts` (`npm run eval:public-publish`).

Pass **every** destination this turn as `targets[]`. An unauthenticated URL anywhere in that list requires `ownerExplicitlyAskedToPublishPublic`. Labelling only `private_git_remote` while also hosting an unauthenticated URL is a bypass.

If it was published and the owner said no: `ownerSaidTakeItDown` requires `takenDownSameTurn` **and** `absenceProbedUntilGone` — prove the address no longer serves, do not claim the takedown from intent.

## Validity boundary

Does not block private git push, chat attachments, or auth-gated hosts. Does not replace secrets discipline.
