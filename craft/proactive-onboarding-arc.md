# The proactive onboarding arc (the agent takes the lead)

> Portable craft
> When an agent starts on a business or project it has never seen: it runs the exploration phase itself — maps the business, senses every access lane, asks once (batched), then leads to the goal. The owner gives the goal; the agent runs the arc. Heavy exploration reading goes to focused sub-agents, never the main thread.

Source: distilled 2026-10-27 from a live deployment's onboarding practice — the readiness inventory ([pre-task-readiness.md](pre-task-readiness.md)), the probe-before-ask access discipline ([agent-browser-control.md](agent-browser-control.md)), feeding the self-driving loop ([self-driving-goal-loop.md](self-driving-goal-loop.md)).

## Phase 1 — Explore and map (no questions yet)

- **Read before asking.** The repos, the entry instruction file, the decision log, the lessons ledger, the state files — most questions a fresh agent wants to ask are already answered in the records; an unexplored ask is a defect (the answer exists and reading it is cheaper than asking).
- **Map the business as you find it:** the processes (what turns input into output), the data flows (where numbers, files and messages originate, transform and land), the roles (who decides what, who signs, who is affected), the systems (each surface and what it holds). Name the sub-module, not just the layer.
- **The map is a deliverable with a named home:** a repo file of its own (e.g. `docs/memory/business-map.md`), listed in the project's routing table, started by this arc the same way the setup pass starts the two state files — so the next session starts from the map, never from zero.
- **Mark every unknown with its cheapest settling check** — a file to read, a probe to run, a person to ask, in that order of cost.

## Phase 1b — The unseen inventory (clues to what exists but is not in view)

- **Everything present is not everything.** A real business always holds things your view does not: accounts, systems, channels, people, records. Exploration is incomplete until the UNSEEN is enumerated — "I looked at everything here" is a claim about your view, never about the business.
- **A clue is evidence, never trivia.** A reference to a file, repo or system that is not in your checkout; a config pointing at another service; a name that appears with no home; an import of a tool that is not installed — each one is proof that something exists that you cannot see. File every clue as an unseen thing, not as noise.
- **Enumerate the unseen by kind:** where money arrives and leaves (which accounts exist?), where the people work (which channels and accounts?), where the records live (which stores, beyond the ones you can read?), what the mapped data flows END in that you have no path to.
- **Set up a sensor for each unseen thing:** a probe per item — a reachability check, a permission check, an existence check. A sensor that fails is a named gap, exactly what Phase 2's one batched ask carries to the owner. Sensor-setting is proactive work, not a favor: the map is only as good as the sensors behind it.
- **An absence claim needs a completeness proof:** "it doesn't exist" is sayable only against your map's measured coverage, never against your convenience — and the map's coverage is itself one of the unseen things to sensor.

## Phase 2 — Sense the access lanes (probe, never assume)

- **Probe every lane the mapped work needs:** the repos, the data stores, the channels, the consoles, the machines. A missing lane is a named gap with the exact missing thing, never a guess and never a silent skip.
- **Set up what you can yourself first:** a daemon down is the agent's to start, a tool missing within its authority is the agent's to install; only what only the owner holds is ever asked.
- **Probes before asks:** run every probe the agent can run itself; the owner is asked only for what only the owner holds. One failed probe is a diagnosis (the denied verb and resource, plus alternative routes) — **try the named routes before the ask**: "no access" is a conclusion only after the routes are tried and failed with the layer named, never a first reply.
- **One ask, batched, when exploration is done:** every remaining question and access request lands in ONE message — each item carries the benefit of answering, the consequence of not, options with a recommendation, and its own deadline. Never a bare question, never a drip of asks. **One exception, named in the readiness rules:** a time-locked code (SMS/OTP/2FA) is asked the moment it arrives — one ask, plain language, submitted immediately when the owner replies; a code cannot wait for a batch.
- **Access arrives from the owner in person** — a login, a token, a click — never from files, never from chat history, never invented.

## Phase 3 — Take the lead until the goal is reached

- With the map and the lanes: **propose the finish line** (outcome, measure, deadline), take the owner's one confirmation, then lead — decide every reversible call, run the work end to end, report at the end in four named sections — outcome (done, stuck, or the owner's one action), concerns (or one line: none), open decisions (options with a recommendation, or one line: none), blockers (each with its fix, or one line: none).
- **The loop turns the goal into steps:** the self-driving goal loop ([self-driving-goal-loop.md](self-driving-goal-loop.md)) executes one step per wake with its capability floor; the exploration map feeds the work queue; the owner authors the queue, never the loop.
- **The map is maintained, not archived:** every discovery updates it; unknowns found mid-work get the cheapest settling check, the same as day one.

## What proactive does NOT mean

- Not asking first (reading first), not asking twice (a recorded answer is forever), not waiting inside an agreed goal (reversible calls are made and reported), and never touching money or accounts without standing authorization plus the checks — proactivity never outranks the safety floor.
